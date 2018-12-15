import React from 'react'
import styled from 'styled-components'

const Inputs = styled.div`
  width: ${props => props.theme.barWidth};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
`

export default props => <Inputs>{props.children}</Inputs>
