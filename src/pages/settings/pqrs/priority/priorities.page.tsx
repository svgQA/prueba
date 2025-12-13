import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { ROW_ACTIONS } from "@/components/common/table/enum";
import { IRowAction } from "@/components/common/table/interface";
import { showAlert } from "@/components/common/show-alert/show-alert";

import { ToastManager } from "@/utils/toast/toast-manager";
import { useUserStore } from "@/store/slices";
import { useNavigation } from '@/utils/hooks/navigation';
import { useTranslation } from "react-i18next";

import { PrioritiesService } from "@/services/pqrs/priorities";

import { ICPrioritiesResponse } from "./utils/interface";
import { Table } from "@/components/common/table/table";
import { getColumns } from "./components/priorities.columns";

const PrioritiesPage = () => {
    const { t } = useTranslation();
    const { go } = useNavigation();
    const { selectedCompany } = useUserStore();

    const priorities = useSignal<ICPrioritiesResponse[]>([]);

    useEffect(() => {
        if (selectedCompany) {
            fetchInitialData();
        }
    }, [selectedCompany]);

    const fetchInitialData = async () => {
        const [responsePriorities] = await Promise.all([PrioritiesService.get_all()]);
        if (!responsePriorities.getStatus()) return;
        priorities.value = responsePriorities.getMany();
    }

    const deleteRow = async (id: string) => {
        const req = await PrioritiesService.delete(id);
        if (!req.getStatus()) return;
        ToastManager.success('s_deleted_success');
        await fetchInitialData();
    };

    const editRow = (id: number) => {
        go({
            to: `/pqrs/priorities/update/${id}`,
            label: 'edit',
            id: 'pqrs:priorities:state:update',
            base: 'setting',
        });
    };

    const onClickAction = async (action: IRowAction) => {
        switch (action.action) {
            case ROW_ACTIONS.UPDATE:
                editRow(Number(action.id));
                break;
            case ROW_ACTIONS.DELETE:
                showAlert({
                    title: t('i_showAlert_title_zone'),
                    message: t('i_showAlert_msg_zone'),
                    onConfirm: () => {
                        void deleteRow(String(action.id));
                    },
                    onCancel: () => { },
                });
                break;
        }
    };

    return (
        <Table<ICPrioritiesResponse>
            data={priorities.value}
            columns={getColumns(onClickAction)}
            pageSize={10}
            visibility={{
                id: false,
            }}
            absolute
        />
    );
};

export default PrioritiesPage;