/*
* Oiriginal code from https://github.com/n4kz
*/

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  View,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native'

import { styles, radius } from './RippleStyles'

export default class Ripple extends PureComponent {
  static defaultProps = {
    ...TouchableOpacity.defaultProps,
    rippleColor: 'rgb(0, 0, 0)',
    rippleOpacity: 0.30,
    rippleDuration: 600,
    rippleSize: 0,
    rippleContainerBorderRadius: 0,
    rippleCentered: false,
    rippleSequential: false,
    rippleFades: true,
    disabled: false,

    onRippleAnimation (animation, callback) {
      return animation.start(callback)
    },
  }

  static propTypes = {
    ...Animated.View.propTypes,
    ...TouchableOpacity.propTypes,

    rippleColor: PropTypes.string,
    rippleOpacity: PropTypes.number,
    rippleDuration: PropTypes.number,
    rippleSize: PropTypes.number,
    rippleContainerBorderRadius: PropTypes.number,
    rippleCentered: PropTypes.bool,
    rippleSequential: PropTypes.bool,
    rippleFades: PropTypes.bool,
    disabled: PropTypes.bool,

    onRippleAnimation: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.onLayout = this.onLayout.bind(this)
    this.onPressIn = this.onPressIn.bind(this)
    this.onPressOut = this.onPressOut.bind(this)
    this.onLongPress = this.onLongPress.bind(this)
    this.onAnimationEnd = this.onAnimationEnd.bind(this)

    this.renderRipple = this.renderRipple.bind(this)

    this.unique = 0
    this.mounted = false

    this.state = {
      width: 0,
      height: 0,
      ripples: [],
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  onLayout(event) {
    let { width, height } = event.nativeEvent.layout
    let { onLayout } = this.props

    if ('function' === typeof onLayout) {
      onLayout(event)
    }

    this.setState({ width, height })
  }

  ripple (event, stop) {
    let { ripples } = this.state
    let { onPress, rippleSequential } = this.props

    if (!rippleSequential || !ripples.length) {
      if ('function' === typeof onPress && !stop) {
        requestAnimationFrame(() => onPress(event))
      }

      this.startRipple(event)
    }
  }

  canDispatchRipple = false

  onPressOut(event) {
    clearTimeout(this.dispatchableTimeout)

    if (event.dispatchConfig.registrationName === 'onResponderTerminate') {
      if (this.canDispatchRipple) {
        this.ripple(event, true)
      }
    } else {
      this.ripple(event)
    }

    this.canDispatchRipple = false

    let { onPressOut } = this.props

    if ('function' === typeof onPressOut) {
      onPressOut(event)
    }
  }

  onLongPress(event) {
    let { onLongPress } = this.props

    if ('function' === typeof onLongPress) {
      requestAnimationFrame(() => onLongPress(event))
    }

    this.startRipple(event)
  }

  onPressIn(event) {
    this.touchX = event.nativeEvent.locationX
    this.touchY = event.nativeEvent.locationY

    let { onPressIn } = this.props

    if ('function' === typeof onPressIn) {
      onPressIn(event)
    }

    this.dispatchableTimeout = setTimeout(() => {
      this.canDispatchRipple = true
    }, 100)
  }

  onAnimationEnd() {
    if (this.mounted) {
      this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }))
    }
  }

  startRipple(event) {    
    let { width, height } = this.state
    let {
      rippleDuration,
      rippleCentered,
      rippleSize,
      onRippleAnimation
    } = this.props

    let w2 = 0.5 * width
    let h2 = 0.5 * height

    let { locationX, locationY } = rippleCentered
      ? { locationX: w2, locationY: h2 }
      : event.nativeEvent

    if (event.dispatchConfig.registrationName === 'onResponderMove') {
      locationX = this.touchX
      locationY = this.touchY
    }

    let offsetX = Math.abs(w2 - locationX)
    let offsetY = Math.abs(h2 - locationY)

    let R = rippleSize > 0
      ? 0.5 * rippleSize
      : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2))

    let ripple = {
      unique: this.unique++,
      progress: new Animated.Value(0),
      locationX,
      locationY,
      R,
    }

    let animation = Animated
      .timing(ripple.progress, {
        toValue: 1,
        easing: Easing.out(Easing.ease),
        duration: rippleDuration,
        useNativeDriver: true,
      })

    onRippleAnimation(animation, this.onAnimationEnd)

    this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }))
  }

  renderRipple({ unique, progress, locationX, locationY, R }) {
    let { rippleColor, rippleOpacity, rippleFades } = this.props

    let rippleStyle = {
      top: locationY - radius,
      left: locationX - radius,
      backgroundColor: rippleColor,

      transform: [{
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5 / radius, R / radius],
        }),
      }],

      opacity: rippleFades?
        progress.interpolate({
          inputRange: [0, 1],
          outputRange: [rippleOpacity, 0],
        }):
        rippleOpacity,
    }

    return (
      <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />
    )
  }

  render() {
    let { ripples } = this.state
    let { onPress, onPressIn, onPressOut, onLongPress, onLayout } = this
    let {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      children,
      rippleContainerBorderRadius,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
      onLayout: __ignored__,
      ...props
    } = this.props

    let touchableProps = {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress,
      onPressIn,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
      onPressOut,
      onLongPress: props.onLongPress ? onLongPress : undefined,
      onLayout,
    }

    let containerStyle = {
      borderRadius: rippleContainerBorderRadius,
    }

    return (
      <TouchableOpacity
        activeOpacity={ 0.9 }
        { ...touchableProps }>
        <Animated.View { ...props } pointerEvents='box-only'>
          { children }
          <View style={[ styles.container, containerStyle ]}>
            { ripples.map(this.renderRipple) }
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}
