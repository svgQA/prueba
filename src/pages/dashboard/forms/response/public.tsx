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
interface IResponseUser {
  name?: string;
  surname?: string;
  email?: string;
  image?: { file?: string };
}

interface IResponseCompany {
  name?: string;
}

interface IFormResponseSettingPageProps {
  posFinishAction: () => void;
  type?: string;
  user?: IResponseUser | null;
  company?: IResponseCompany | null;
}

export const FormResponsePublicPage: FunctionComponent<
  IFormResponseSettingPageProps
> = ({ posFinishAction, type, user, company }: IFormResponseSettingPageProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { getTenant, getCompanyId } = useUserStore();

  const totalPages = getResponse.value?.pages.length ?? 0;
  const currentPageData = getResponse.value?.pages[currentPage];
  const progress = totalPages
    ? Math.round(((currentPage + 1) / totalPages) * 100)
    : 0;

  const avatar = user?.image?.file;
  const fullName = [user?.name, user?.surname].filter(Boolean).join(' ');
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
    const disabled = true;
    const required = element.required;

    switch (element.type) {
      case ELEMENT_TYPE.SECTION:
        const isExpanded = expandedSections.includes(element.id);
        return (
          <div class='mb-4 bg-b-light text-slate-900 dark:bg-b-dark'>
            <span />
            <button
              onClick={() => toggleSection(element.id)}
              class='w-full flex justify-between items-center p-4 rounded-lg border-0 text-left'
            >
              <span class='font-medium text-slate-900 dark:text-white'>
                {element.label}
              </span>
              <span class='transform transition-transform duration-200 text-slate-600 dark:text-white/70'>
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
            {isExpanded && element.elements && (
              <div class='pl-4 mt-2 text-slate-900 dark:text-white'>
                {element.elements.map((el: IElement) =>
                  renderElement(el, page, element.id)
                )}
              </div>
            )}
          </div>
        );
      case ELEMENT_TYPE.TITLE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
            <h2 class='text-xl font-bold text-slate-900 dark:text-white'>{element.label}</h2>
            {element.description && (
              <p class='mt-1 text-sm text-slate-600 dark:text-white/70'>{element.description}</p>
            )}
          </div>
        );
      case ELEMENT_TYPE.INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-slate-900 dark:bg-b-dark'>
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
          <div className='bg-b-light text-slate-900 dark:bg-b-dark p-3 my-3'>
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
          <div class='mb-4 p-4 rounded-lg bg-b-light text-t-dark dark:bg-b-dark'>
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
    console.log('tenant', tenant);
    console.log('id', id);
    console.log('currentUrl', currentUrl);
    const url = `/${currentUrl}/response?responseId=${id}&tenant=${tenant}`;
    console.log('url', url);
    //window.open(url, '_blank');
  };

  return (
    <section className='relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b1f33] via-[#0f2747] to-[#0b1f33]'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.18),transparent_25%)]' />
      {getResponse.value && (
        <div className='relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10'>
          <div className='grid gap-6 lg:grid-cols-[1.25fr,0.9fr]'>
            <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl backdrop-blur-md sm:p-8'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 ring-1 ring-white/15'>
                {company?.name || 'Formulario público'}
              </div>
              <h1 className='mt-4 text-3xl font-extrabold leading-tight md:text-4xl'>
                {getResponse.value.label}
              </h1>
              {getResponse.value.description && (
                <p className='mt-3 max-w-2xl text-base leading-relaxed text-white/80'>
                  {getResponse.value.description}
                </p>
              )}

              <div className='mt-8 grid grid-cols-2 gap-3 text-sm text-white/80 sm:grid-cols-3'>
                <div className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
                  <p className='text-xs uppercase tracking-wide text-white/60'>Páginas</p>
                  <p className='text-2xl font-bold text-white'>{totalPages}</p>
                </div>
                <div className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
                  <p className='text-xs uppercase tracking-wide text-white/60'>En progreso</p>
                  <p className='text-2xl font-bold text-white'>
                    {currentPage + 1} / {totalPages || 1}
                  </p>
                </div>
                <div className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:block hidden'>
                  <p className='text-xs uppercase tracking-wide text-white/60'>Estado</p>
                  <p className='text-2xl font-bold text-white'>
                    {getResponseMode.value?.hold ? 'Borrador' : 'Abierto'}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl backdrop-blur-md sm:p-8'>
              <div className='flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10'>
                <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40'>
                  {avatar ? (
                    <img src={avatar} alt={fullName} className='h-full w-full object-cover' />
                  ) : (
                    <span className='text-lg font-semibold'>{initials || 'UX'}</span>
                  )}
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-semibold text-white'>
                    {fullName || 'Usuario invitado'}
                  </p>
                  <p className='text-xs text-white/80'>{user?.email || 'Correo no disponible'}</p>
                </div>
              </div>

              <div className='rounded-2xl bg-white/10 p-4 ring-1 ring-white/10'>
                <p className='text-xs font-semibold uppercase tracking-wide text-white/70'>
                  Compañía
                </p>
                <p className='text-lg font-bold text-white'>
                  {company?.name || 'Compañía no disponible'}
                </p>
              </div>

              <div className='rounded-2xl bg-white/10 p-4 ring-1 ring-white/10'>
                <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/70'>
                  <span>Progreso</span>
                  <span className='text-white'>
                    {progress}%
                  </span>
                </div>
                <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 shadow-lg transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-10 rounded-3xl bg-white p-6 text-t-dark shadow-xl ring-1 ring-gray-100'>
            <div className='mb-6 flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-primary'>
                  Página {currentPage + 1} de {totalPages}
                </p>
                <h2 className='text-2xl font-bold text-slate-900'>
                  {currentPageData?.label}
                </h2>
                {getResponse.value.description && (
                  <p className='mt-1 text-sm text-gray-700'>
                    {getResponse.value.description}
                  </p>
                )}
              </div>
              {type !== 'VIEW' && (
                <div className='flex flex-wrap items-center gap-2'>
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
              {getResponseMode.value?.hold && (
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    onClick={handleShareReport}
                    name='btn-response-preview'
                    icon='411'
                    label='h_share_report'
                    className='mb-0'
                  />
                </div>
              )}
            </div>

            <div className='space-y-4'>
              {currentPageData?.elements.map((element) =>
                renderElement(element, getCurrentPage())
              )}
            </div>

            <div className='mt-8 flex flex-col gap-3 rounded-2xl bg-gray-50 p-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex items-center gap-3'>
                <Button
                  name='btn-response-prev'
                  type='button'
                  label='previus'
                  icon='003'
                  rounded
                  mode='secondary'
                  className='rounded-full border border-primary/30 bg-white px-5 py-2 font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60'
                  onClick={prevPage}
                  disabled={currentPage === 0}
                />
                <Button
                  name='btn-response-next'
                  type='button'
                  label='next'
                  icon='004'
                  end
                  mode='primary'
                  rounded
                  className='rounded-full bg-gradient-to-r from-primary to-blue-500 px-6 py-2 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60 disabled:saturate-50'
                  disabled={currentPage === totalPages - 1}
                  onClick={postPage}
                />
              </div>
              <div className='flex items-center gap-3 text-sm text-gray-600'>
                <div className='h-2 w-24 overflow-hidden rounded-full bg-white'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className='font-semibold text-t-dark'>Avance {currentPage + 1} / {totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
