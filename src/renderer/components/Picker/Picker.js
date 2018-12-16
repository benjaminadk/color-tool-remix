import React from 'react'
import styled from 'styled-components'
import Left from './Left'
import Right from './Right'

const Picker = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-self: center;
  padding: 1rem;
`

export default class extends React.Component {
  render() {
    return (
      <Picker>
        <Left
          options={this.props.options}
          h={this.props.h}
          s={this.props.s}
          l={this.props.l}
          a={this.props.a}
          createSwatch={this.props.createSwatch}
          setPickerSize={this.props.setPickerSize}
          initDropper={this.props.initDropper}
          setMode={this.props.setMode}
          openColorParsePrompt={this.props.openColorParsePrompt}
          createRandomColor={this.props.createRandomColor}
        />
        <Right
          colors={this.props.colors}
          paletteName={this.props.paletteName}
          resetColors={this.props.resetColors}
          onSwatchClick={this.props.onSwatchClick}
          onContextMenu={this.props.onContextMenu}
          savePalette={this.props.savePalette}
          setMode={this.props.setMode}
          handleChange={this.props.handleChange}
        />
      </Picker>
    )
  }
}
