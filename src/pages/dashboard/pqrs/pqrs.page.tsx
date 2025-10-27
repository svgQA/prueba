import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { Button } from "@/components/common/button/button";
import { Loading } from "@/components/common/loading/loading";

import { PqrsService } from "@/services/pqrs/pqrs";

import { ICPqrsRequest } from "./utils/interface";
import { StageService } from "@/services/pqrs/stage";
import { PqrsCards } from "./components/pqrs.card";
import { Badge } from "@/components/common/badge/badge";

interface ColumnConfig {
  id: string;
  title: string;
  color: string;
  bgColor: string;
}

export const PqrsPage: FunctionComponent = () => {
  const pqrs = useSignal<ICPqrsRequest[]>([]);
  const loading = useSignal<boolean>(true);
  const groupedPqrs = useSignal<Record<string, ICPqrsRequest[]>>({});
  const columns = useSignal<ColumnConfig[]>([]);
  const draggedItem = useSignal<ICPqrsRequest | null>(null);

  useEffect(() => {
    Promise.all([fetchingAllData()]);
  }, []);

  const fetchingAllData = async () => {
    await getPqrs();
    await getPqrsGrouped();
  }

  const getPqrs = async () => {
    loading.value = true;
    const response = await PqrsService.get_all();
    if (!response.getStatus()) return;
    pqrs.value = response.getMany();
    loading.value = false;
  }

  const getPqrsGrouped = async () => {
    loading.value = true;
    const responseStatus = await StageService.getStatusSimpleList();
    if (!responseStatus.getStatus()) return;

    responseStatus.getMany().forEach((status) => {
      const normalizedStatus = status.label.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
    });

    pqrs.value.forEach((item: ICPqrsRequest) => {
      const normalizedStatus = item.status.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
      groupedPqrs.value[normalizedStatus].push(item);
    });

    columns.value = getColumns(groupedPqrs.value);
    loading.value = false;
  }

  const getColumns = (grouped: Record<string, ICPqrsRequest[]>): ColumnConfig[] => {
    const statusKeys = Object.keys(grouped);
    const colors = [
      { color: "text-yellow-700", bgColor: "bg-yellow-50" },
      { color: "text-blue-700", bgColor: "bg-blue-50" },
      { color: "text-purple-700", bgColor: "bg-purple-50" },
      { color: "text-green-700", bgColor: "bg-green-50" },
      { color: "text-gray-700", bgColor: "bg-gray-50" },
      { color: "text-red-700", bgColor: "bg-red-50" },
      { color: "text-indigo-700", bgColor: "bg-indigo-50" },
      { color: "text-pink-700", bgColor: "bg-pink-50" },
    ];

    return statusKeys.map((status, index) => ({
      id: index.toString(),
      title: status,
      color: colors[index % colors.length].color,
      bgColor: colors[index % colors.length].bgColor,
    }));
  };

  return (
    <div class="p-6 h-full bg-gray-100">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de PQRS</h1>
          <div class="flex gap-3">
            <Button
              name="btn-refresh"
              onClick={() => Promise.all([fetchingAllData()])}
              label="h_updated"
            />
          </div>
        </div>
      </div>

      <div
        class="flex gap-6 overflow-x-auto pb-6">
        {columns.value.map((column) => {
          const items = groupedPqrs.value[column.title] ?? [];
          return (
            <div
              key={column.id}
              class={`${column.bgColor} rounded-lg p-4 min-h-96 w-80 flex-shrink-0`}
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class={`font-semibold ${column.color} flex items-center gap-2`}>
                  <div class={`w-3 h-3 rounded-full ${column.color.replace("text-", "bg-").replace("-700", "-500")}`} />
                  {column.title}
                </h3>
                <Badge label={`${items.length}`} />
              </div>

              <div class="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item: ICPqrsRequest, index) => {
                  return (
                    <PqrsCards
                      key={item.id}
                      draggedItem={draggedItem}
                      pqrs={item}
                      index={index}
                    />
                  );
                })}
                {items.length === 0 && (
                  <div class="text-center py-8 text-gray-400">
                    <p class="text-sm">No hay PQRS en esta columna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading.value && (
        <div class="flex justify-center items-center h-96">
          <Loading />
        </div>
      )}
    </div>
  );
};
