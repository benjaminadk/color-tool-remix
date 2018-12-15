import React from 'react'
import styled from 'styled-components'

const ColorStrings = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 0.25rem;
  border: ${props => props.theme.border};
  background: white;
`

export default props => <ColorStrings>{props.children}</ColorStrings>
