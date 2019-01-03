import React from 'react'
import styled from 'styled-components'
import { FileUpload, Delete, ArrowBack, Style } from 'styled-icons/material'

const Actions = styled.div`
  height: 50px;
  width: 75px;
  display: grid;
  grid-template-columns: 25px 25px 25px;
  grid-template-rows: 25px 25px;
  button {
    display: grid;
    background: ${props => props.theme.white};
    color: ${props => props.theme.black};
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    &:hover {
      color: ${props => props.accentColor};
    }
    .icon {
      align-self: center;
      width: 1.5rem;
      height: 1.5rem;
      color: inherit;
    }
  }
`

export default props => (
  <Actions accentColor={props.accentColor}>
    <button onClick={props.setMode} title="Back To Picker">
      <ArrowBack className="icon" />
    </button>
    <span />
    <span />
    <button onClick={props.copyAsVariables} title="Copy as Variables">
      <Style className="icon" />
    </button>
    <button onClick={props.loadPalette} title="Load Palette">
      <FileUpload className="icon" />
    </button>
    <button onClick={props.handleDelete} title="Delete Palette">
      <Delete className="icon" />
    </button>
  </Actions>
)
