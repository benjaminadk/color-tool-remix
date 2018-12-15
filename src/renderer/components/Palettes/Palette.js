import React from 'react'
import styled from 'styled-components'

const PaletteGrid = styled.div`
  justify-self: center;
  align-self: start;
  width: ${props => props.theme.paletteSize};
  height: ${props => props.theme.paletteSize};
  display: flex;
  flex-wrap: wrap;
`

const Swatch = styled.div`
  width: ${props => props.theme.paletteItemSize};
  height: ${props => props.theme.paletteItemSize};
  display: grid;
  justify-items: center;
  align-items: center;
`

const Inner = styled.div`
  width: 75%;
  height: 75%;
  border: ${props => props.theme.border};
  background: ${props => (props.background === 'transparent' ? 'white' : props.background)};
  &:hover {
    border: ${props => props.theme.hoverBorder};
  }
`

export default props => (
  <PaletteGrid>
    {props.colors &&
      props.colors.map((c, i) => (
        <Swatch
          key={i}
          onClick={() => props.onSwatchClick(c.clean ? null : c)}
          onContextMenu={e => props.onContextMenu(e, c, i)}
        >
          <Inner background={c.color} />
        </Swatch>
      ))}
  </PaletteGrid>
)
