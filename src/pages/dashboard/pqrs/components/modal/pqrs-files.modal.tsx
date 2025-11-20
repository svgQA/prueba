import { Signal } from "@preact/signals";

import ShowFiles from '@/components/common/file/show.file';

import { ICPqrsRequest } from "../../utils/interface";


export interface IProps {
    pqrs: Signal<ICPqrsRequest | null>;
}

const PqrsFilesModal = ({ pqrs }: IProps) => {

    return (
        <div>
            {pqrs.value?.extraData?.hasFiles ? (
                <div class='space-y-3'>
                    <h4 class='font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1'>
                        Archivos Adjuntos
                    </h4>
                    <div class='grid gap-3'>
                        {pqrs.value?.resources && (
                            <ShowFiles resources={pqrs.value.resources} />
                        )}
                    </div>
                </div>
            ) : (
                <div class='text-center py-8'>
                    <svg
                        class='w-12 h-12 text-gray-300 mx-auto mb-3'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path
                            fill-rule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clip-rule='evenodd'
                        />
                    </svg>
                    <p class='text-sm text-gray-500'>No hay archivos adjuntos</p>
                </div>
            )}
        </div>
    );
}

export default PqrsFilesModal;