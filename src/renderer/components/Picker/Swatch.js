import React from 'react'
import styled from 'styled-components'

const Swatch = styled.div`
  width: ${props => props.theme.swatchWidth};
  height: ${props => props.theme.swatchHeight};
  border: ${props => props.theme.border};
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: ${props => props.theme.shadows[1]};
  .hsl {
    background: ${props => props.hsl};
    width: calc(${props => props.theme.swatchWidth} / 2);
    height: ${props => props.theme.swatchHeight};
  }
  .hsla {
    position: relative;
    width: calc(${props => props.theme.swatchWidth} / 2);
    height: ${props => props.theme.swatchHeight};
    display: grid;
    justify-items: center;
    align-items: center;
    font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    font-size: 1rem;
    .color {
      width: 100%;
      height: 100%;
      background: ${props => (props.alpha ? props.hsla : props.hsl)};
      z-index: 2;
    }
    .alpha {
      position: absolute;
      z-index: 1;
    }
  }
`

export default props => (
  <Swatch {...props}>
    <div className="hsl" />
    <div className="hsla">
      <div className="color" />
      <div className="alpha">{props.hsla ? 'ALPHA' : ''}</div>
    </div>
  </Swatch>
)
