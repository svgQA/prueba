import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IFormRequest, IListResponse } from '@/types/form';
import { ListFormModal } from '../lists/lists';
import {
  FORM_AUTO_SAVE_KEY,
  getSelectedElement,
  setSelectedElement,
  validateSelectedElement,
} from './store/control';
import {
  addElement,
  addPage,
  addSection,
  FORMAT_MODE_SERVICE,
  getForm,
  getFormMode,
  removeElement,
  setSingleFormat,
  udpateGeneralForm,
  updateForm,
  updatePageForm,
  getHasUnsavedChanges,
  setHasUnsavedChanges,
  setFormat,
} from './store/question';
import { setPhonePage } from './store/phone';
import { TargetedEvent } from 'preact/compat';
import { FormButton } from '@/components/compose/button';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { FormElement } from './components/element';
import { FormPhoneViewer } from './components/phone';
import { getStatusElementSelected, toggleListModal } from '../lists/store/list';
import { ToastManager } from '@/utils/toast/toast-manager';
import { formValidation } from './utils/validation';
import { IFormError, IPageError } from '@/types/form/error.type';
import { useLocation } from 'wouter';
import { FormService, GeneralService } from '@/services';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/common/badge/badge';
import { localStorage } from '@/utils/storage';
import { MultiSelect } from './MultiSelect';
import { useSignal } from '@preact/signals';
import { useUserStore } from '@/store/slices';
import { Loading } from '@/components/common/loading/loading';
const AUTO_SAVE_INTERVAL = 4000; // 4 seconds

interface IMultiSelect {
  id: number;
  name: string;
}

export const FormCreateSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const group = useSignal<number[]>(getForm.value.groups);
  const smartGroups = useSignal<{ name: string; id: number }[]>([]);
  const { selectedCompany } = useUserStore();
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = t('p_setting');
    return () => {
      setFormat();
    };
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      getGroups();
    }
  }, [selectedCompany, location]);

  useEffect(() => {
    let timeoutId: number;
    let savingTimeoutId: number;

    const autoSave = async () => {
      if (getHasUnsavedChanges.value) {
        setIsAutoSaving(true);
        try {
          localStorage.set(FORM_AUTO_SAVE_KEY, getForm.value);
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Error auto-saving:', error);
        } finally {
          if (savingTimeoutId) {
            clearTimeout(savingTimeoutId);
          }
          savingTimeoutId = window.setTimeout(() => {
            setIsAutoSaving(false);
          }, 500);
        }
      }
    };

    const scheduleAutoSave = () => {
      timeoutId = window.setTimeout(() => {
        autoSave();
        scheduleAutoSave();
      }, AUTO_SAVE_INTERVAL);
    };

    scheduleAutoSave();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (savingTimeoutId) {
        clearTimeout(savingTimeoutId);
      }
    };
  }, [getHasUnsavedChanges.value]);

  const handleSelect = (id: string, page: string, section?: string) => {
    if (id === getSelectedElement.value?.id) return;
    setSelectedElement({ id, page, section });
    const pageIndex = getForm.value.pages.findIndex((p) => p.id === page);
    if (pageIndex >= 0) {
      setPhonePage(pageIndex);
    }
  };

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    smartGroups.value = response.getMany();
  };

  const saveFormat = async () => {
    loading.value = true;
    const [message, error] = formValidation(getForm.value);
    if (error) {
      setSingleFormat(message);
      loading.value = false;
      return ToastManager.error('s_general');
    }

    const format: IFormRequest = {
      title: getForm.value.label,
      description: getForm.value.description || '',
      structure: getForm.value,
      smart_groups: group.value,
    };

    if (getFormMode.value.mode === FORMAT_MODE_SERVICE.UPDATE) {
      if (!getFormMode.value.id) return;
      const response = await FormService.update(format, getFormMode.value.id);
      if (!response.getStatus()) return;
    } else {
      const response = await FormService.create(format);
      if (!response.getStatus()) return;
    }

    // Clear auto-save data on successful save
    localStorage.remove(FORM_AUTO_SAVE_KEY);
    setHasUnsavedChanges(false);
    navigate(PAGES_LIST_ROUTER.dashboard.setting.forms.form.to);
    loading.value = false;
  };

  const addLelement = () => {
    if (!getSelectedElement.value) return;
    addElement(getSelectedElement.value.page, getSelectedElement.value.section);
  };

  const addLsection = () => {
    if (!getSelectedElement.value) return;
    addSection(getSelectedElement.value.page);
  };

  const handleFormatInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    udpateGeneralForm(name, value);
  };

  const handlePageInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const page_id = e.currentTarget.getAttribute('data-pageid');
    if (!page_id) return;
    updatePageForm(name, value, page_id);
  };

  const onSelectedList = (element: IListResponse) => {
    const selected = getStatusElementSelected.value;
    if (!selected) return;
    updateForm(
      selected.question,
      selected.page,
      selected.section
    )(selected.field, element.structure);
    toggleListModal();
  };

  return (
    <>
      {loading.value && <Loading />}
      <div className='absolute top-14 right-2'>
        <Button
          name='bnt-create-form'
          type='button'
          label={
            getFormMode.value.mode === FORMAT_MODE_SERVICE.UPDATE
              ? 'update'
              : 'create'
          }
          icon='146'
          onClick={saveFormat}
        />
      </div>
      <section className='flex flex-row relative'>
        <div class='sticky top-1/2 -translate-y-1/2 h-10 flex flex-col gap-2'>
          <FormButton
            onClick={addLelement}
            color='bg-ternary'
            label='element'
            icon='245'
          />
          <FormButton
            onClick={addLsection}
            color='bg-primary'
            label='section'
            icon='274'
          />
          <FormButton
            onClick={addPage}
            color='bg-ternary'
            label='page'
            icon='064'
          />
        </div>
        <div class='flex-grow px-3 pb-3 min-h-[65vh] max-h-[68vh] overflow-y-auto vox-scroll-design'>
          <div className='flex flex-row w-[96%] items-center border-b-2 border-b-light-light dark:border-b-dark-light py-2 gap-5 justify-between'>
            <div className='w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer'>
              <span className='vx-icon vx-upload text-gray-400 text-2xl' />
            </div>
            <div className='flex flex-row w-full justify-between items-center gap-3'>
              <div className='flex flex-col gap-1 w-full'>
                <Input
                  type='text'
                  placeholder='p_title'
                  name='label'
                  icon='245'
                  id={`in-form-${getForm.value.id}-format-title`}
                  value={getForm.value.label}
                  onChange={handleFormatInputChange}
                  error={(getForm.value as IFormError).label_error}
                />
                <Input
                  type='text'
                  placeholder='p_description'
                  name='description'
                  icon='123'
                  id={`in-form-${getForm.value.id}-format-description`}
                  value={getForm.value.description}
                  onChange={handleFormatInputChange}
                  error={(getForm.value as IFormError).description_error}
                />
                <MultiSelect<IMultiSelect>
                  options={smartGroups.value}
                  selectedIds={group.value}
                  onChange={(selectedIds) =>
                    (group.value = selectedIds as number[])
                  }
                  getLabel={(item) => item.name}
                  getId={(item) => item.id}
                  placeholder='p_iteam'
                />
              </div>
            </div>
          </div>
          <div className='flex flex-row w-[96%] items-center my-3 gap-5 justify-end'>
            <div className='max-w-64 h-5'>
              {getHasUnsavedChanges.value && (
                <Badge
                  outline
                  status={isAutoSaving ? 'info' : 'warning'}
                  label={isAutoSaving ? 'saving' : 'unsaved'}
                  full
                />
              )}
            </div>
          </div>
          <div className='flex flex-col w-[96%] 2xl:max-w-[60vw]'>
            {getForm.value.pages.map((page) => (
              <div key={page.id} className='w-full mb-5 rounded-2xl'>
                <Input
                  type='text'
                  placeholder='p_title_page'
                  name='label'
                  id={`in-form-${page.id}-page-title`}
                  data-pageid={page.id}
                  value={page.label}
                  onChange={handlePageInputChange}
                  icon='064'
                  error={(page as IPageError).pages_error}
                />
                <div className='mt-2 w-full rounded-xl border-2 border-b-light-light dark:border-b-dark-light'>
                  <table class='w-full text-left px-2'>
                    <thead className='border-b-2 border-b-light-light dark:border-b-dark-light'>
                      <tr>
                        <th className='py-1 px-2 rounded-tl-md'>
                          {t('l_question')}
                        </th>
                        <th className='py-1 rounded-tr-md'>{t('l_type')}</th>
                      </tr>
                    </thead>
                    <DndProvider backend={HTML5Backend}>
                      <tbody>
                        {page.elements.map((element, index) => (
                          <FormElement
                            key={element.id}
                            question={element}
                            page={page.id}
                            index={index}
                            selected={validateSelectedElement(element.id)}
                            onSelect={handleSelect}
                            onDelete={removeElement}
                          />
                        ))}
                      </tbody>
                    </DndProvider>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class='sticky top-1/2 w-[400px] justify-center hidden 2xl:flex bg-blue-400 h-fit'>
          <FormPhoneViewer />
        </div>
        <ListFormModal onSelected={onSelectedList} />
      </section>
    </>
  );
};
