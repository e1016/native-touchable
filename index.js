import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import PropTypes from "prop-types"

import RippleTouchable from './lib/RippleTouchable'

const Touchable = props => (Platform.OS === 'android' || props.waves) ? (
  // Android implements
  <RippleTouchable
    rippleSize={ props.size || 0 }
    rippleColor={ props.hint || '#000' }
    rippleOpacity={ props.alpha || 0.3 }
    rippleOpacity={ props.alpha || 0.3 }
    rippleDuration={ props.duration || 600 }
    rippleContainerBorderRadius={
        props.radius ||
        (
          props.style &&
          props.style.borderRadius
        ) || 0
      }
    { ...props }>
    { props.children }
  </RippleTouchable>
) : (
  // iOS implements
  <TouchableOpacity activeOpacity={ 0.7 } { ...props }>
    { props.children }
  </TouchableOpacity>
)

Touchable.propTypes = {
  size: PropTypes.number,
  hint: PropTypes.string,
  alpha: PropTypes.number,
  radius: PropTypes.number,
  centered: PropTypes.bool,
  duration: PropTypes.number,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func
}

export default Touchable