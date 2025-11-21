import { type FunctionComponent } from 'preact';
import {
  ELEMENT_TYPE,
  IElement,
  IRElementError,
  IResponse,
  RESPONSE_STATUS,
} from '@/types/form';
import { Checkbox } from '@/components/common/checkbox/checkbox';
import { Radio } from '@/components/common/radio/radio';
import { TextArea } from '@/components/common/text.area/text.area';
import { TargetedEvent, useState } from 'preact/compat';
import {
  getResponse,
  getResponseMode,
  setSingleResponse,
  updateResponse,
} from './store/response';
import { FormService } from '@/services';
import { File } from '@/components/common/file/file';
import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { handleChange } from '@/components/utils/input';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Switch } from '@/components/common/switch/switch';
import { Ranking } from '@/components/common/ranking/ranking';
import { responseValidation } from '@/pages/settings/forms/create/utils/validation';
import { AudioRecorder } from '@/components/common/audio/Audio.Recorder';
import { Signature } from '@/components/common/signature/signature';
import { QrCode } from '@/components/common/qr/qrCode';
import { Barcode } from '@/components/common/barcode/barcode';
import { jsonToGzipBase64 } from '@/utils/utilities/blob';
import { ReportService } from '@/services/form/reports';
import { fileManager } from '@/utils/network/file/file';
import { useUserStore } from '@/store/slices';
interface IFormResponseSettingPageProps {
  posFinishAction: () => void;
  type?: string;
}

export const FormResponseSettingPage: FunctionComponent<
  IFormResponseSettingPageProps
> = ({ posFinishAction, type }: IFormResponseSettingPageProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { getTenant, getCompanyId } = useUserStore();

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: any) =>
      prev.includes(sectionId)
        ? prev.filter((id: string) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleInputChange = (
    e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // console.log('handleInputChange', e);
    const model = handleChange(e);
    if (!model.page) return;
    updateResponse(
      model.value,
      model.name,
      model.page,
      model.section,
      model.calue
    );
  };

  const renderElement = (
    element: IRElementError,
    page?: string,
    section?: string
  ) => {
    if (element.invisible) return;
    const disabled =
      getResponseMode.value?.hold || element.disable || !element.assigned;
    const required = element.required;

    switch (element.type) {
      case ELEMENT_TYPE.SECTION:
        const isExpanded = expandedSections.includes(element.id);
        return (
          <div class='mb-4 bg-b-light dark:bg-b-dark'>
            <span />
            <button
              onClick={() => toggleSection(element.id)}
              class='w-full flex justify-between items-center p-4 rounded-lg border-0'
            >
              <span class='font-medium'>{element.label}</span>
              <span class='transform transition-transform duration-200'>
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
            {isExpanded && element.elements && (
              <div class='pl-4 mt-2'>
                {element.elements.map((el: IElement) =>
                  renderElement(el, page, element.id)
                )}
              </div>
            )}
          </div>
        );
      case ELEMENT_TYPE.TITLE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <h2 class='text-xl font-bold'>{element.label}</h2>
          </div>
        );
      case ELEMENT_TYPE.INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='text'
              label={element.label}
              icon='123'
              borderless
              value={element.value || element.default}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={disabled}
              error={element.value_error}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <TextArea
              name={element.id}
              label={element.label}
              icon='123'
              borderless
              value={element.value || element.default}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={disabled}
              error={element.value_error}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='number'
              label={element.label}
              icon='123'
              borderless
              value={element.value || element.default}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={disabled}
              error={element.value_error}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.DROPDOWN:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Select
              name={element.id}
              options={element?.options}
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={disabled}
              error={element.value_error}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Radio
              name={element.id}
              label={element.label}
              options={element.options}
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={disabled}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Checkbox
              name={element.id}
              label={element.label}
              options={element.options}
              onChange={handleInputChange}
              value={element.value}
              data-page={page}
              data-section={section}
              disabled={disabled}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.IMAGE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <File
              name={element.id}
              onChange={handleInputChange}
              data-page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              accept='image/*'
              disabled={disabled}
              area='form'
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.FILES:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <File
              name={element.id}
              onChange={handleInputChange}
              data-page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              accept=':not(image/*),.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv'
              disabled={disabled}
              area='form'
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.SWITCH:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Switch
              name={element.id}
              label={element.label}
              onChange={handleInputChange}
              value={element.value}
              disabled={disabled}
              data-page={page}
              data-section={section}
              // required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.RATING:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Ranking
              id={element.id}
              name={element.id}
              label={element.label}
              value={element.value}
              maxValue={element.max || 5}
              onChange={(value) => {
                const event = {
                  target: {
                    name: element.id,
                    value: value,
                    dataset: {
                      page,
                      section,
                    },
                  },
                } as any;
                handleInputChange(event);
              }}
              disabled={disabled}
              error={element.value_error}
              dataPage={page}
              dataSection={section}
              // required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.DATE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='date'
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              disabled={disabled}
              error={element.value_error}
              data-page={page}
              data-section={section}
              required={required}
            />
          </div>
        );
      case ELEMENT_TYPE.TIME:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='time'
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              disabled={disabled}
              error={element.value_error}
              data-page={page}
              data-section={section}
              required={required}
            />
          </div>
        );

      case ELEMENT_TYPE.AUDIO:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <AudioRecorder
              name={element.id}
              onChange={handleInputChange}
              page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              disabled={disabled}
              area='form'
              // required={required}
            />
          </div>
        );

      case ELEMENT_TYPE.SIGNATURE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Signature
              name={element.id}
              onChange={handleInputChange}
              data-page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              disabled={disabled}
              // required={required}
            />
          </div>
        );

      case ELEMENT_TYPE.QR:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <QrCode
              name={element.id}
              onChange={handleInputChange}
              page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              disabled={disabled}
              // required={required}
            />
          </div>
        );

      case ELEMENT_TYPE.BARCODE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Barcode
              name={element.id}
              onChange={handleInputChange}
              page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              disabled={disabled}
              // required={required}
            />
          </div>
        );

      default:
        return (
          <div className='bg-b-light dark:bg-b-dark p-3 my-3'>
            <Input
              name={element.id}
              type='text'
              label={element.label}
              icon='123'
              borderless
              disabled={disabled}
              error={element.value_error}
              data-page={page}
              data-section={section}
              // required={required}
            />
          </div>
        );
        {
          /*(
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            {element.type}
            <label class='block text-sm font-medium mb-1'>
              {element.label}
            </label>
            {element.description && (
              <p class='text-sm mb-2'>{element.description}</p>
            )}
          </div>
        );
        */
        }
    }
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const postPage = () => {
    if (!getResponse.value) return;
    const value = getResponse.value.pages.length - 1;
    setCurrentPage((prev) => Math.min(value, prev + 1));
  };

  const getCurrentPage = () => {
    if (!getResponse.value) return;
    return getResponse.value.pages[currentPage].id;
  };

  const saveResponse = async () => {
    if (!getResponse.value || !getResponseMode?.value?.id) return;
    // console.log('saveResponse', getResponse.value);

    // TODO: No borrar esta parte que es para guardar donde se puede dejar como se quiera
    // el formulario
    const [structure, error] = responseValidation(getResponse.value);
    if (error) {
      setSingleResponse(structure as IResponse);
      return ToastManager.error('form.error.general');
    }

    const newStructure = jsonToGzipBase64(getResponse.value);

    const response = await FormService.update_response(
      { structure: newStructure, status: RESPONSE_STATUS.OPENED },
      getResponseMode.value.id
    );
    if (!response.getStatus()) return;
    posFinishAction();
  };

  const finishResponse = async () => {
    if (!getResponse.value) return;
    const [structure, error] = responseValidation(getResponse.value);
    if (error) {
      setSingleResponse(structure as IResponse);
      return ToastManager.error('s_general');
    }

    if (!getResponse?.value || !getResponseMode?.value?.id) return;
    const newStructure = jsonToGzipBase64(getResponse.value);
    const response = await FormService.update_response(
      { structure: newStructure, status: RESPONSE_STATUS.CLOSED },
      getResponseMode.value.id
    );
    if (!response.getStatus()) return;
    posFinishAction();
  };

  const handleGenerateReport = async () => {
    const id = getResponseMode.value?.id;
    const reportResponse = await ReportService.generate_report_automatic_form(
      String(id)
    );
    if (!reportResponse.getStatus())
      return ToastManager.error('s_download_file_error');
    await fileManager.downloadFile({
      url: fileManager.getUrl(
        getTenant(),
        getCompanyId(),
        reportResponse.getOne()
      ),
    });
  };

  const handleShareReport = async () => {
    const id = getResponseMode.value?.id;
    const tenant = getTenant();
    const currentUrl = window.location.origin;

    if (!id || !tenant) {
      return ToastManager.error('s_getted_error');
    }

    const url = `${currentUrl}/response?responseId=${id}&tenant=${tenant}`;

    try {
      await navigator.clipboard.writeText(url);
      ToastManager.success('s_url_copied');
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        ToastManager.success('s_url_copied');
      } catch (err) {
        ToastManager.error('s_url_error');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section className='pt-5 max-h-[72vh] overflow-auto vox-scroll-design'>
      {getResponse.value && (
        <div className='max-w-4xl mx-auto py-4 px-8 bg-b-light-dark dark:bg-b-dark-light rounded-md'>
          <div className='w-full flex flex-col justify-between items-center'>
            <div className='flex flex-row justify-between w-full'>
              <h1 className='text-2xl font-bold mb-6'>
                {getResponse.value.label}
              </h1>
              {getResponseMode.value?.hold && (
                <div className='mb-6 flex justify-end'>
                  {/* <Button
                    type='button'
                    onClick={handleGenerateReport}
                    name='btn-response-preview'
                    icon='411'
                    label='h_generate_report'
                    className='mb-4'
                  /> */}
                  <Button
                    type='button'
                    onClick={handleShareReport}
                    name='btn-response-preview'
                    icon='411'
                    label='h_share_report'
                    className='mb-4'
                  />
                </div>
              )}
              {type !== 'VIEW' && (
                <div className='flex flex-row gap-2'>
                  <Button
                    type='button'
                    onClick={finishResponse}
                    name='btn-finish-response'
                    icon='137'
                    label='finish'
                  />
                  <Button
                    type='button'
                    onClick={saveResponse}
                    name='btn-save-response'
                    icon='134'
                    label='save'
                  />
                </div>
              )}
            </div>

            {getResponse.value.description && (
              <p className='mb-8'>{getResponse.value.description}</p>
            )}
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
              {getResponse.value.pages[currentPage].label}
            </h2>
            {getResponse.value.pages[currentPage].elements.map((element) =>
              renderElement(element, getCurrentPage())
            )}
          </div>

          {!(currentPage === getResponse.value.pages.length - 1) && (
            <div className='flex justify-between items-center'>
              <Button
                name='btn-response-prev'
                type='button'
                label='previus'
                icon='003'
                onClick={prevPage}
              />
              <span className='text-sm'>
                Page {currentPage + 1} of {getResponse.value.pages.length}
              </span>
              <Button
                name='btn-response-next'
                type='button'
                label='next'
                icon='004'
                end
                disabled={currentPage === getResponse.value.pages.length - 1}
                onClick={postPage}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
