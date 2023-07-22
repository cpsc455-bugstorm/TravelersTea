import { Alert, Snackbar } from '@mui/material'
import PropTypes from 'prop-types'

AlertSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string,
}

export function AlertSnackbar({
  open,
  handleClose,
  message,
  severity = 'error',
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
