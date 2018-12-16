import React from 'react'
import styled from 'styled-components'
import { Add, Colorize, ZoomOut, Settings, Code, Redeem } from 'styled-icons/material'
import { Button, iconStyles } from './Right'

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
`

const AddIcon = styled(Add)(iconStyles)
const ColorizeIcon = styled(Colorize)(iconStyles)
const ZoomOutIcon = styled(ZoomOut)(iconStyles)
const SettingsIcon = styled(Settings)(iconStyles)
const CodeIcon = styled(Code)(iconStyles)
const RedeemIcon = styled(Redeem)(iconStyles)

export default props => (
  <ActionRow>
    <Button onClick={props.handleCreateSwatch} title="Add Color">
      <AddIcon />
    </Button>
    <Button onClick={props.initDropper} title="Open Dropper">
      <ColorizeIcon />
    </Button>
    <Button onClick={props.openColorParsePrompt} title="Parse Color String">
      <CodeIcon />
    </Button>
    <Button onClick={props.createRandomColor} title="Random Color">
      <RedeemIcon />
    </Button>
    <Button onClick={() => props.setPickerSize(true)} title="Project Mode">
      <ZoomOutIcon />
    </Button>
    <Button onClick={() => props.setMode(1)} title="Open Settings">
      <SettingsIcon />
    </Button>
  </ActionRow>
)
