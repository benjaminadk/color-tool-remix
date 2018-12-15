import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  width: 10px;
  height: 10px;
  outline: ${props =>
    props.index === props.selectedIndex ? `2px solid ${props.outlineColor}` : 'none'};
`

export default ({ selectedIndex, index, outlineColor, ...rest }) => (
  <Box
    {...rest}
    data-index={index}
    selectedIndex={selectedIndex}
    index={index}
    outlineColor={outlineColor}
  />
)
