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

import { Table } from "@/components/common/table/table";
import { getColumns } from "./components/resources.columns";
import { IResourceResponse } from "@/types/memo/memo.response";
import { ResourceService } from "@/services/form/resources";

const ResourcesPage = () => {
    const { t } = useTranslation();
    const { go } = useNavigation();
    const { selectedCompany } = useUserStore();

    const resources = useSignal<IResourceResponse[]>([]);

    useEffect(() => {
        if (selectedCompany) {
            fetchInitialData();
        }
    }, [selectedCompany]);

    const fetchInitialData = async () => {
        const [responseResources] = await Promise.all([ResourceService.get_all()]);
        if (!responseResources.getStatus()) return;
        resources.value = responseResources.getMany();
    }

    const deleteRow = async (id: string) => {
        const req = await PrioritiesService.delete(id);
        if (!req.getStatus()) return;
        ToastManager.success('s_deleted_success');
        await fetchInitialData();
    };

    const editRow = (id: number) => {
        go({
            to: `/pqrs/resources/update/${id}`,
            label: 'edit',
            id: 'pqrs:resources:state:update',
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
        <Table<IResourceResponse>
            data={resources.value}
            columns={getColumns(onClickAction)}
            pageSize={10}
            visibility={{
                id: false,
            }}
            absolute
        />
    );
};

export default ResourcesPage;