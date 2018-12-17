import React from 'react'
import styled from 'styled-components'

const ColorCubeStyle = styled.div`
  justify-self: start;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(8, 5px);
  grid-template-rows: repeat(8, 5px);
  border: 1px solid #333333;
  margin-left: 1rem;
`

export default props => (
  <ColorCubeStyle>
    {props.colors.map((c, i) => (
      <div
        key={i}
        className="cube"
        style={{
          background: c.color === 'transparent' ? '#f2f2f2' : c.color
        }}
      />
    ))}
  </ColorCubeStyle>
)
