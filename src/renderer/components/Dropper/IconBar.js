import React from 'react'
import { Refresh, CheckCircle, Cancel, DragHandle, Fingerprint } from 'styled-icons/material'
import styled from 'styled-components'

const IconBar = styled.div`
  width: ${props => props.theme.dropperWidth};
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: space-around;
  align-items: center;
  button {
    background: transparent;
    color: ${props => props.theme.black};
    border: none;
    cursor: pointer;
    &:hover {
      color: ${props => props.accentColor};
    }
  }
  .draggable {
    -webkit-app-region: drag;
    cursor: grab;
  }
`

const size = 18

export default props => (
  <IconBar accentColor={props.options.accentColor}>
    <button className="draggable">
      <DragHandle size={size} color="inherit" />
    </button>
    <button onClick={props.selectColor} title="Select Color">
      <CheckCircle size={size} color="inherit" />
    </button>
    <button onClick={props.analyzePixels} title="Analyzer">
      <Fingerprint size={size} color="inherit" />
    </button>
    <button onClick={props.refresh} title="Refresh">
      <Refresh size={size} color="inherit" />
    </button>
    <button onClick={props.exit} title="Exit">
      <Cancel size={size} color="inherit" />
    </button>
  </IconBar>
)
