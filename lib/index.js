import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
// import PropTypes from "prop-types"

import RippleTouchable from './RippleTouchable'

const Touchable = props => (Platform.OS === 'android' || props.waves) ? (
  // Android implements
  <RippleTouchable>
    { props.children }
  </RippleTouchable>
) : (
  // iOS implements
  <TouchableOpacity>
    { props.children }
  </TouchableOpacity>
)

// Touchable.propTypes = {
//   size: PropTypes.number,
//   hint: PropTypes.string, 
// }

export default Touchable