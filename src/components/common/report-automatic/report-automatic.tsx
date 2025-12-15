import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ReportAutomaticProps } from './interface';
import { Button } from '../button/button';
import { IOption, SmartSelector } from '../smart-selector/smart-select';
import { Field, Form } from 'react-final-form';
import { useSignal } from '@preact/signals';
import { Input } from '../input/input';
import { ICReportAiRequest, modulesReport } from '@/types/form';
import { ReportService } from '@/services/form/reports';
import { ServiceService, UserService } from '@/services';
import { useUserStore } from '@/store/slices';
// import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { DateField } from '@/components/compose/forms';
import { IOptionCheck, SelectCheck } from '../select-check';
import { fileManager } from '@/utils/network/file/file';
import { IExcelGenerate } from '@/utils/network/file/interface';
import { ExpandeableContent } from './expandeable-content';
import { useTranslation } from 'react-i18next';
import { MentionOption } from '../mention-editor';
import { selectPriority } from '@/pages/settings/memo/novelty/create/create';
//import { getPermissionByModuleState } from '@/store/signals/access/permission';
import { closeSpinner, openSpinner } from '@/store/signals/modals';

interface ReportFinishedSubmit {
  form: any;
  report?: ICReportAiRequest;
  startDate?: Date | string;
  endDate?: Date | string;
}

export enum SelectCheckType {
  INTERNO = 'interno',
  CLIENTE = 'cliente',
}

export const ReportAutomatic = ({ modules }: ReportAutomaticProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const loading = useSignal(false);
  const projects = useSignal<IOption[]>([]);
  const checkList = useSignal<IOptionCheck[]>([]);
  const users = useSignal<MentionOption[]>([]);
  const priorities = useSignal<IOption[]>(selectPriority);
  const checkListSelected = useSignal<SelectCheckType | null>(null);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices(), getUsers()]);
      getFormatOptions();
    }
  }, [selectedCompany]);

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (request.getStatus()) {
      projects.value = request.getMany();
    }
  }, []);

  const getUsers = useCallback(async () => {
    const usersResponse = await UserService.get_clients_reports_simple_list();
    if (usersResponse.getStatus()) {
      users.value = usersResponse.getMany();
    }
  }, []);

  const getFormatOptions = () => {
    if (modules == modulesReport.Form) {
      checkListSelected.value = SelectCheckType.CLIENTE;
      return;
    }

    checkList.value = [
      {
        value: SelectCheckType.INTERNO,
        label: t('l_internal'),
        icon: '306',
        color: 'primary',
        //disabled: !getPermissionByModuleState('memo', 'internal:report'),
        disabled: false,
      },
      {
        value: SelectCheckType.CLIENTE,
        label: t('l_client'),
        icon: '307',
        color: 'secondary',
        //disabled: !getPermissionByModuleState('memo', 'client:report'),
        disabled: false,
      },
    ];
  };

  const onSubmit = async (model: any, form: any) => {
    loading.value = true;
    const sendEmail = !!model.sendEmail;

    if (checkListSelected.value === SelectCheckType.INTERNO) {
      return await handleFinishedSubmit({
        form,
        startDate: model.start,
        endDate: model.end,
      } as ReportFinishedSubmit);
    }

    let report: ICReportAiRequest = {
      title: model.title,
      subtitle: model.subtitle,
      description: model.description || '',
      extraData: {
        modules: [{ id: 1, name: modules }],
        // projects: Array.isArray(model.projects)
        //   ? model.projects
        //   : [model.projects],
      },
      startDate: DateUtils.dateToBackend(model.start),
      endDate: DateUtils.dateToBackend(model.end),
      user: model.userId,
      sendEmail,
      priority: model.priority || null,
    };

    await handleFinishedSubmit({ form, report } as ReportFinishedSubmit);
    loading.value = false;
  };

  //TODO: refactorizar evitar los callbacks hell
  const handleFinishedSubmit = async ({
    form,
    report,
    startDate = new Date(),
    endDate = new Date(),
  }: ReportFinishedSubmit) => {
    openSpinner();
    let reportResponse = await (checkListSelected.value ===
      SelectCheckType.CLIENTE && report
      ? ReportService.create_report_automatic({ ...report, module: modules })
      : ReportService.create_report_automatic_excel({
          mod: modules,
          startDate,
          endDate,
        }));

    if (reportResponse.getStatus()) {
      const info: any =
        checkListSelected.value === SelectCheckType.CLIENTE
          ? reportResponse.getOne()
          : reportResponse.getMany();
      checkListSelected.value === SelectCheckType.CLIENTE
        ? fileManager.downloadBase64File(info, 'application/pdf', 'report.pdf')
        : await fileManager.generateExcel(
            [
              {
                header: getHeaderExcel(startDate, endDate),
                data: info,
              } as IExcelGenerate,
            ],
            'report'
          );
      setIsOpen(false);
      form.reset();
    }
    closeSpinner();
  };

  const getHeaderExcel = (
    startDate?: Date | string,
    endDate?: Date | string
  ) => {
    const headers: Record<modulesReport, string> = {
      [modulesReport.Memo]: t('t_memorandum'),
      [modulesReport.Shift]: t('t_shift'),
      [modulesReport.Form]: t('t_inspect'),
      [modulesReport.Access]: t('t_access'),
      [modulesReport.Correspondence]: t('t_inbox'),
      [modulesReport.Response]: t('t_response'),
    };
    const header = headers[modules];
    if (startDate && endDate)
      return `${header} - ${DateUtils.dateToFrontend(startDate)} a ${DateUtils.dateToFrontend(endDate)}`;
    return header;
  };

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-report-automatic-close'
          label={t('cancel')}
          type='button'
          onClick={() => setIsOpen(false)}
          icon='041'
          disabled={loading.value}
        />
        <Button
          name='btn-report-automatic-save'
          type='submit'
          label={t('btnSave')}
          form='form-report-automatic-create'
          icon='041'
          disabled={loading.value}
        />
      </div>
    ),
    [loading.value, setIsOpen, t]
  );

  const onClose = () => {
    setIsOpen(false);
    loading.value = false;
    checkListSelected.value = null;
  };

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <div className='flex flex-row justify-between items-center'>
        <div className='h-6 w-px bg-b-light-dark dark:bg-gray-700 mx-2' />
        <Button
          name='group-none-filter'
          onClick={() => {
            setIsOpen(true);
            checkListSelected.value = null; // Reinicia la selección
            getFormatOptions(); // Vuelve a preguntar cada vez que abres
          }}
          icon='306'
          square
          transparent
          borderless
        />
      </div>
      {isOpen && (
        <ExpandeableContent
          isOpen={isOpen}
          onClose={onClose}
          width={`min-w-[800px] ${checkListSelected.value === SelectCheckType.CLIENTE ? 'min-h-[460px]' : ''}`}
          header={
            <h3>
              {modules === modulesReport.Memo
                ? t('s_title_history')
                : t('s_title')}
            </h3>
          }
          footer={footerContent}
        >
          <div className='px-4 py-6 flex flex-col w-full h-full'>
            <Form
              onSubmit={onSubmit}
              initialValues={{}}
              render={({ handleSubmit }) => {
                return (
                  <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                    id='form-report-automatic-create'
                    onKeyDown={preventKeyDown}
                  >
                    {checkListSelected.value === null && (
                      <Field<string> name='typeCheck'>
                        {({ input }) => (
                          <SelectCheck
                            {...input}
                            options={checkList.value}
                            loading={loading.value}
                            onChange={(option: any) => {
                              input.onChange(option.value);
                              checkListSelected.value =
                                option.value as SelectCheckType;
                            }}
                            size='md'
                          />
                        )}
                      </Field>
                    )}
                    {/* <Field<IOption> name='projects'>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          meta={meta}
                          id='select-projects'
                          icon='191'
                          label='h_service'
                          options={projects.value}
                          menuPortalTarget={document.body}
                          placeholder='p_select'
                          disabled={loading.value}
                        />
                      )}
                    </Field> */}
                    {checkListSelected.value !== null && (
                      <div className='py-2 grid grid-cols-2 gap-3'>
                        {checkListSelected.value ===
                          SelectCheckType.CLIENTE && (
                          <>
                            <div class='col-span-1'>
                              <Field<IOption> name='userId'>
                                {({ input, meta }) => (
                                  <SmartSelector
                                    {...input}
                                    meta={meta}
                                    id='select-user'
                                    icon='191'
                                    label='h_user'
                                    options={users.value}
                                    menuPortalTarget={document.body}
                                    placeholder='p_select'
                                  />
                                )}
                              </Field>
                            </div>
                            {modules === modulesReport.Memo && (
                              <div class='col-span-1'>
                                <Field<IOption> name='priority'>
                                  {({ input, meta }) => (
                                    <SmartSelector
                                      {...input}
                                      meta={meta}
                                      id='select-priority'
                                      icon='191'
                                      label='h_priority'
                                      options={priorities.value}
                                      menuPortalTarget={document.body}
                                      placeholder='p_select'
                                      disabled={loading.value}
                                    />
                                  )}
                                </Field>
                              </div>
                            )}
                            <div className='col-span-1'>
                              <Field<string> name='title'>
                                {({ input, meta }) => (
                                  <Input
                                    {...input}
                                    placeholder='h_title'
                                    label='h_title'
                                    meta={meta}
                                    icon='120'
                                    type='text'
                                    disabled={loading.value}
                                  />
                                )}
                              </Field>
                            </div>
                            <div
                              className={
                                modules === modulesReport.Memo
                                  ? 'col-span-1'
                                  : 'col-span-2'
                              }
                            >
                              <Field<string> name='subtitle'>
                                {({ input, meta }) => (
                                  <Input
                                    {...input}
                                    placeholder='h_subtitle'
                                    label='h_subtitle'
                                    meta={meta}
                                    icon='120'
                                    type='text'
                                    disabled={loading.value}
                                  />
                                )}
                              </Field>
                            </div>
                            {/*
                              <div className='col-span-2'>
                                <Field<string> name='description'>
                                  {({ input, meta }) => (
                                    <Input
                                      {...input}
                                      placeholder='h_description'
                                      label='h_description'
                                      meta={meta}
                                      icon='120'
                                      type='text'
                                      disabled={loading.value}
                                    />
                                  )}
                                </Field>
                              </div>
                              */}
                          </>
                        )}

                        <div class='col-span-1'>
                          <DateField name='start' label='h_date_start' />
                        </div>
                        <div class='col-span-1'>
                          <DateField name='end' label='h_date_end' />
                        </div>

                        {/* {checkListSelected.value ===
                          SelectCheckType.CLIENTE && (
                          <div class='col-span-1'>
                            <div className='col-span-2 flex items-center'>
                              <Field<boolean> name='sendEmail' type='checkbox'>
                                {({ input }) => (
                                  <label className='flex items-center gap-2'>
                                    <input
                                      type='checkbox'
                                      name={input.name}
                                      checked={input.checked}
                                      onChange={input.onChange}
                                      onBlur={input.onBlur}
                                      onFocus={input.onFocus}
                                    />
                                    {t('¿Enviar email?')}
                                  </label>
                                )}
                              </Field>
                            </div>
                          </div>
                        )} */}
                      </div>
                    )}
                  </form>
                );
              }}
            />
          </div>
        </ExpandeableContent>
      )}
    </div>
  );
};
