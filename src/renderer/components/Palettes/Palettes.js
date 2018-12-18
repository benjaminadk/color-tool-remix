import React from 'react'
import { remote } from 'electron'
import styled from 'styled-components'
import prompt from 'electron-prompt-benjaminadk'
import NoPalettes from './NoPalettes'
import TitleList from './TitleList'
import Cube from './Cube'
import IconRow from './IconRow'
import ColorRow from './ColorRow'
import copyToClipboard from '../../lib/copyToClipboard'

export const Container = styled.div`
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: 0.5rem;
`

const Display = styled.div`
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr 1.5fr;
    margin: 0;
    padding: 0;
    background: white;
    border: ${props => props.theme.border};
    p {
      justify-self: center;
      font-family: 'Oswald';
      font-size: 2.5rem;
      text-align: center;
      margin: 0;
      padding: 0;
    }
    .actions {
      align-self: flex-end;
      justify-self: flex-end;
      button {
        background: white;
        color: ${props => props.theme.black};
        border: none;
        cursor: pointer;
        transition: all 0.25s;
        &:hover {
          color: dodgerblue;
        }
      }
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
    index: 0
  }

  handleDelete = (i, name) => {
    this.setState({ index: 0 }, () => {
      this.props.deletePalette(i, name)
    })
  }

  setIndex = index => this.setState({ index })

  copyAsVariables = () => {
    const { index } = this.state
    const { palettes } = this.props
    let colors = palettes[index].colors
    let str = ``
    colors.forEach(c => {
      if (c.name) {
        str += `${c.name}: ${c.color};\n`
      }
    })
    copyToClipboard(str)
    const options = {
      height: 200,
      title: 'Success',
      label: 'Copied Text',
      message:
        'Your color names and values have been copied to your clipboard in css/scss variable style.',
      ok: 'I Get It',
      type: 'alert'
    }
    prompt(options, remote.getCurrentWindow())
  }

  render() {
    const { index } = this.state
    const { setMode, palettes } = this.props
    if (!palettes.length) {
      return <NoPalettes setMode={setMode} />
    } else {
      const { name, colors } = palettes[index]
      return (
        <Container>
          <TitleList palettes={palettes} index={index} setIndex={this.setIndex} />
          <Display length={colors.filter(c => !c.clean).length}>
            <div className="top">
              <Cube colors={colors} />
              <p>{name}</p>
              <IconRow
                setMode={() => this.props.setMode(0)}
                copyAsVariables={this.copyAsVariables}
                loadPalette={() => this.props.loadPalette(palettes[index])}
                handleDelete={() => this.handleDelete(index, name)}
              />
            </div>
            <div className="grid">
              {colors.map((c, i) => {
                if (c.clean) return null
                return <ColorRow key={i} color={c} />
              })}
            </div>
          </Display>
        </Container>
      )
    }
  }
}
