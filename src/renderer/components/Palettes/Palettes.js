import React from 'react'
import styled from 'styled-components'
import NoPalettes from './NoPalettes'
import TitleList from './TitleList'
import Cube from './Cube'
import Actions from './Actions'
import ColorRow from './ColorRow'
import copyToClipboard from '../../lib/copyToClipboard'
import getHSLParts from '../../lib/getHSLParts'
import getRGBString from '../../lib/getRGBString'

export const Container = styled.div`
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 1fr 200px;
  grid-gap: 2rem;
  padding: 0.5rem;
`

const Palette = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr 50px;
    margin: 0;
    padding: 0;
    background: white;
    border: ${props => props.theme.border};
    box-shadow: ${props => props.theme.shadows[1]};
    p {
      justify-self: center;
      align-self: center;
      font-size: 2rem;
      text-align: center;
      margin: 0;
      padding: 0;
    }
  }
  .grid {
    width: 100%;
    height: 350px;
    overflow-y: auto;
    display: grid;
    grid-template-rows: ${props => `repeat(${props.length}, 35px)`};
    grid-gap: 5px;
    justify-items: center;
    margin-top: 1rem;
  }
`

export default class Palettes extends React.Component {
  state = {
    index: 0,
    copied: false,
    copiedAll: false
  }

  handleDelete = (i, name) => {
    this.setState({ index: 0 }, () => {
      this.props.deletePalette(i, name)
    })
  }

  setIndex = index => this.setState({ index })

  copyAsVariables = () => {
    if (this.state.copiedAll !== false) return
    const { index } = this.state
    const {
      palettes,
      options: { paletteFormat }
    } = this.props
    let colors = palettes[index].colors
    let str = ``
    colors.forEach(c => {
      if (c.name) {
        str += `${c.name}: ${this.getFormatted(c.color, paletteFormat)};\n`
      }
    })
    copyToClipboard(str)
    this.setState({ copiedAll: true }, () => {
      setTimeout(() => this.setState({ copiedAll: false }), 5000)
    })
  }

  getFormatted = (color, format) => {
    let cs
    if (format === 'hsl') {
      cs = color
    } else {
      let [_, h, s, l] = getHSLParts(color)
      cs = getRGBString(format === 'rgb', h, s, l)
    }
    return cs
  }

  copyToClipboard = (str, i) => {
    if (this.state.copied !== false) return
    copyToClipboard(str)
    this.setState({ copied: i }, () => {
      setTimeout(() => this.setState({ copied: false }), 5000)
    })
  }

  render() {
    const { index } = this.state
    const {
      setMode,
      palettes,
      options: { paletteFormat, accentColor }
    } = this.props
    if (!palettes.length) {
      return <NoPalettes setMode={setMode} />
    } else {
      const { name, colors } = palettes[index]
      return (
        <Container>
          <Palette length={colors.filter(c => !c.clean).length}>
            <div className="top">
              <Actions
                accentColor={accentColor}
                setMode={() => this.props.setMode(0)}
                copyAsVariables={this.copyAsVariables}
                loadPalette={() => this.props.loadPalette(palettes[index])}
                handleDelete={() => this.handleDelete(index, name)}
              />
              <p>{this.state.copiedAll ? 'Copied All' : name}</p>
              <Cube colors={colors} />
            </div>
            <div className="grid">
              {colors.map((c, i) => {
                if (c.clean) return null
                const formatted = this.getFormatted(c.color, paletteFormat)
                return (
                  <ColorRow
                    key={i}
                    hsl={c.color}
                    color={formatted}
                    name={c.name}
                    accentColor={accentColor}
                    copied={this.state.copied === i}
                    copyToClipboard={() => this.copyToClipboard(formatted, i)}
                  />
                )
              })}
            </div>
          </Palette>
          <TitleList palettes={palettes} index={index} setIndex={this.setIndex} />
        </Container>
      )
    }
  }
}
