import React from 'react'
import styled from 'styled-components'

const OutputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin: 2rem auto;
`

export default props => <OutputRow>{props.children}</OutputRow>
