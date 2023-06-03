import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import Draggable from 'react-draggable'

/*
 * @param {boolean} open - whether the modal is open
 * @param {function} handleClose - callback when closing the modal
 * @param {node} children - content of the modal
 * @param {node} footer - usually buttons with actions
 * @returns {node} - modal component
 */
Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  isDraggable: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  classNameMain: PropTypes.string,
  classNameTitle: PropTypes.string,
  classNameContent: PropTypes.string,
}

function PaperComponent(props) {
  const nodeRef = useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  )
}

export function Modal({
  open,
  isDraggable = true,
  handleClose,
  title,
  children,
  footer,
  classNameMain,
  classNameTitle,
  classNameContent,
}) {
  return (
    <Box>
      <Dialog
        PaperComponent={isDraggable ? PaperComponent : undefined}
        fullWidth
        maxWidth='md'
        className={`${classNameMain}`}
        open={open}
        onClose={handleClose}
      >
        <Box my='0.5rem'>
          <DialogTitle
            id='draggable-dialog-title'
            fontSize='2rem'
            className={`cursor-grab border-b-4 border-black text-center ${classNameTitle}`}
          >
            {title}
          </DialogTitle>
          <Box my='0.5rem' p='0'>
            <DialogContent
              className={`flex flex-col space-y-4 text-center ${classNameContent}`}
            >
              {children}
            </DialogContent>
            <DialogActions>{footer}</DialogActions>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
