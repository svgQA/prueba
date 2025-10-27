import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Modal } from "@/components/common/modal/modal";
import { FormattedDate } from "@/components/compose/forms";
import { Button } from "@/components/common/button/button";

import { useUserStore } from "@/store/slices";
import { useParams } from "wouter";

import { PqrsService } from "@/services/pqrs/pqrs";
import { ICPqrsRequest } from "../utils/interface";

interface IProps {
    showModal: Signal<boolean>;
    closeModal: () => void;
}

export const PqrsModal = ({ showModal, closeModal }: IProps) => {
    const { selectedCompany } = useUserStore();
    const { id } = useParams<{ id?: string }>();

    const loading = useSignal<boolean>(false);
    const pqrs = useSignal<ICPqrsRequest | null>(null);

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

    return (
        <Modal
            name="pqrs-details"
            open={showModal.value}
            onClose={closeModal}
            title={`PQRS - Details`}
        >
            <div class="space-y-4">
                {loading.value ? (
                    <div class="py-8 text-center text-sm text-gray-500">Cargando información...</div>
                ) : (
                    <>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <p class="text-sm text-gray-900">{pqrs.value?.extraData?.clientOrCompanyName ?? "N/A"}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
                                <p class="text-sm text-gray-900">{pqrs.value?.extraData?.accountNumber ?? "N/A"}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de registro</label>
                                <p class="text-sm text-gray-900">
                                    {pqrs.value?.extraData?.filingDate ? (
                                        <FormattedDate date={String(pqrs.value?.extraData.filingDate)} format='date' />
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Registrado por</label>
                                <p class="text-sm text-gray-900">{pqrs.value?.extraData?.registeredBy ?? "N/A"}</p>
                            </div>
                        </div>
                        {pqrs.value?.extraData?.registerObservation && (
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded">{pqrs.value?.extraData.registerObservation}</p>
                            </div>
                        )}
                    </>
                )}
                <div class="flex justify-end gap-3 pt-4 border-t">
                    <Button name="close" onClick={closeModal} label="Cerrar" />
                </div>
            </div>
        </Modal>
    );
};