import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Oswald');
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
    font-family: 'Oswald';
    overflow: hidden;
  }

  button {
    font-family: 'Oswald';
    outline: none;
  }
`

export const Inner = styled.div`
  display: grid;
  height: calc(100vh - 35px);
`
