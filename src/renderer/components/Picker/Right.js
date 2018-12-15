import React from 'react'
import styled from 'styled-components'
import { shell } from 'electron'
import Palette from '../Palettes/Palette'
import { Refresh, Save, Palette as Art, Help } from 'styled-icons/material'

const Right = styled.div`
  justify-self: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const NameInput = styled.input.attrs({
  type: 'text',
  name: 'paletteName',
  placeholder: 'Name of your palette'
})`
  font-family: 'Inconsolata';
  text-align: center;
  padding: 1rem 0.5rem;
  margin-top: 1rem;
`

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 1rem;
  & > :first-child {
    justify-self: start;
  }
  & > :nth-child(2) {
    justify-self: center;
  }
  & > :nth-child(3) {
    justify-self: center;
  }
  & > :last-child {
    justify-self: end;
  }
`

export const Button = styled.button`
  width: 50px;
  background: white;
  color: ${props => props.theme.black};
  border: ${props => props.theme.border};
  padding: 0.5rem;
  transition: all 0.25s;
  &:hover {
    background: ${props => props.theme.black};
    color: white;
  }
`

export function iconStyles(props) {
  return `  
    color: inherit;
    width: ${props.theme.iconSize};
    height: ${props.theme.iconSize};
    &:hover {
      color: inherit;
  }`
}

const SaveIcon = styled(Save)(iconStyles)
const ArtIcon = styled(Art)(iconStyles)
const RefreshIcon = styled(Refresh)(iconStyles)
const HelpIcon = styled(Help)(iconStyles)

export default props => (
  <Right>
    <Palette
      colors={props.colors}
      onSwatchClick={props.onSwatchClick}
      onContextMenu={props.onContextMenu}
    />
    <NameInput value={props.paletteName} onChange={props.handleChange} />
    <Buttons>
      <Button onClick={props.savePalette} title="Save Palette">
        <SaveIcon />
      </Button>
      <Button onClick={() => props.setMode(2)} title="View Palettes">
        <ArtIcon />
      </Button>
      <Button onClick={props.resetColors} title="Reset Palette">
        <RefreshIcon />
      </Button>
      <Button
        onClick={() => shell.openExternal('https://github.com/benjaminadk/electron-color')}
        title="Help"
      >
        <HelpIcon />
      </Button>
    </Buttons>
  </Right>
)
