import Swal from 'sweetalert2';

export async function showSuccessAlert(title, text) {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#4f46e5',
  });
}

export async function showErrorAlert(title, text) {
  await Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc2626',
  });
}

export async function showConfirmAlert(title, text, confirmText = 'Confirmer') {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
  });

  return result.isConfirmed;
}
