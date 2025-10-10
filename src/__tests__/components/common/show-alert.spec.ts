import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/preact';
import { showAlert } from '@/components/common/show-alert/show-alert';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Components | Common | showAlert', () => {
  it('creates a modal dialog with the provided title and message', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    showAlert({
      title: 'Important update',
      message: 'Please confirm the action',
      onConfirm,
      onCancel,
    });

    const modal = document.body.querySelector('.fixed.inset-0.z-50');
    expect(modal).toBeTruthy();
    expect(modal?.querySelector('h3')?.textContent).toBe('Important update');
    expect(modal?.querySelector('p')?.textContent).toBe('Please confirm the action');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('invokes callbacks and removes the modal when buttons are clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    showAlert({
      title: 'Delete item',
      message: 'Are you sure?',
      onConfirm,
      onCancel,
    });

    const cancelButton = document.getElementById('cancel-btn');
    const confirmButton = document.getElementById('confirm-btn');

    expect(cancelButton).toBeTruthy();
    expect(confirmButton).toBeTruthy();

    fireEvent.click(cancelButton!);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector('#cancel-btn')).toBeNull();

    showAlert({
      title: 'Delete item',
      message: 'Are you sure?',
      onConfirm,
      onCancel,
    });

    fireEvent.click(document.getElementById('confirm-btn')!);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector('#confirm-btn')).toBeNull();
  });
});
