import PropTypes from 'prop-types'
import { Loader } from './components/common'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  return (
    <>
      <Loader />
      {children}
    </>
  )
}
