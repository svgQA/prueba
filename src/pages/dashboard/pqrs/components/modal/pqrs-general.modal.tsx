import { Signal } from "@preact/signals";
import { ICPqrsRequest } from "../../utils/interface";
import { FormattedDate } from "@/components/compose/forms";
import { useTranslation } from "react-i18next";


export interface IProps {
    pqrs: Signal<ICPqrsRequest | null>;
}

export interface ITextInformationProps {
    label: string;
    value: string | number | null | undefined;
}

const TextInformation = ({ label, value }: ITextInformationProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <label class='text-xs font-medium text-gray-500'>{t(label)}</label>
            <p class='text-sm text-gray-900'>{(typeof value === 'string' ? t(value) : value) || 'N/A'}</p>
        </div>
    );
}

const PqrsGeneralModal = ({ pqrs }: IProps) => {

    return (
        <div class='space-y-4'>
            <div class='grid grid-cols-2 gap-6'>
                {/* Columna Izquierda */}
                <div class='space-y-3'>
                    <div class='grid grid-cols-2 gap-x-4 gap-y-3'>
                        <TextInformation
                            label='Número de Cuenta'
                            value={pqrs.value?.extraData?.accountNumber}
                        />
                        <TextInformation
                            label='Ticket'
                            value={pqrs.value?.extraData?.ticketNumber}
                        />
                        <div>
                            <label class='text-xs font-medium text-gray-500'>
                                Fecha de Registro
                            </label>
                            <p class='text-sm text-gray-900'>
                                {pqrs.value?.extraData?.filingDate ? (
                                    <FormattedDate
                                        date={String(pqrs.value?.extraData.filingDate)}
                                        format='date'
                                    />
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>
                        <div>
                            <label class='text-xs font-medium text-gray-500'>
                                Fecha Esperada
                            </label>
                            <p class='text-sm text-gray-900'>
                                {pqrs.value?.extraData?.expectedAttentionDate ? (
                                    <FormattedDate
                                        date={String(
                                            pqrs.value?.extraData.expectedAttentionDate
                                        )}
                                        format='date'
                                    />
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>
                        <TextInformation
                            label='Email de Contacto'
                            value={pqrs.value?.extraData?.contactEmail}
                        />
                        <TextInformation
                            label='Canal de Recepción'
                            value={pqrs.value?.extraData?.receptionChannel}
                        />
                        {pqrs.value?.extraData?.daysToExpire && (
                            <div class='col-span-2'>
                                <label class='text-xs font-medium text-gray-500'>
                                    Días para Expirar
                                </label>
                                <p
                                    class={`text-sm font-medium ${pqrs.value?.extraData?.daysToExpire <= 3 ? 'text-red-600' : 'text-gray-900'}`}
                                >
                                    {pqrs.value?.extraData?.daysToExpire} días
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna Derecha */}
                <div class='space-y-3'>
                    <div class='grid grid-cols-2 gap-x-4 gap-y-3'>
                        {pqrs.value?.extraData?.contractNumber && (
                            <TextInformation
                                label='Contrato'
                                value={pqrs.value?.extraData?.contractNumber}
                            />
                        )}
                        {pqrs.value?.extraData?.associatedPlan && (
                            <TextInformation
                                label='Plan'
                                value={pqrs.value?.extraData?.associatedPlan}
                            />
                        )}
                        {pqrs.value?.extraData?.orderNumber && (
                            <TextInformation
                                label='Orden'
                                value={pqrs.value?.extraData?.orderNumber}
                            />
                        )}
                        {pqrs.value?.extraData?.orderStatus && (
                            <TextInformation
                                label='Estado Orden'
                                value={pqrs.value?.extraData?.orderStatus}
                            />
                        )}
                        <TextInformation
                            label='Registrado por'
                            value={pqrs.value?.extraData?.registeredBy}
                        />
                        <TextInformation
                            label='Asignado a'
                            value={pqrs.value?.extraData?.assignee || 'Sin asignar'}
                        />
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            {pqrs.value?.extraData?.registerObservation && (
                <div class='p-3 bg-gray-50 rounded-lg'>
                    <h4 class='font-semibold text-gray-900 text-sm mb-2'>
                        Observaciones
                    </h4>
                    <p class='text-sm text-gray-700 leading-relaxed'>
                        {pqrs.value?.extraData?.registerObservation}
                    </p>
                </div>
            )}

            {/* Ticket referenciado */}
            {pqrs.value?.extraData?.referencedTicketNumber && (
                <div class='p-3 bg-blue-50 rounded-lg'>
                    <h4 class='font-semibold text-blue-900 text-sm mb-2'>
                        🔗 Ticket Referenciado
                    </h4>
                    <p class='text-sm text-blue-800 font-mono'>
                        {pqrs.value?.extraData?.referencedTicketNumber}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PqrsGeneralModal;