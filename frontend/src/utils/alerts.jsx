import Swal from 'sweetalert2';

// Create a custom instance of SweetAlert that uses pure Bootstrap 5 classes
// This removes all custom CSS and gives it that clean, native mobile feel.
const nativeAlert = Swal.mixin({
  customClass: {
    popup: 'rounded-4 shadow-sm border-0', // Soft corners, native shadow
    title: 'fs-4 fw-bold text-dark',
    htmlContainer: 'text-muted fs-6',
    confirmButton: 'btn btn-primary btn-lg rounded-3 px-4 mx-2 fw-semibold',
    cancelButton: 'btn btn-light btn-lg rounded-3 px-4 mx-2 fw-semibold text-dark',
    actions: 'mt-3 mb-1'
  },
  buttonsStyling: false, // CRITICAL: This turns off default styles so Bootstrap takes over
  showClass: {
    popup: 'animate__animated animate__fadeInUp animate__faster' // Snappy mobile pop-up animation
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutDown animate__faster'
  }
});

export const showAlert = {
  // Use for successful actions (e.g., "Resume Uploaded")
  success: (title, text) => {
    return nativeAlert.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'Continue'
    });
  },

  // Use for errors (e.g., "Login Failed")
  error: (title, text) => {
    return nativeAlert.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Try Again',
      confirmButtonClass: 'btn btn-danger btn-lg rounded-3 px-4 fw-semibold' // Overrides to red
    });
  },

  // Use for destructive actions (e.g., "Delete Account?")
  confirm: (title, text) => {
    return nativeAlert.fire({
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'btn btn-primary btn-lg rounded-3 px-4 mx-2 fw-semibold',
    });
  }
};