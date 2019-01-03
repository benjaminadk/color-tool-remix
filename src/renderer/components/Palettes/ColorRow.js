import React from 'react'
import styled from 'styled-components'
import { Clipboard } from 'styled-icons/boxicons-solid'
import getContrastText from '../../lib/getContrastColor'

const Item = styled.div`
  height: 3rem;
  display: grid;
  grid-template-columns: 25rem 10rem 5rem;
  grid-gap: 2rem;
  font-family: 'Inconsolata';
  padding: 0 0.5rem;
  .left {
    height: 3rem;
    display: grid;
    justify-items: stretch;
    align-items: center;
    font-size: 1.3rem;
    text-align: center;
    background: ${props => props.color};
    color: ${props => getContrastText(props.hsl)};
    user-select: none;
    box-shadow: ${props => props.theme.shadows[1]};
  }
  .center {
    height: 3rem;
    display: grid;
    justify-items: center;
    align-items: center;
    font-size: 1rem;
    font-family: 'Inconsolata';
    background: ${props => props.theme.white};
    border: ${props => props.theme.border};
    box-shadow: ${props => props.theme.shadows[1]};
  }
  .right {
    height: 3rem;
    button {
      background: transparent;
      color: ${props => props.theme.black};
      border: 0;
      outline: 0;
      cursor: pointer;
      &:hover {
        color: ${props => props.accentColor};
      }
      .icon {
        width: 1.5rem;
        height: 1.5rem;
        color: inherit;
      }
    }
  }
`

export default ({ color, name, hsl, accentColor, copied, copyToClipboard }) => {
  return (
    <Item color={color} hsl={hsl} accentColor={accentColor}>
      <div className="left">{copied ? 'Copied' : color}</div>
      <div className="center">{name || '------'}</div>
      <div className="right">
        <button onClick={copyToClipboard}>
          <Clipboard className="icon" title="Copy" />
        </button>
      </div>
    </Item>
  )
}
