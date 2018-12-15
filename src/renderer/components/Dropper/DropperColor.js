import React from 'react'
import styled from 'styled-components'

const Color = styled.div`
  font-size: 1.1rem;
  text-align: center;
`

const Swatch = styled.div`
  width: 100px;
  height: 35px;
  background: ${props => (props.color ? props.color : 'transparent')};
  border: 1px solid;
  z-index: 3;
  margin-bottom: 10px;
`

export default props => (
  <>
    <Color>{props.color ? props.color : props.message ? props.message : 'Loading...'}</Color>
    <Swatch color={props.color ? props.color : undefined} />
  </>
)
