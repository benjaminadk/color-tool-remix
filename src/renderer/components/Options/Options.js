import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 1rem;
  .title {
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid ${props => props.theme.black};
  }
  .options {
    display: grid;
    grid-template-rows: repeat(5, auto);
    margin-bottom: 2rem;
    & > * {
      margin-bottom: 0.5rem;
    }
  }
  .alpha,
  .onTop,
  .palette-format,
  .count {
    width: 300px;
    height: 35px;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-self: space-between;
    label {
      font-size: ${props => props.theme.smallerFontSize};
      font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    }
    input {
      text-align: center;
      justify-self: end;
      margin: 0;
      padding: 0.5rem;
      font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    }
    input[type='checkbox'] {
      transform: scale(1.5);
    }
    input[type='number'] {
      width: 85px;
      outline: none;
    }
  }
  .highlight {
    width: 300px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-items: space-between;
    label {
      font-size: ${props => props.theme.smallerFontSize};
    }
  }
  select,
  option {
    width: 100px;
    text-align: center;
    padding: 0.5rem;
    font-family: 'Inconsolata', Arial, Helvetica, sans-serif;
    outline: none;
  }
  button {
    width: 100px;
    background: white;
    border: ${props => props.theme.border};
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    transition: all 0.25s;
    user-select: none;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
  }
  .palette-format > select {
    justify-self: end;
  }
`

const Square = styled.span`
  width: 15px;
  height: 15px;
  justify-self: center;
  border-radius: 50%;
  background: ${props => props.color};
`

const colors = ['orangered', 'lime', 'dodgerblue', 'red']
const formats = ['hsl', 'rgb', 'hex']

export default class Options extends React.Component {
  state = {
    alphaMode: false,
    alwaysOnTop: false,
    paletteFormat: 'hsl',
    accentColor: 'red',
    dropperAnalyzerCount: 8
  }

  componentDidMount() {
    this.setState({ ...this.props.options })
  }

  handleChange = e => {
    const { name, value, checked } = e.target
    if (['alphaMode', 'alwaysOnTop'].includes(name)) {
      return this.setState({ [name]: checked })
    }
    this.setState({ [name]: value })
  }

  handleSave = () => {
    const options = {
      alphaMode: this.state.alphaMode,
      alwaysOnTop: this.state.alwaysOnTop,
      paletteFormat: this.state.paletteFormat,
      accentColor: this.state.accentColor,
      dropperAnalyzerCount: this.state.dropperAnalyzerCount
    }
    this.props.saveOptions(options)
    this.props.setMode(0)
  }

  render() {
    return (
      <Container>
        <p className="title">Options</p>
        <div className="options">
          <div className="alpha">
            <label htmlFor="alphaMode">Alpha Mode</label>
            <input
              type="checkbox"
              name="alphaMode"
              checked={this.state.alphaMode}
              onChange={this.handleChange}
            />
          </div>

          <div className="onTop">
            <label htmlFor="alwaysOnTop">Always On Top </label>
            <input
              type="checkbox"
              name="alwaysOnTop"
              checked={this.state.alwaysOnTop}
              onChange={this.handleChange}
            />
          </div>

          <div className="palette-format">
            <label htmlFor="paletteFormat">Palette Color Format</label>
            <select
              name="paletteFormat"
              value={this.state.paletteFormat}
              onChange={this.handleChange}
            >
              {formats.map(format => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div className="highlight">
            <label htmlFor="accentColor">Accent Color</label>
            <Square color={this.state.accentColor} />
            <select name="accentColor" value={this.state.accentColor} onChange={this.handleChange}>
              {colors.map(color => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="count">
            <label className="label" htmlFor="dropperAnalyzerCount">
              Analyzer Count
            </label>
            <input
              type="number"
              name="dropperAnalyzerCount"
              value={this.state.dropperAnalyzerCount}
              onChange={this.handleChange}
              min={1}
              max={16}
            />
          </div>
        </div>
        <button onClick={this.handleSave}>Save</button>
        <button onClick={() => this.props.setMode(0)}>Cancel</button>
      </Container>
    )
  }
}
