import React, { useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '70%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

export const ModalMessage = ({ variant, children }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleToggle = () => {
    setOpen(true)
  }

  useEffect(() => {
    handleToggle()
  }, [])

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
      <div className={classes.root}>
        <Alert severity={variant}>{children}</Alert>
      </div>
    </Backdrop>
  )
}
