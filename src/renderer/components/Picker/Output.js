import React from 'react'
import styled from 'styled-components'
import { Clipboard } from 'styled-icons/boxicons-solid'

const Output = styled.div`
  width: 190px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  line-height: 1;
  background: white;
  border-bottom: ${props => props.theme.border};
  &:nth-child(${props => props.copied}) {
    outline: 3px solid ${props => props.value};
  }
  &:last-child {
    border-bottom: none;
  }
  span {
    padding-right: 0.25rem;
    font-size: 1.25rem;
    cursor: pointer;
  }
`

const ReadOnly = styled.input.attrs({
  type: 'text',
  readOnly: true
})`
  margin: 0;
  padding: 0;
  font-family: 'Inconsolata';
  font-size: ${props => props.theme.smallerFontSize};
  text-align: center;
  border: none;
  cursor: default;
  user-select: none;
  &::selection {
    background: transparent;
  }
`

export default props => (
  <Output copied={props.copied} value={props.value} onClick={props.onClick}>
    <ReadOnly value={props.copied === props.index ? 'Copied to Clipboard' : props.value} />
    <span title="Copy">
      <Clipboard color="#333333" size={14} />
    </span>
  </Output>
)
