import styled, { createGlobalStyle } from 'styled-components'
import theme from '../../lib/theme'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Inconsolata');

  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    overflow: hidden;
  }

  button {
    font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    outline: none;
  }

  input,select,option {
    outline: none;
    &:focus {
      outline: none;
    }
  }
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${theme.offWhite};
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.grey[2]};
  }
`

export const Inner = styled.div`
  display: grid;
  height: calc(100vh - 35px);
`
