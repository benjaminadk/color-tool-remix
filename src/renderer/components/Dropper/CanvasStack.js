import React from 'react'
import styled from 'styled-components'
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp
} from 'styled-icons/material'
import Box from './Box'

const CanvasStack = styled.div`
  width: ${props => props.theme.dropperWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  .stack-row {
    width: ${props => props.theme.dropperWidth};
    display: flex;
    justify-content: space-between;
    align-items: center;

    .canvas-stack {
      position: relative;
      width: 100px;
      height: 100px;
      border: 1px solid;
      cursor: ${props => (props.frozen ? 'default' : 'none')};

      #c1 {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      }

      #c2 {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
      }

      #top {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-wrap: wrap;
        z-index: 3;
      }
    }
  }
`

export default props => (
  <CanvasStack frozen={props.frozen}>
    <button onClick={props.shiftCanvasUp}>
      <KeyboardArrowUp color="#333333" size={20} />
    </button>
    <div className="stack-row">
      <button onClick={props.shiftCanvasLeft}>
        <KeyboardArrowLeft color="#333333" size={20} />
      </button>
      <div className="canvas-stack">
        <canvas id="c1" ref={props.c1Ref} width={props.width} height={props.height} />
        <canvas id="c2" ref={props.c2Ref} width={props.width} height={props.height} />
        <div id="top" ref={props.topRef}>
          {[...Array(100)].map((e, i) => (
            <Box
              key={i}
              index={i}
              selectedIndex={props.boxIndex}
              outlineColor={props.options.accentColor}
              onClick={() => props.setBoxIndex(i)}
            />
          ))}
        </div>
      </div>
      <button onClick={props.shiftCanvasRight}>
        <KeyboardArrowRight color="#333333" size={20} />
      </button>
    </div>
    <button onClick={props.shiftCanvasDown}>
      <KeyboardArrowDown color="#333333" size={20} />
    </button>
  </CanvasStack>
)
