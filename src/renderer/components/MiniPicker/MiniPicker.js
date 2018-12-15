import React from 'react'
import styled from 'styled-components'
import { Colorize, OpenWith } from 'styled-icons/material'
import copyToClipboard from '../../lib/copyToClipboard'
import getContrastColor from '../../lib/getContrastColor'
import getHSLParts from '../../lib/getHSLParts'
import getRGBString from '../../lib/getRGBString'

const MiniPickerStyles = styled.div`
  width: ${props => props.theme.miniPickerWidth};
  height: 500px;
  background: ${props => props.theme.accentColor};
`

const ColorColumn = styled.div`
  width: ${props => props.theme.miniPickerWidth};
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  justify-items: center;
  align-items: center;
`

const MiniColor = styled.div`
  position: relative;
  width: ${props => props.theme.miniPickerWidth};
  height: ${props => props.theme.miniPickerWidth};
  background: ${props => props.color};
  color: ${props => getContrastColor(props.color)};
  .inner {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-family: 'Inconsolata';
  }
  .label {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.75rem;
    font-family: 'Oswald';
    padding: 0 0.35rem;
    color: ${props => getContrastColor(props.color)};
  }
  &:hover .label {
    transform: scale(1.2);
  }
`

const Button = styled.button`
  width: ${props => props.theme.miniPickerWidth};
  height: ${props => props.theme.miniPickerWidth};
  background: white;
  color: ${props => props.theme.black};
  border: none;
  transition: all 0.25s;
  &:hover {
    background: ${props => props.theme.black};
    color: white;
  }
`

const SplitButton = styled.div`
  width: ${props => props.theme.miniPickerWidth};
  height: ${props => props.theme.miniPickerWidth};
  display: grid;
  grid-template-columns: 1fr 1fr;
  button {
    background: white;
    color: ${props => props.theme.black};
    border: none;
    transition: all 0.25s;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
  }
`

const QuadButton = styled.div`
  width: ${props => props.theme.miniPickerWidth};
  height: ${props => props.theme.miniPickerWidth};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  button {
    background: white;
    color: ${props => props.theme.black};
    border: none;
    font-size: 0.85rem;
    transition: all 0.25s;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
    &:nth-child(${props => props.buttonIndex + 1}) {
      background: ${props => props.theme.black};
      color: white;
    }
    &:nth-child(4) {
      background: ${props => (props.pinned === 1 ? props.theme.black : 'white')};
      color: ${props => (props.pinned === 1 ? 'white' : props.theme.black)};
    }
  }
`

export default class MiniPicker extends React.Component {
  state = {
    copiedIndex: null,
    buttonIndex: 0,
    start: 0,
    end: 5
  }

  handleCopy = (text, copiedIndex) => {
    const { buttonIndex } = this.state
    let textToCopy
    const [_, h, s, l, a] = getHSLParts(text)
    if (buttonIndex === 0) {
      textToCopy = text
    } else if (buttonIndex === 1) {
      textToCopy = getRGBString(true, h, s, l)
    } else {
      textToCopy = getRGBString(false, h, s, l)
    }
    copyToClipboard(textToCopy)
    this.setState({ copiedIndex }, () => {
      setTimeout(() => {
        this.setState({ copiedIndex: null })
      }, 2500)
    })
  }

  onCycleRight = () => {
    if (this.state.end === 63) return
    if (this.props.colors[this.state.end].clean === true) return
    this.setState({ start: this.state.start + 1, end: this.state.end + 1 })
  }

  onCycleLeft = () => {
    if (this.state.start === 0) return
    this.setState({ start: this.state.start - 1, end: this.state.end - 1 })
  }

  setPinnedOption = () => {
    let options
    if (this.props.options.alwaysOnTop) {
      options = Object.assign({}, this.props.options, { alwaysOnTop: false })
    } else {
      options = Object.assign({}, this.props.options, { alwaysOnTop: true })
    }
    this.props.saveOptions(options)
  }

  setButtonIndex = buttonIndex => this.setState({ buttonIndex })

  render() {
    const { start, end } = this.state
    const miniColors = this.props.colors.slice(start, end)
    return (
      <MiniPickerStyles>
        <ColorColumn>
          {miniColors.map((c, i) => (
            <MiniColor key={i} color={c.color}>
              <div className="inner" onClick={() => this.handleCopy(c.color, i)}>
                {this.state.copiedIndex === i ? 'Copied!' : ''}
              </div>
              <span className="label">{i + this.state.start + 1}</span>
            </MiniColor>
          ))}
          <SplitButton>
            <button onClick={this.onCycleLeft}>◀</button>
            <button onClick={this.onCycleRight}>▶</button>
          </SplitButton>
          <QuadButton
            buttonIndex={this.state.buttonIndex}
            pinned={this.props.options.alwaysOnTop ? 1 : 0}
          >
            <button onClick={() => this.setButtonIndex(0)}>hsl</button>
            <button onClick={() => this.setButtonIndex(1)}>rgb</button>
            <button onClick={() => this.setButtonIndex(2)}>hex</button>
            <button onClick={() => this.setPinnedOption()}>📌</button>
          </QuadButton>
          <Button onClick={this.props.initDropper}>
            <Colorize size={20} color="inherit" />
          </Button>
          <Button onClick={() => this.props.setPickerSize(false)}>
            <OpenWith size={20} color="inherit" />
          </Button>
        </ColorColumn>
      </MiniPickerStyles>
    )
  }
}
