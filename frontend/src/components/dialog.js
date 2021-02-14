import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export const Confirm = ({ clicked, closed, result, data }) => {
  return (
    <Dialog
      open={clicked}
      onClose={closed}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle>Are You Sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Delete ${data}  you won't be able to rever this`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => result(false)} color='primary'>
          Disagree
        </Button>
        <Button onClick={() => result(true)} color='primary' autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
