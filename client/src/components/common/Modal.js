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
 * @param {function} handleClose - callback when closing the modal (also triggered when clicking outside the modal)
 * @param {node} children - content of the modal
 * @param {node} footer - usually buttons with actions
 * @returns {node} - modal component
 */
Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  isDraggable: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  classNameMain: PropTypes.string,
  modalSize: PropTypes.string,
  classNameTitle: PropTypes.string,
  titleSize: PropTypes.string,
  classNameContent: PropTypes.string,
  isCompressed: PropTypes.bool,
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
  modalSize = 'md',
  classNameTitle,
  titleSize = 'text-4xl md:text-5xl',
  classNameContent,
  isCompressed = false,
}) {
  return (
    <Box>
      <Dialog
        PaperComponent={isDraggable ? PaperComponent : undefined}
        fullWidth
        maxWidth={modalSize}
        className={`${classNameMain}`}
        open={open}
        onClose={handleClose}
        disableEnforceFocus
      >
        <Box m='0'>
          <DialogTitle
            id='draggable-dialog-title'
            fontSize='2rem'
            className='cursor-grab bg-slate-300'
          />
          <Box my='0.5rem' pt={isCompressed ? '0' : '1rem'}>
            {title && (
              <h1
                className={`pb-2 pt-6 text-center font-mono ${titleSize} ${classNameTitle}`}
              >
                {title}
              </h1>
            )}
            <DialogContent
              className={`flex flex-col ${
                isCompressed ? '' : 'space-y-4'
              } text-center ${classNameContent}`}
            >
              {children}
            </DialogContent>
            <Box p={isCompressed ? '0px' : '20px'} px='24px'>
              <DialogActions sx={{ padding: 0 }}>{footer}</DialogActions>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
