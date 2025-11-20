import { Signal } from "@preact/signals";
import { ICPqrsRequest } from "../../utils/interface";


export interface IProps {
    pqrs: Signal<ICPqrsRequest | null>;
}

const PqrsInferenceModal = ({ pqrs }: IProps) => {

    return (
        <div>
            {pqrs.value?.extraData?.informationFile ? (
                <div class='space-y-4'>
                    <h4 class='font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1'>
                        Análisis de IA
                    </h4>

                    {pqrs.value?.extraData?.informationFile?.summaryFields
                        ?.overallSummary && (
                            <div class='p-3 bg-blue-50 rounded-lg'>
                                <label class='block text-xs font-medium text-blue-800 mb-2'>
                                    Resumen General
                                </label>
                                <p class='text-sm text-blue-900'>
                                    {
                                        pqrs.value?.extraData?.informationFile?.summaryFields
                                            ?.overallSummary
                                    }
                                </p>
                            </div>
                        )}

                    {pqrs.value?.extraData?.informationFile?.summaryFields
                        ?.mainFindings && (
                            <div class='p-3 bg-cyan-50 rounded-lg'>
                                <label class='block text-xs font-medium text-cyan-800 mb-2'>
                                    Hallazgos Principales
                                </label>
                                <ul class='text-sm text-cyan-900 space-y-1'>
                                    {pqrs.value?.extraData?.informationFile?.summaryFields?.mainFindings.map(
                                        (finding: string, index: number) => (
                                            <li key={index} class='flex items-start'>
                                                <span class='text-cyan-600 mr-2 mt-1'>•</span>
                                                <span>{finding}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                    {pqrs.value?.extraData?.informationFile?.summaryFields
                        ?.recommendations && (
                            <div class='p-3 bg-green-50 rounded-lg'>
                                <label class='block text-xs font-medium text-green-800 mb-2'>
                                    Recomendaciones
                                </label>
                                <ul class='text-sm text-green-900 space-y-1'>
                                    {pqrs.value?.extraData?.informationFile?.summaryFields?.recommendations.map(
                                        (rec: string, index: number) => (
                                            <li key={index} class='flex items-start'>
                                                <span class='text-green-600 mr-2 mt-1'>•</span>
                                                <span>{rec}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                    <div class='text-xs text-gray-500 text-center py-2 border-t'>
                        Análisis realizado el{' '}
                        {pqrs.value?.extraData?.informationFile?.analysisDate
                            ? new Date(
                                pqrs.value?.extraData?.informationFile?.analysisDate
                            ).toLocaleDateString()
                            : 'fecha no disponible'}{' '}
                        •{' '}
                        {pqrs.value?.extraData?.informationFile?.filesAnalyzed || 0}{' '}
                        archivos analizados
                    </div>
                </div>
            ) : (
                <div class='text-center py-8'>
                    <svg
                        class='w-12 h-12 text-gray-300 mx-auto mb-3'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <p class='text-sm text-gray-500'>
                        No hay análisis de IA disponible
                    </p>
                </div>
            )}
        </div>
    );
}

export default PqrsInferenceModal;