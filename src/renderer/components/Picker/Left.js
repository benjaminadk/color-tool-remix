import React from 'react'
import styled from 'styled-components'
import ColorBar from './ColorBar'
import Input from './Input'
import Swatch from './Swatch'
import Output from './Output'
import ActionRow from './ActionRow'
import constants from '../../lib/constants'
import getHSLString from '../../lib/getHSLString'
import getRGBString from '../../lib/getRGBString'
import copyToClipboard from '../../lib/copyToClipboard'

const { barHeight, barWidth, hueSlice, regSlice } = constants

const ColorBarsStyles = styled.div`
  .inputs {
    width: ${props => props.theme.barWidth};
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
  }

  .output-rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: start;
    margin: 2rem auto;
  }

  .color-strings {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 0.25rem;
    border: ${props => props.theme.border};
    background: white;
  }
`

export default class ColorBars extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hue: 180,
      sat: 100,
      lit: 50,
      opa: 100,
      hueLeft: 172,
      satLeft: 352,
      litLeft: 172,
      opaLeft: 352,
      copied: null,
      grab: false
    }

    this.hue = React.createRef()
    this.sat = React.createRef()
    this.lit = React.createRef()
    this.opa = React.createRef()
    this.thumbHue = React.createRef()
    this.thumbSat = React.createRef()
    this.thumbLit = React.createRef()
    this.thumbOpa = React.createRef()
  }

  componentDidMount() {
    this.createBars()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.h !== this.props.h ||
      prevProps.s !== this.props.s ||
      prevProps.l !== this.props.l ||
      prevProps.a !== this.props.a
    ) {
      this.onSwatchSelect(this.props)
    }
  }

  createBars = () => {
    const hue = this.state.hue

    for (let i = 0; i <= 360; i++) {
      if (!this.hue.current) console.log(i)
      const slice = document.createElement('div')
      slice.className = 'hue-slice'
      slice.style.width = `${hueSlice}px`
      slice.style.height = `${barHeight}px`
      slice.style.background = `hsl(${i}, 100%, 50%)`
      this.hue.current.appendChild(slice)
    }

    const onMouseMoveHue = e => this.setState({ hueLeft: `${this.getPosition(e)}` })

    const onMouseUpHue = e => {
      document.body.removeEventListener('mousemove', onMouseMoveHue)
      document.body.removeEventListener('mouseup', onMouseUpHue)
      this.setCursor('hue', false)
      this.setColor(e, 'hue')
    }

    this.hue.current.addEventListener('mousedown', e => {
      document.body.addEventListener('mousemove', onMouseMoveHue)
      document.body.addEventListener('mouseup', onMouseUpHue)
      this.setCursor('hue', true)
      this.setColor(e, 'hue')
    })

    for (let i = 0; i <= 100; i++) {
      if (!this.sat.current) console.log(i)
      let slice1 = document.createElement('div')
      slice1.className = 'sat-slice'
      slice1.style.width = `${regSlice}px`
      slice1.style.height = `${barHeight}px`
      slice1.style.background = `hsl(${hue}, ${i}%, 50%)`
      this.sat.current.appendChild(slice1)

      let slice2 = document.createElement('div')
      slice2.className = 'lit-slice'
      slice2.style.width = `${regSlice}px`
      slice2.style.height = `${barHeight}px`
      slice2.style.background = `hsl(${hue}, 100%, ${i}%)`
      this.lit.current.appendChild(slice2)

      let slice3 = document.createElement('div')
      slice3.className = 'opa-slice'
      slice3.style.width = `${regSlice}px`
      slice3.style.height = `${barHeight}px`
      slice3.style.background = `hsla(${hue}, 100%, 50%, ${i / 100})`
      this.opa.current.appendChild(slice3)
    }

    const onMouseMoveSat = e => this.setState({ satLeft: `${this.getPosition(e)}` })

    const onMouseUpSat = e => {
      document.body.removeEventListener('mousemove', onMouseMoveSat)
      document.body.removeEventListener('mouseup', onMouseUpSat)
      this.setCursor('sat', false)
      this.setColor(e, 'sat')
    }

    this.sat.current.addEventListener('mousedown', e => {
      document.body.addEventListener('mousemove', onMouseMoveSat)
      document.body.addEventListener('mouseup', onMouseUpSat)
      this.setCursor('sat', true)
      this.setColor(e, 'sat')
    })

    const onMouseMoveLit = e => this.setState({ litLeft: `${this.getPosition(e)}` })

    const onMouseUpLit = e => {
      document.body.removeEventListener('mousemove', onMouseMoveLit)
      document.body.removeEventListener('mouseup', onMouseUpLit)
      this.setCursor('lit', false)
      this.setColor(e, 'lit')
    }

    this.lit.current.addEventListener('mousedown', e => {
      document.body.addEventListener('mousemove', onMouseMoveLit)
      document.body.addEventListener('mouseup', onMouseUpLit)
      this.setCursor('lit', true)
      this.setColor(e, 'lit')
    })

    const onMouseMoveOpa = e => this.setState({ opaLeft: `${this.getPosition(e)}` })

    const onMouseUpOpa = e => {
      document.body.removeEventListener('mousemove', onMouseMoveOpa)
      document.body.removeEventListener('mouseup', onMouseUpOpa)
      this.setCursor('opa', false)
      this.setColor(e, 'opa')
    }

    this.opa.current.addEventListener('mousedown', e => {
      document.body.addEventListener('mousemove', onMouseMoveOpa)
      document.body.addEventListener('mouseup', onMouseUpOpa)
      this.setCursor('opa', true)
      this.setColor(e, 'opa')
    })
  }

  getPosition = e => {
    let offset = this.hue.current.offsetLeft
    return Math.max(barHeight * -0.5, Math.min(e.clientX - offset, barWidth - barHeight * 0.5))
  }

  setColor = (e, mode) => {
    const pos = this.getPosition(e)
    const offset = barHeight * 0.5
    if (mode === 'hue') {
      const hue = Math.round(pos + offset)
      this.setState({ hue, hueLeft: pos })
    } else if (mode === 'sat') {
      const sat = Math.round((pos + offset) / regSlice)
      this.setState({ sat, satLeft: pos })
    } else if (mode === 'lit') {
      const lit = Math.round((pos + offset) / regSlice)
      this.setState({ lit, litLeft: pos })
    } else if (mode === 'opa') {
      const opa = Math.round((pos + offset) / regSlice)
      this.setState({ opa, opaLeft: pos })
    }
    this.updatePickerBars()
  }

  setCursor = (mode, bool) => {
    if (bool) {
      this.setState({ grab: true })
      document.body.style.setProperty('cursor', '-webkit-grabbing')
    } else {
      this.setState({ grab: false })
      document.body.style.setProperty('cursor', 'default')
    }
  }

  onSwatchSelect = props => {
    const { h, s, l, a } = props
    const hue = h
    const hueLeft = h - 8
    const sat = s
    const satLeft = Math.round(s * 3.6) - 8
    const lit = l
    const litLeft = Math.round(l * 3.6) - 8
    const opa = a
    const opaLeft = Math.round(a * 3.6) - 8
    this.setState({ hue, hueLeft, sat, satLeft, lit, litLeft, opa, opaLeft }, () =>
      this.updatePickerBars()
    )
  }

  onInputChange = (e, type) => {
    let val = e.target.value.replace(/[^0-9]/g, '')
    const offset = barHeight * 0.5
    if (type === 'hue') {
      if (val > 360) val = 360
      this.setState({ hue: val, hueLeft: val - offset }, () => this.updatePickerBars())
    } else {
      if (val > 100) val = 100
      this.setState({
        [type]: val,
        [`${type}Left`]: Math.round(val * regSlice) - offset
      })
    }
  }

  onInputClick = (inc, type) => {
    let val = this.state[type]
    const offset = barHeight * 0.5
    val = inc ? val + 1 : val - 1
    if (val < 0) val = 0
    if (type === 'hue') {
      if (val > 360) val = 360
      this.setState({ hue: val, hueLeft: val - offset }, () => this.updatePickerBars())
    } else {
      if (val > 100) val = 100
      this.setState({
        [type]: val,
        [`${type}Left`]: Math.round(val * regSlice) - offset
      })
    }
  }

  copyColorString = (text, copied) => {
    copyToClipboard(text)
    this.setState({ copied }, () => {
      setTimeout(() => this.setState({ copied: null }), 5000)
    })
  }

  updatePickerBars = () => {
    const { hue } = this.state
    let satSlices = document.getElementsByClassName('sat-slice')
    let litSlices = document.getElementsByClassName('lit-slice')
    let opaSlices = document.getElementsByClassName('opa-slice')

    for (let i = 0; i < satSlices.length; i++) {
      satSlices[i].style.backgroundColor = `hsl(${hue}, ${i}%, 50%)`
      litSlices[i].style.backgroundColor = `hsl(${hue}, 100%, ${i}%)`
      opaSlices[i].style.backgroundColor = `hsla(${hue}, 100%, 50%, ${i / 100})`
    }
  }

  handleCreateSwatch = () => {
    const { hue, sat, lit, opa } = this.state
    const color = getHSLString(this.props.options.alphaMode, hue, sat, lit, opa)
    this.props.createSwatch(color)
  }

  render() {
    const { alphaMode } = this.props.options
    const { hue, sat, lit, opa } = this.state
    const hex = getRGBString(false, hue, sat, lit)
    const hexa = getRGBString(false, hue, sat, lit, opa)
    const rgb = getRGBString(true, hue, sat, lit)
    const rgba = getRGBString(true, hue, sat, lit, opa)
    const hsl = getHSLString(false, hue, sat, lit, opa)
    const hsla = getHSLString(true, hue, sat, lit, opa)
    const HEX = alphaMode ? hexa : hex
    const RGB = alphaMode ? rgba : rgb
    const HSL = alphaMode ? hsla : hsl
    return (
      <ColorBarsStyles>
        <ColorBar
          barRef={this.hue}
          thumbRef={this.thumbHue}
          left={this.state.hueLeft}
          show={true}
          grab={this.state.grab}
        />
        <ColorBar
          barRef={this.sat}
          thumbRef={this.thumbSat}
          left={this.state.satLeft}
          show={true}
          grab={this.state.grab}
        />
        <ColorBar
          barRef={this.lit}
          thumbRef={this.thumbLit}
          left={this.state.litLeft}
          show={true}
          grab={this.state.grab}
        />
        <ColorBar
          barRef={this.opa}
          thumbRef={this.thumbOpa}
          left={this.state.opaLeft}
          show={this.props.options.alphaMode}
          grab={this.state.grab}
        />
        <div className="inputs">
          <Input
            type="hue"
            value={hue}
            before="H"
            after="&deg;"
            onChange={this.onInputChange}
            onClick={this.onInputClick}
          />
          <Input
            type="sat"
            value={sat}
            before="S"
            after="%"
            onChange={this.onInputChange}
            onClick={this.onInputClick}
          />
          <Input
            type="lit"
            value={lit}
            before="L"
            after="%"
            onChange={this.onInputChange}
            onClick={this.onInputClick}
          />
          <Input
            type="opa"
            value={opa}
            before="A"
            after="%"
            onChange={this.onInputChange}
            onClick={this.onInputClick}
          />
        </div>
        <div className="output-rows">
          <Swatch alpha={this.props.options.alphaMode} hsl={hsl} hsla={hsla} />
          <div className="color-strings">
            <Output
              value={HSL}
              index={1}
              copied={this.state.copied}
              onClick={() => this.copyColorString(HSL, 1)}
            />
            <Output
              value={RGB}
              index={2}
              copied={this.state.copied}
              onClick={() => this.copyColorString(RGB, 2)}
            />
            <Output
              value={HEX}
              index={3}
              copied={this.state.copied}
              onClick={() => this.copyColorString(HEX, 3)}
            />
          </div>
        </div>
        <ActionRow
          handleCreateSwatch={this.handleCreateSwatch}
          setPickerSize={this.props.setPickerSize}
          initDropper={this.props.initDropper}
          setMode={this.props.setMode}
          openColorParsePrompt={this.props.openColorParsePrompt}
          createRandomColor={this.props.createRandomColor}
        />
      </ColorBarsStyles>
    )
  }
}
