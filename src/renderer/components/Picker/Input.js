import React from 'react'
import styled from 'styled-components'
import { DownArrow, UpArrow } from 'styled-icons/boxicons-solid'

const Input = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  user-select: none;
  & > :nth-child(1) {
    font-size: 2rem;
    justify-self: flex-end;
    padding-right: 0.35rem;
  }
  & > :nth-child(3) {
    font-size: 1.15rem;
    justify-self: flex-start;
    padding-left: 0.25rem;
  }
  .controls {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    justify-items: center;
    & > :nth-child(odd) {
      font-size: ${props => props.theme.smallFontSize};
      cursor: pointer;
    }
    & > :first-child {
      align-self: flex-end;
    }
    & > :last-child {
      align-self: flex-start;
    }
    input {
      width: ${props => props.theme.inputWidth};
      padding: ${props => props.theme.smallFontPadding};
      font-family: 'inconsolata';
      font-size: ${props => props.theme.smallFontSize};
      text-align: center;
      border: ${props => props.theme.border};
      &::selection {
        background: none;
      }
    }
  }
`

export default props => (
  <Input hue={props.value}>
    <span>{props.before}</span>
    <div className="controls">
      <span onClick={() => props.onClick(true, props.type)}>
        <UpArrow color="#333333" size={20} />
      </span>
      <input
        type="text"
        maxLength={3}
        minLength={1}
        value={props.value}
        onChange={e => props.onChange(e, props.type)}
      />
      <span onClick={() => props.onClick(false, props.type)}>
        <DownArrow color="#333333" size={20} />
      </span>
    </div>
    <span>{props.after}</span>
  </Input>
)
