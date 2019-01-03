import React from 'react'
import styled from 'styled-components'

const Cube = styled.div`
  justify-self: center;
  align-self: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .cube {
    display: grid;
    grid-template-columns: repeat(8, 5px);
    grid-template-rows: repeat(8, 5px);
    border: 1px solid ${props => props.theme.grey[2]};
  }
`

export default props => (
  <Cube>
    <div className="cube">
      {props.colors.map((c, i) => (
        <div
          key={i}
          style={{
            background: c.color === 'transparent' ? '#f2f2f2' : c.color
          }}
        />
      ))}
    </div>
  </Cube>
)
