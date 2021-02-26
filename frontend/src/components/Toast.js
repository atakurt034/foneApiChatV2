import Swal from 'sweetalert2'

const notification = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const confirm = Swal.mixin({
  title: 'Delete  Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
})

const makeToast = (icon, msg, type, data) => {
  switch (type) {
    case 'notification':
      return notification.fire({
        icon: icon,
        title: msg,
      })

    case 'confirm':
      return confirm
        .fire({
          text: `You won't be able to revert this!`,
        })
        .then((result) => data(result.isConfirmed))
    default:
      return notification.fire({
        icon: 'error',
        title: 'ERROR',
      })
  }
}

export default makeToast
