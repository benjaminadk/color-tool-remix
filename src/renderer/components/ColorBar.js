import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  width: ${props => props.theme.barWidth};
  height: ${props => props.theme.barHeight};
  position: relative;
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  margin-bottom: 15px;
  border: ${props => props.theme.border};
  user-select: none;
  .hue-slice,
  .sat-slice,
  .lit-slice,
  .opa-slice {
    transition: all 0.5s ease-out;
  }

  .thumb {
    width: ${props => props.theme.thumbWidth};
    height: ${props => props.theme.barHeight};
    position: absolute;
    border: ${props => props.theme.border};
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.05s ease-out;
  }
`

export default class ColorBar extends React.Component {
  render() {
    const { barRef, thumbRef, left, show } = this.props
    return (
      <Bar ref={barRef} show={show}>
        <div ref={thumbRef} style={{ left: `${left}px` }} className="thumb" />
      </Bar>
    )
  }
}
