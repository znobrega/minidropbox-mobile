// react-native navigation
// react-native-gesture-handler

import React from 'react'

import { YellowBox } from 'react-native'
import Routes from './routes'

YellowBox.ignoreWarning({'Unrecognized WebSocket'})

const App = () => <Routes/>

export default App