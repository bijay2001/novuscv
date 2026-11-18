import Swal from 'sweetalert2';

const consoleAlert = Swal.mixin({
  background: 'var(--ec-panel-alt, #161B22)',
  color: 'var(--ec-text, #E7E9EC)',
  customClass: {
    confirmButton: 'ec-btn-solid',
    cancelButton: 'ec-btn-ghost',
  },
  buttonsStyling: false,
});

export const showAlert = {
  success: (title, text) => {
    return consoleAlert.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Continue',
    });
  },

  error: (title, text) => {
    return consoleAlert.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Try Again',
    });
  },

  confirm: (title, text) => {
    return consoleAlert.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes, Proceed',
      cancelButtonText: 'Cancel',
    });
  },
};