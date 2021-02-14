import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField } from '@material-ui/core'

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
          {`Delete ${data}  you won't be able to revert this`}
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

export const FormDialog = ({ open, handleClose, chatroomName, editData }) => {
  const [textValue, setTextValue] = React.useState('')

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle>{`Edit ${chatroomName}`} </DialogTitle>
      <DialogContent>
        <DialogContentText>Please input new name</DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          label='Input text'
          type='text'
          fullWidth
          onChange={(e) => setTextValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => editData(false, textValue)} color='primary'>
          Cancel
        </Button>
        <Button onClick={() => editData(true, textValue)} color='primary'>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
