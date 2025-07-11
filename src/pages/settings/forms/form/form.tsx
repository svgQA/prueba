import { useLocation } from 'wouter';
import { getColumns } from './components/form.columns';
import { useEffect, useState } from 'preact/hooks';
import { FormService } from '@/services';
import { useSignal } from '@preact/signals';
import { IFormResponse, IFormat } from '@/types/form';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
// import { setReport, updateReport } from '../report/store/report';
import { RESPONSE_MODE_SERVICE, setResponse } from '../response/store/response';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { FORMAT_MODE_SERVICE, setFormat } from '../create/store/question';
import { Table } from '@/components/common/table/table';
import { appendHistory } from '../../store/settings';
// import { Section } from '@/components/common/section/section';
// import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/common/badge/badge';
import { localStorage } from '@/utils/storage';
import { FORM_AUTO_SAVE_KEY } from '../create/store/control';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { validateResponse } from '@/pages/dashboard/forms/response/store/response';
import { ToastManager } from '@/utils/toast/toast-manager';
import { closeSettingModal } from '@/store/signals/modals/settings/settings.signal';
import { useUserStore } from '@/store/slices';

export const FormSettingPage = () => {
  const { t } = useTranslation();
  const forms = useSignal<IFormResponse[]>([]);
  const [_, navigate] = useLocation();
  const [hasUnfinishedForm, setHasUnfinishedForm] = useState(false);
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = t('p_form');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      Promise.all([getFormsHandler(), checkUnfinishedForm()]);
    }
  }, [selectedCompany, location]);

  const checkUnfinishedForm = () => {
    const savedData = localStorage.get<IFormat>(FORM_AUTO_SAVE_KEY);
    if (savedData && typeof savedData === 'object') {
      setHasUnfinishedForm(true);
    }
  };

  const continueUnfinishedForm = () => {
    const savedData = localStorage.get<IFormat>(FORM_AUTO_SAVE_KEY);
    if (!savedData || typeof savedData !== 'object') return;
    redirect(savedData);
  };

  const getFormsHandler = async () => {
    loading.value = true;
    const response = await FormService.get_all();
    if (response.getStatus()) {
      forms.value = response.getMany();
    }
    loading.value = false;
  };

  const navigateReport = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.report.to,
      label: 'report',
      id: 'form-report',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const navigateResponse = () => {
    /**
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.response.to,
      label: 'response',
      id: 'form-response',
    };
    appendHistory(menu);
    navigate(menu.to);
     **/
    closeSettingModal('/forms');
  };

  const redirect = (model?: IFormat) => {
    setFormat({ mode: FORMAT_MODE_SERVICE.CREATE }, model);
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.form.create.to,
      label: 'create',
      id: 'form-create',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const handleOnClick = async (action: IRowAction) => {
    const format = forms.value.find((format) => format.id == action.id);
    if (!format?.structure) throw Error(t('form.error.general'));
    const groups = format.groups?.map((group) => group.group.id) || [];
    switch (action.action) {
      case ROW_ACTIONS.UPDATE: {
        const menu = {
          to: PAGES_LIST_ROUTER.dashboard.setting.forms.form.create.to,
          label: 'create',
          id: 'form-create',
        };
        appendHistory(menu);
        setFormat(
          { mode: FORMAT_MODE_SERVICE.UPDATE, id: format.id },
          { ...format.structure, groups: groups }
        );
        navigate(menu.to);
        break;
      }
      case ROW_ACTIONS.DELETE: {
        const response = await FormService.delete(format.id);
        if (!response.getStatus()) return;
        getFormsHandler();
        break;
      }
      case ROW_ACTIONS.RESPONSE: {
        if (!validateResponse(format.structure)) {
          ToastManager.error('s_structure_error');
          return;
        }
        const response = await FormService.create_response({
          formId: format.id,
          structure: format.structure,
        });
        if (!response.getStatus()) return;
        const responseModel = response.getOne();
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: responseModel.id },
          responseModel.structure
        );
        return navigateResponse();
      }
      case ROW_ACTIONS.REPORT: {
        // if (!format.report) {
        //   updateReport('formId', format.id);
        //   return navigateReport();
        // }
        // const response = await FormService.get_report_by_id(format.report.id);
        // if (!response.getStatus()) {
        //   updateReport('formId', format.id);
        // } else {
        //   setReport(response.getOne());
        // }
        return navigateReport();
      }
      default:
        break;
    }
  };

  const handleContinueUnfinishedForm = () => {
    localStorage.remove(FORM_AUTO_SAVE_KEY);
    setHasUnfinishedForm(false);
  };

  const handleRemoveUnfinishedForm = () => {
    showAlert({
      title: 'Eliminar Formulario',
      message: '¿Estás seguro que quieres eliminar el formulario guardado?',
      onConfirm: handleContinueUnfinishedForm,
      onCancel: () => {},
    });
  };

  /*
  const handleContinueCreatingForm = () => {
    if (!hasUnfinishedForm) return redirect();
    showAlert({
      title: 'Continuar Formulario',
      message:
        '¿Estás seguro que quieres continuar, esto eliminará el formulario guardado?',
      onConfirm: redirect,
      onCancel: () => {},
    });
  };
  */

  return (
    <>
      <div className='flex flex-row items-center justify-between absolute top-16 left-28'>
        {hasUnfinishedForm && (
          <div
            onClick={continueUnfinishedForm}
            className='cursor-pointer hover:opacity-80'
          >
            <Badge
              status='warning'
              label='l_form_continue'
              full
              outline
              icon='039'
              size='sm'
              onRemove={handleRemoveUnfinishedForm}
            />
          </div>
        )}
      </div>
      <Table<IFormResponse>
        data={forms.value}
        columns={getColumns(handleOnClick)}
        pageSize={10}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
