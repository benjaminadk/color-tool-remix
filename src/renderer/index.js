import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import StyledPage from './components/App/Page'
import theme from './lib/theme'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StyledPage />
  </ThemeProvider>,
  document.getElementById('app')
)
