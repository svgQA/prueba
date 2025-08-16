import { Button } from '@/components/common/button/button';
import { ExpandeableContent } from '@/components/common/report-automatic/expandeable-content';
import { DateField } from '@/components/compose/forms';
import { useSignal } from '@preact/signals';
import { Table } from '@tanstack/react-table';
import { useCallback, useMemo } from 'preact/hooks';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';

interface Props<T> {
    table: Table<T>;
    className?: string;
}

export const RangeDateFilter = <T,>({ table }: Props<T>) => {
    const { t } = useTranslation();
    const loading = useSignal(false);
    const isOpen = useSignal(false);

    const onSubmit = async (model: any, form: any) => {
        loading.value = true;
        loading.value = false;
    };

    const footerContent = useMemo(
        () => (
            <div className='flex justify-end items-center gap-2 p-4'>
                <Button
                    name='btn-report-automatic-close'
                    label='cancel'
                    type='button'
                    onClick={() => isOpen.value = false}
                    icon='041'
                    disabled={loading.value}
                />
                <Button
                    name='btn-report-automatic-save'
                    type='submit'
                    label='save'
                    form='form-report-automatic-create'
                    icon='041'
                    disabled={loading.value}
                />
            </div>
        ),
        [loading.value]
    );

    const onClose = () => {
        isOpen.value = false;
        loading.value = false;
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
                    onClick={() => isOpen.value = true}
                    icon='319'
                    square
                    transparent
                    borderless
                />
            </div>
            {isOpen && (
                <ExpandeableContent
                    isOpen={isOpen.value}
                    onClose={onClose}
                    width='min-w-[800px]'
                    header={
                        <h3>{t('h_filter_date')}</h3>
                    }
                    footer={footerContent}
                >
                    <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
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
                                        <div className='py-2 grid grid-cols-2 gap-3'>
                                            <div class='col-span-1'>
                                                <DateField name='start' label='h_date_start' />
                                            </div>
                                            <div class='col-span-1'>
                                                <DateField name='end' label='h_date_end' />
                                            </div>
                                        </div>
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