export const Snacks = (name, type, enqueueSnackbar, loaders, setStatus) => {
  const [loading, loadingRoom] = loaders
  if (!loading || !loadingRoom) {
    let variant = 'success'
    if (type === 'left') {
      variant = 'error'
    }
    enqueueSnackbar(`${name} ${type}`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      variant: variant,
      autoHideDuration: 1000,
      preventDuplicate: true,
    })
    setStatus(false)
  }
}
