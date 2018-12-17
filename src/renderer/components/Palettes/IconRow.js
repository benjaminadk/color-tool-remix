import React from 'react'
import styled from 'styled-components'
import { FileUpload, Delete, ArrowBack, Style } from 'styled-icons/material'
import { iconStyles } from '../Picker/Right'

const StyleIcon = styled(Style)(iconStyles)
const LoadIcon = styled(FileUpload)(iconStyles)
const DeleteIcon = styled(Delete)(iconStyles)
const BackIcon = styled(ArrowBack)(iconStyles)

export default props => (
  <div className="actions">
    <button onClick={props.setMode} title="Back To Picker">
      <BackIcon />
    </button>
    <button onClick={props.copyAsVariables} title="Copy as Variables">
      <StyleIcon />
    </button>
    <button onClick={props.loadPalette} title="Load Palette">
      <LoadIcon />
    </button>
    <button onClick={props.handleDelete} title="Delete Palette">
      <DeleteIcon />
    </button>
  </div>
)
