import { AlertProps } from './interface';

export const showAlert = ({
  title,
  message,
  onConfirm,
  onCancel,
}: AlertProps): void => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center';
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">${title}</h3>
      <p class="text-sm text-gray-500 mb-4">${message}</p>
      <div class="flex justify-end gap-2">
        <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancelar
        </button>
        <button id="confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md ">
          Confirmar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const cancelBtn = modal.querySelector('#cancel-btn');
  const confirmBtn = modal.querySelector('#confirm-btn');

  cancelBtn?.addEventListener('click', () => {
    onCancel();
    document.body.removeChild(modal);
  });

  confirmBtn?.addEventListener('click', () => {
    onConfirm();
    document.body.removeChild(modal);
  });
};
