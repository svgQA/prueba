import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Modal } from '@/components/common/modal/modal';
import { FormattedDate } from "@/components/compose/forms";
import ShowFiles from '@/components/common/file/show.file';

import { useUserStore } from "@/store/slices";
import { useTranslation } from 'react-i18next';
import { useParams } from "wouter";

import { PqrsService } from "@/services/pqrs/pqrs";
import { ICPqrsRequest } from "../utils/interface";

interface IProps {
    showModal: Signal<boolean>;
    closeModal: () => void;
}

export const PqrsModal = ({ showModal, closeModal }: IProps) => {
    const { t } = useTranslation();
    const { selectedCompany } = useUserStore();
    const { id } = useParams<{ id?: string }>();

    const loading = useSignal<boolean>(false);
    const pqrs = useSignal<ICPqrsRequest | null>(null);
    const activeTab = useSignal<string>("general");

    useEffect(() => {
        if (selectedCompany) {
            fetchInitialValues();
        }
    }, [selectedCompany, id]);

    const fetchInitialValues = async () => {
        if (!id) return;
        loading.value = true;
        const response = await PqrsService.get_by_id(String(id));
        if (!response.getStatus()) return;
        pqrs.value = response.getOne();
        loading.value = false;
    }

    const tabs = [
        { id: "general", label: "General", icon: "📋" },
        { id: "dates", label: "Fechas", icon: "📅" },
        { id: "contact", label: "Contacto", icon: "👤" },
        { id: "files", label: "Archivos", icon: "📎" },
        { id: "analysis", label: "Análisis IA", icon: "🤖" }
    ];

    return (
        <Modal
            open={showModal.value}
            onClose={closeModal}
            name="modal-pqrs-details"
            width='w-2/3'
            position='fixed'
            header={<h3 className='text-xl font-medium'>{t('h_pqrs_details')}</h3>}
        >
            <div class="h-[600px] w-full flex flex-col">
                {/* Header con información principal compacta */}
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                    <div class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Cliente:</span>
                            <p class="font-semibold text-gray-900 truncate">{pqrs.value?.extraData?.clientOrCompanyName || "N/A"}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Estado:</span>
                            <p class="font-semibold text-blue-700">{pqrs.value?.status || "N/A"}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Tipo:</span>
                            <p class="font-semibold text-gray-900 capitalize">{pqrs.value?.extraData?.requestType || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Navegación por pestañas */}
                <div class="border-b border-gray-200 mb-4">
                    <nav class="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                class={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab.value === tab.id
                                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                onClick={() => activeTab.value = tab.id}
                            >
                                <span class="mr-1">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contenido de las pestañas */}
                <div class="flex-1 overflow-y-auto">
                    {activeTab.value === "general" && (
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-6">
                                {/* Información básica */}
                                <div class="space-y-3">
                                    <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Información Básica</h4>
                                    <div class="space-y-2">
                                        <div>
                                            <label class="text-xs font-medium text-gray-500">Número de Cuenta</label>
                                            <p class="text-sm text-gray-900">{pqrs.value?.extraData?.accountNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-gray-500">Ticket</label>
                                            <p class="text-sm text-gray-900 font-mono">{pqrs.value?.extraData?.ticketNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-gray-500">Tipo de Actor</label>
                                            <p class="text-sm text-gray-900 capitalize">{pqrs.value?.extraData?.actorType || "N/A"}</p>
                                        </div>
                                        {pqrs.value?.extraData?.daysToExpire && (
                                            <div>
                                                <label class="text-xs font-medium text-gray-500">Días para Expirar</label>
                                                <p class={`text-sm font-medium ${pqrs.value?.extraData?.daysToExpire <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {pqrs.value?.extraData?.daysToExpire} días
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contratos y órdenes */}
                                <div class="space-y-3">
                                    <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Contratos & Órdenes</h4>
                                    <div class="space-y-2">
                                        {pqrs.value?.extraData?.contractNumber && (
                                            <div>
                                                <label class="text-xs font-medium text-gray-500">Contrato</label>
                                                <p class="text-sm text-gray-900 font-mono">{pqrs.value?.extraData?.contractNumber}</p>
                                            </div>
                                        )}
                                        {pqrs.value?.extraData?.associatedPlan && (
                                            <div>
                                                <label class="text-xs font-medium text-gray-500">Plan</label>
                                                <p class="text-sm text-gray-900">{pqrs.value?.extraData?.associatedPlan}</p>
                                            </div>
                                        )}
                                        {pqrs.value?.extraData?.orderNumber && (
                                            <div>
                                                <label class="text-xs font-medium text-gray-500">Orden</label>
                                                <p class="text-sm text-gray-900 font-mono">{pqrs.value?.extraData?.orderNumber}</p>
                                            </div>
                                        )}
                                        {pqrs.value?.extraData?.orderStatus && (
                                            <div>
                                                <label class="text-xs font-medium text-gray-500">Estado Orden</label>
                                                <p class="text-sm text-gray-900">{pqrs.value?.extraData?.orderStatus}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            {pqrs.value?.extraData?.registerObservation && (
                                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 class="font-semibold text-gray-900 text-sm mb-2">Observaciones</h4>
                                    <p class="text-sm text-gray-700 leading-relaxed">{pqrs.value?.extraData?.registerObservation}</p>
                                </div>
                            )}

                            {/* Ticket referenciado */}
                            {pqrs.value?.extraData?.referencedTicketNumber && (
                                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <h4 class="font-semibold text-blue-900 text-sm mb-2">🔗 Ticket Referenciado</h4>
                                    <p class="text-sm text-blue-800 font-mono">{pqrs.value?.extraData?.referencedTicketNumber}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab.value === "dates" && (
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Fechas Principales</h4>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Fecha de Registro</label>
                                        <p class="text-sm text-gray-900">
                                            {pqrs.value?.extraData?.filingDate ? (
                                                <FormattedDate date={String(pqrs.value?.extraData.filingDate)} format='date' />
                                            ) : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Fecha Esperada</label>
                                        <p class="text-sm text-gray-900">
                                            {pqrs.value?.extraData?.expectedAttentionDate ? (
                                                <FormattedDate date={String(pqrs.value?.extraData.expectedAttentionDate)} format='date' />
                                            ) : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Fechas de Seguimiento</h4>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Fecha de Atención</label>
                                        <p class="text-sm text-gray-900">
                                            {pqrs.value?.extraData?.attentionDate ? (
                                                <FormattedDate date={String(pqrs.value?.extraData.attentionDate)} format='date' />
                                            ) : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Fecha de Legalización</label>
                                        <p class="text-sm text-gray-900">
                                            {pqrs.value?.extraData?.legalizationDate ? (
                                                <FormattedDate date={String(pqrs.value?.extraData.legalizationDate)} format='date' />
                                            ) : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab.value === "contact" && (
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Información de Contacto</h4>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Email</label>
                                        <p class="text-sm text-gray-900">{pqrs.value?.extraData?.contactEmail || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Canal de Recepción</label>
                                        <p class="text-sm text-gray-900">{pqrs.value?.extraData?.receptionChannel || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Asignación</h4>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Registrado por</label>
                                        <p class="text-sm text-gray-900">{pqrs.value?.extraData?.registeredBy || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-gray-500">Asignado a</label>
                                        <p class="text-sm text-gray-900">{pqrs.value?.extraData?.assignee || "Sin asignar"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab.value === "files" && (
                        <div>
                            {pqrs.value?.extraData?.hasFiles ? (
                                <div class="space-y-3">
                                    <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Archivos Adjuntos</h4>
                                    <div class="grid gap-3">
                                        {pqrs.value?.resources && (
                                            <ShowFiles
                                                resources={pqrs.value.resources}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div class="text-center py-8">
                                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                    </svg>
                                    <p class="text-sm text-gray-500">No hay archivos adjuntos</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab.value === "analysis" && (
                        <div>
                            {pqrs.value?.extraData?.informationFile ? (
                                <div class="space-y-4">
                                    <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1">Análisis de IA</h4>

                                    {pqrs.value?.extraData?.informationFile?.summaryFields?.overallSummary && (
                                        <div class="p-3 bg-blue-50 rounded-lg">
                                            <label class="block text-xs font-medium text-blue-800 mb-2">Resumen General</label>
                                            <p class="text-sm text-blue-900">{pqrs.value?.extraData?.informationFile?.summaryFields?.overallSummary}</p>
                                        </div>
                                    )}

                                    {pqrs.value?.extraData?.informationFile?.summaryFields?.mainFindings && (
                                        <div class="p-3 bg-cyan-50 rounded-lg">
                                            <label class="block text-xs font-medium text-cyan-800 mb-2">Hallazgos Principales</label>
                                            <ul class="text-sm text-cyan-900 space-y-1">
                                                {pqrs.value?.extraData?.informationFile?.summaryFields?.mainFindings.map((finding: string, index: number) => (
                                                    <li key={index} class="flex items-start">
                                                        <span class="text-cyan-600 mr-2 mt-1">•</span>
                                                        <span>{finding}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {pqrs.value?.extraData?.informationFile?.summaryFields?.recommendations && (
                                        <div class="p-3 bg-green-50 rounded-lg">
                                            <label class="block text-xs font-medium text-green-800 mb-2">Recomendaciones</label>
                                            <ul class="text-sm text-green-900 space-y-1">
                                                {pqrs.value?.extraData?.informationFile?.summaryFields?.recommendations.map((rec: string, index: number) => (
                                                    <li key={index} class="flex items-start">
                                                        <span class="text-green-600 mr-2 mt-1">•</span>
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div class="text-xs text-gray-500 text-center py-2 border-t">
                                        Análisis realizado el {pqrs.value?.extraData?.informationFile?.analysisDate ?
                                            new Date(pqrs.value?.extraData?.informationFile?.analysisDate).toLocaleDateString() :
                                            'fecha no disponible'
                                        } • {pqrs.value?.extraData?.informationFile?.filesAnalyzed || 0} archivos analizados
                                    </div>
                                </div>
                            ) : (
                                <div class="text-center py-8">
                                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-sm text-gray-500">No hay análisis de IA disponible</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};