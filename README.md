# Native Touchable for React Native

implements a look and feel for Touchables in React Native. It display material design ripples on Android, and Opacity effect on iOS.

> this Touchable isn't native, it's a fork of [react-native-material-ripple](https://www.npmjs.com/package/react-native-material-ripple) by [@n4kz](https://github.com/n4kz)

<img src="https://i.imgur.com/e2pUIt7.gif"/>

### install
`npm i -s native-touchable`

### implementation
```js
import Touchable from 'native-touchable'

render () {
  return (
    <View>
      
      <Touchable onPress={ ... }>
        <Text>Do something!</Text>
      </Touchable>
      
    </View>
  )
}
```

# props

This component inherits from `TouchableOpacity` and can use all [his props](https://facebook.github.io/react-native/docs/touchableopacity#props) (`onPress`, `onPressIn`, `activeOpacity`, etc.), btw can use all props from [@n4kz/react-native-material-ripple](https://github.com/n4kz/react-native-material-ripple) too. But I decide to rename props just for confortability.

| prop     | type    | default                                       | description                                 |
|----------|---------|-----------------------------------------------|---------------------------------------------|
| waves    | boolean | `true` in Android, `false` in iOS             | force ripple render on iOS                  |
| size     | number  | 0 (means auto size)                           | wave size, when it's 0 size is calc in auto |
| hint     | string  | #000                                          | wave color                                  |
| alpha    | number  | 0.3                                           | wave opacity                                |
| radius   | number  | calc from styles `borderRadius` property or 0 | border radius from wave overflow container  |
| centered | boolean | false                                         | ripple always starts from center            |
| duration | number  | 600                                           | ripple duration in ms                       |
