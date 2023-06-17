import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import PropTypes from 'prop-types'

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
}

export function ConfirmationDialog({
  open,
  handleClose,
  handleConfirm,
  title,
  description,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        {title || 'Confirm Action'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {description || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
