import React from 'react'
import styled from 'styled-components'

const Swatch = styled.div`
  width: ${props => props.theme.swatchWidth};
  height: ${props => props.theme.swatchHeight};
  border: ${props => props.theme.border};
  display: grid;
  grid-template-columns: 1fr 1fr;
  .hsl {
    background: ${props => props.hsl};
    width: calc(${props => props.theme.swatchWidth} / 2);
    height: ${props => props.theme.swatchHeight};
  }
  .hsla {
    background: ${props => (props.alpha ? props.hsla : props.hsl)};
    width: calc(${props => props.theme.swatchWidth} / 2);
    height: ${props => props.theme.swatchHeight};
    display: grid;
    justify-items: center;
    align-items: center;
    span {
      font-family: 'Oswald';
      font-size: 1rem;
      z-index: -1;
    }
  }
`

export default props => (
  <Swatch {...props}>
    <div className="hsl" />
    <div className="hsla">
      <span>{props.hsla ? 'ALPHA' : ''}</span>
    </div>
  </Swatch>
)
