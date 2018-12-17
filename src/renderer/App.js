import React from 'react'
import { remote, ipcRenderer } from 'electron'
import rgbToHsl from 'rgb-to-hsl'
import colorString from 'color-string'
import prompt from 'common/electronPopup'
import fs from 'fs'
import { promisify } from 'util'
import Picker from './components/Picker/Picker'
import Options from './components/Options/Options'
import Palettes from './components/Palettes/Palettes'
import MiniPicker from './components/MiniPicker/MiniPicker'
import Dropper from './components/Dropper/Dropper'
import getHSLParts from './lib/getHSLParts'
import getHSLString from './lib/getHSLString'
import getFilepath from 'common/filepaths'
import screenDimens from 'common/screenDimens'
import endpoint from 'common/endpoint'
import getStaticFile from 'common/getStaticFile'
import constants from './lib/constants'

const inDev = process.env.NODE_ENV === 'development'
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const colorsPath = getFilepath('colors.json')
const optionsPath = getFilepath('options.json')
const palettesPath = getFilepath('palettes.json')
const [screenWidth, screenHeight, x, y] = screenDimens()
let mainWin = remote.BrowserWindow.fromId(1)
let dropWin

export default class App extends React.Component {
  state = {
    windowId: null,
    options: constants.options,
    h: null,
    s: null,
    l: null,
    a: null,
    colors: null,
    palettes: null,
    mode: 0,
    paletteName: '',
    inputString: ''
  }

  componentDidMount() {
    const windowId = remote.getCurrentWindow().id
    this.setState({ windowId }, () => {
      if (windowId === 1) {
        this.initColors()
        this.initPalettes()
      }
      this.initOptions()
    })

    ipcRenderer.on('picker.large', () => {
      console.log('renderer received --> [picker.large]')
      this.setMode(0)
      this.props.setPickerSize(false)
      mainWin.focus()
    })

    ipcRenderer.on('picker.small', () => {
      console.log('renderer received --> [picker.small]')
      this.setMode(0)
      this.props.setPickerSize(true)
      mainWin.focus()
    })

    ipcRenderer.on('dropper.open', () => {
      console.log('renderer received --> [dropper.open]')
      this.initDropper()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { alwaysOnTop } = this.state.options
    if (prevState.options.alwaysOnTop !== alwaysOnTop) {
      remote.getCurrentWindow().setAlwaysOnTop(alwaysOnTop)
      this.props.setShowPin(alwaysOnTop)
    }
  }

  // clean up event listeners
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('picker.large')
    ipcRenderer.removeAllListeners('picker.small')
    ipcRenderer.removeAllListeners('dropper.open')
    ipcRenderer.removeAllListeners('dropper.close')
    ipcRenderer.removeAllListeners('dropper.color')
    ipcRenderer.removeAllListeners('dropper.analyzer')
  }

  // initialize colors from saved json file or create blank palette
  initColors = async () => {
    try {
      const data = await readFileAsync(colorsPath)
      const colors = JSON.parse(data)
      this.setState({ colors })
    } catch (error) {
      this.createColors()
    }
  }

  // initialize options from saved json file or create with defaults
  initOptions = async () => {
    try {
      const data = await readFileAsync(optionsPath)
      const options = JSON.parse(data)
      this.setState({ options })
    } catch (error) {
      this.createOptions()
    }
  }

  // initialize save palettes of create file
  initPalettes = async () => {
    try {
      const data = await readFileAsync(palettesPath)
      const palettes = JSON.parse(data)
      this.setState({ palettes })
    } catch (error) {
      this.createPalettes()
    }
  }

  // create colors file
  createColors = async () => {
    let colors = []
    for (let i = 0; i < 64; i++) {
      colors[i] = { color: 'transparent', name: '', clean: true }
    }
    this.setState({ colors })
    await writeFileAsync(colorsPath, JSON.stringify(colors))
  }

  // delete a single color swatch
  deleteColor = async i => {
    const options = {
      height: 200,
      title: 'Confirm',
      label: 'Delete Color Swatch',
      message:
        'This action will permanently delete this color from the active palette. Are you sure you want to do this?',
      ok: 'Delete',
      cancel: 'Cancel',
      type: 'confirm'
    }
    const deleteSwatch = await prompt(options, mainWin)
    if (deleteSwatch) {
      const { colors } = this.state
      const newColors = colors.filter((color, index) => index !== i)
      newColors.push({ color: 'transparent', name: '', clean: true })
      this.setState({ colors: newColors })
      await writeFileAsync(colorsPath, JSON.stringify(newColors))
    }
  }

  // clear the active palette but ask first
  resetColors = async () => {
    if (this.state.colors[0].clean) return
    const options = {
      height: 200,
      title: 'Confirm',
      label: 'Reset Color Palette',
      message:
        'This action will permanently delete all colors in the active palette. Make sure you save your palette first if you want to keep them.',
      ok: 'Reset',
      cancel: 'Cancel',
      type: 'confirm'
    }
    const cs = await prompt(options, mainWin)
    if (cs) this.createColors()
  }

  // create options file
  createOptions = async () => {
    this.setState({ options: constants.options })
    await writeFileAsync(optionsPath, JSON.stringify(constants.options))
  }

  saveOptions = async options => {
    this.setState({ options })
    await writeFileAsync(optionsPath, JSON.stringify(options))
  }

  createPalettes = async () => {
    this.setState({ palettes: [] })
    await writeFileAsync(palettesPath, JSON.stringify([]))
  }

  // save the active palette to disk with a name
  savePalette = async () => {
    let palette, index
    let { paletteName, colors, palettes } = this.state
    // no colors!!
    if (colors[0].clean) return
    // configure error alert if no palette name entered
    const options = {
      height: 150,
      title: 'Error',
      label: 'No Palette Name',
      message: 'Your palette must have a name before saving.',
      ok: 'Ahhhhh',
      type: 'alert'
    }
    if (!paletteName) return prompt(options, mainWin)

    // create new palette object
    const newPalette = { name: paletteName, colors }
    // check if name already exists and overwrite if true
    palette = palettes.find((el, i) => {
      index = i
      return el.name === paletteName
    })
    if (palette) {
      palette.colors = colors
      palettes[index] = palette
    } else {
      palette = newPalette
      palettes.push(palette)
    }
    this.setState({ palettes })
    // save palette to disk
    await writeFileAsync(palettesPath, JSON.stringify(palettes))
    // send success message after saving
    const options2 = Object.assign(options, {
      height: 150,
      title: 'Success',
      label: 'Saved Palette',
      message: 'Your palette has been saved.',
      ok: 'Cool'
    })
    await prompt(options2, mainWin)
  }

  // load a saved palette into the active palette
  loadPalette = palette => {
    const { name, colors } = palette
    this.setState({ paletteName: name, colors })
    this.setMode(0)
  }

  // delete a palette from disk
  deletePalette = async (i, name) => {
    const options = {
      height: 175,
      title: 'Confirm',
      label: 'Delete Palette',
      message: `This will permanently delete ${name}. Are you sure?`,
      ok: 'Delete',
      cancel: 'Cancel',
      type: 'confirm'
    }
    const deletePalette = await prompt(options, mainWin)
    if (deletePalette) {
      const { palettes } = this.state
      const newPalettes = palettes.filter((palette, index) => index !== i)
      this.setState({ palettes: newPalettes })
      await writeFileAsync(palettesPath, JSON.stringify(newPalettes))
      return true
    }
    return false
  }
  // initializes the dropper
  initDropper = () => {
    // IPC message from dropper with new color to save
    ipcRenderer.once('dropper.color', (e, color) => {
      console.log('renderer received --> [dropper.color]')
      this.props.setDropperMode(false)
      color && this.createSwatch(color, 'rgb')
      mainWin.show()
    })

    // IPC message from dropper exit with no color
    ipcRenderer.once('dropper.close', e => {
      console.log('renderer received --> [dropper.close]')
      this.props.setDropperMode(false)
      mainWin.show()
    })

    // analyzer here
    ipcRenderer.once('dropper.analyzer', (e, colors) => {
      console.log('renderer received --> [dropper.analyzer]')
      this.props.setDropperMode(false)
      colors.forEach(c => {
        this.createSwatch(c[0], 'hsl')
      })
      mainWin.show()
    })

    // hide main window
    mainWin.hide()
    // set mode to dropper
    this.props.setDropperMode(true)
    // define dropper window
    dropWin = new remote.BrowserWindow({
      width: screenWidth,
      height: screenHeight,
      x,
      y,
      frame: false,
      transparent: true,
      alwaysOnTop: true
    })
    // runs same endpoint as main window
    dropWin.loadURL(endpoint(inDev))
    // dropWin.webContents.openDevTools({ mode: 'bottom' })
    dropWin.on(close, () => {
      dropWin = null
    })
  }

  // creates a new color swatch in the palette
  createSwatch = async (color, type) => {
    let a, str, newColor
    const colors = this.state.colors
    // check to see if palette is full
    if (!colors[63].clean) {
      const options = {
        height: 175,
        title: 'Error',
        label: 'Full Palette',
        message: 'Unbelievable, you filled an entire palette. Time to make a new one!',
        ok: 'I See',
        type: 'alert'
      }
      return prompt(options, mainWin)
    }
    // dropper returns rgb string so we have to parse it to hsl
    if (type === 'rgb') {
      let rgb = color.replace(/[^\d,]/g, '').split(',')
      let hsl = rgbToHsl(...rgb)
      let h = Math.round(hsl[0])
      let s = Math.round(parseInt(hsl[1]), 10)
      let l = Math.round(parseInt(hsl[2]), 10)
      if (hsl.length > 3) {
        a = parseInt(hsl[3], 10)
        str = getHSLString(true, h, s, l, a)
      } else {
        a = 100
        str = getHSLString(false, h, s, l)
      }
      newColor = { color: str, name: '', clean: false }
    } else {
      // color from bar type color pick is saved as it in hsl
      newColor = { color, name: '', clean: false }
    }
    // save color to first open palette location
    const firstAvailable = colors.findIndex(c => c.clean)
    colors[firstAvailable] = newColor
    // sythetic click sets HSLA bars to new color's values
    this.onSwatchClick(newColor)
    this.setState({ colors })
    await writeFileAsync(colorsPath, JSON.stringify(colors))
  }

  onSwatchClick = c => {
    if (!c) return
    var [_, h, s, l, a] = getHSLParts(c.color)
    this.setState({ h, s, l, a })
  }

  // context menu template - labels, functions and icons
  onContextMenu = (e, c, i) => {
    e.preventDefault()
    if (c.clean) return
    const template = [
      { label: 'Color Generators', enabled: false },
      { type: 'separator' },
      {
        label: 'Color Name',
        click: () => this.openNameColorPrompt(c, i),
        icon: getStaticFile('name-16x16.png')
      },
      {
        label: 'Complementary',
        click: () => this.makeCompColor(c, i),
        icon: getStaticFile('comp-16x16.png')
      },
      {
        label: 'Split Complementary',
        click: () => this.makeSplitCompColor(c, i),
        icon: getStaticFile('split-16x16.png')
      },
      {
        label: 'Triadic',
        click: () => this.makeTriadicColor(c, i),
        icon: getStaticFile('triadic-16x16.png')
      },
      {
        label: 'Tetradic',
        click: () => this.makeTetradic(c, i),
        icon: getStaticFile('tetradic-16x16.png')
      },
      {
        label: 'Analagous',
        click: () => this.makeAnalogous(c, i),
        icon: getStaticFile('analogous-16x16.png')
      },
      {
        label: 'Monochromatic',
        click: () => this.makeMonochromeColor(c, i),
        icon: getStaticFile('mono-16x16.png')
      },
      { type: 'separator' },
      { label: 'Delete Color', click: () => this.deleteColor(i), icon: getStaticFile('delete.png') }
    ]
    const menu = remote.Menu.buildFromTemplate(template)
    menu.popup({ window: remote.getCurrentWindow() })
  }

  // helper function apply math to base color
  generateColors = async (c, i, x1, x2, x3) => {
    const { colors } = this.state
    var h1, cs1, color
    var [bool, h, s, l, a] = getHSLParts(c.color)
    for (let y = x1; y <= x2; y += x3) {
      h1 = (h + y) % 360
      cs1 = getHSLString(bool, h1, s, l, a)
      color = { color: cs1, name: '', clean: false }
      colors.splice(i + 1, 0, color)
      colors.pop()
    }
    this.setState({ colors })
    this.onSwatchClick(c)
    await writeFileAsync(colorsPath, JSON.stringify(colors))
  }
  // generates one complementary color
  makeCompColor = (c, i) => {
    if (!this.state.colors[63].clean) return
    this.generateColors(c, i, 180, 180, 180)
  }
  // generates two split complementary colors
  makeSplitCompColor = (c, i) => {
    if (!this.state.colors[62].clean) return
    this.generateColors(c, i, 150, 210, 60)
  }
  // generates two colors to complete triad
  makeTriadicColor = (c, i) => {
    if (!this.state.colors[62].clean) return
    this.generateColors(c, i, 120, 240, 120)
  }
  // generates three colors to complete tetrad
  makeTetradic = (c, i) => {
    if (!this.state.colors[61].clean) return
    this.generateColors(c, i, 90, 270, 90)
  }
  // generates four colors
  makeAnalogous = (c, i) => {
    if (!this.state.colors[60].clean) return
    this.generateColors(c, i, 30, 90, 30)
  }
  // generates 8 colors for the same hue
  makeMonochromeColor = async (c, i) => {
    const { colors } = this.state
    if (!colors[57].clean) return
    var cs, color
    var [bool, h, s, l, a] = getHSLParts(c.color)
    for (let x = 15; x <= 85; x += 10) {
      cs = getHSLString(bool, h, s, x, a)
      color = { color: cs, name: '', clean: false }
      x === 85 && colors.splice(i, 1, color)
      x !== 85 && colors.splice(i + 1, 0, color)
      x !== 85 && colors.pop()
    }
    this.setState({ colors })
    this.onSwatchClick(c)
    await writeFileAsync(colorsPath, JSON.stringify(colors))
  }

  // limit palette names to 25 characters
  handleChange = e => {
    const { name, value } = e.target
    if (name === 'paletteName') {
      if (value.length >= 25)
        return this.setState({
          [name]: value.slice(0, 25)
        })
      this.setState({ [name]: value })
    }
    if (name === 'inputString') {
      this.setState({ [name]: value })
    }
  }

  // parse user input into a color swatch or return error
  openColorParsePrompt = async () => {
    // prompt user for string input
    let options = {
      height: 165,
      title: 'Color Parser',
      label: 'Color String',
      ok: 'Parse Color',
      cancel: 'Cancel',
      type: 'input',
      inputAttrs: { type: 'text', placeholder: 'Enter HSL, RGB or HEX value' }
    }
    const cs = await prompt(options, mainWin)
    // exit if cancelled
    if (!cs) return
    // otherwise attempt to parse
    else {
      let str, newColor
      const colors = this.state.colors
      // parse and construct color
      const parsed = colorString.get(cs)
      // totally unparsable
      if (!parsed) {
        const options2 = Object.assign(options, {
          title: 'Error',
          label: 'Invalid Input',
          message: `${cs} is not a parsable string.`,
          ok: 'Try #FF00FF',
          type: 'alert'
        })
        return prompt(options2, mainWin)
        // hsl model is easy
      } else if (parsed.model === 'hsl') {
        str = getHSLString(false, parsed.value[0], parsed.value[1], parsed.value[2])
        // rgb requires some work
      } else if (parsed.model === 'rgb') {
        let hsl = rgbToHsl(parsed.value[0], parsed.value[1], parsed.value[2])
        let h = Math.round(hsl[0])
        let s = Math.round(parseInt(hsl[1]), 10)
        let l = Math.round(parseInt(hsl[2]), 10)
        str = getHSLString(false, h, s, l)
        // catches typos like rgb(123,123,whoops)
      } else {
        return prompt(options2, mainWin)
      }
      // make new colors
      newColor = { color: str, name: '', clean: false }
      // save color to first open palette location
      const firstAvailable = colors.findIndex(c => c.clean)
      colors[firstAvailable] = newColor
      // sythetic click sets HSLA bars to new color's values
      this.onSwatchClick(newColor)
      this.setState({ colors })
      await writeFileAsync(colorsPath, JSON.stringify(colors))
    }
  }

  // add a name property to the color
  openNameColorPrompt = async (c, i) => {
    // prompt user for string input
    let options = {
      height: 165,
      title: 'Color Name',
      label: 'Color Name',
      ok: 'Save',
      cancel: 'Cancel',
      type: 'input',
      value: c.name,
      inputAttrs: { type: 'text', placeholder: 'Enter exact text ex: $primary, --dark-pink' }
    }
    const name = await prompt(options, mainWin)
    // exit if cancelled
    if (!name) return
    else {
      let { colors } = this.state
      colors[i].name = name
      this.setState({ colors })
    }
  }

  // limits random color saturation and lightness range to remove very light/dark colors
  createRandomColor = () => {
    const h = Math.floor(Math.random() * 360)
    let s = Math.floor(Math.random() * 100)
    let l = Math.floor(Math.random() * 100)
    if (s < 50) s += 50
    if (l < 25) l += 25
    if (l > 75) l -= 25
    const color = `hsl(${h}, ${s}%, ${l}%)`
    this.createSwatch(color, 'hsl')
  }

  // toggles mode between picker, options, palettes
  setMode = mode => this.setState({ mode })

  render() {
    if (this.state.windowId === 1) {
      if (this.props.fullSize) {
        if (this.state.mode === 0) {
          return (
            <Picker
              options={this.state.options}
              colors={this.state.colors}
              h={this.state.h}
              s={this.state.s}
              l={this.state.l}
              a={this.state.a}
              paletteName={this.state.paletteName}
              createSwatch={this.createSwatch}
              resetColors={this.resetColors}
              savePalette={this.savePalette}
              setPickerSize={this.props.setPickerSize}
              onSwatchClick={this.onSwatchClick}
              initDropper={this.initDropper}
              onContextMenu={this.onContextMenu}
              setMode={this.setMode}
              handleChange={this.handleChange}
              openColorParsePrompt={this.openColorParsePrompt}
              createRandomColor={this.createRandomColor}
            />
          )
        }
        if (this.state.mode === 1) {
          return (
            <Options
              options={this.state.options}
              saveOptions={this.saveOptions}
              setMode={this.setMode}
            />
          )
        } else if (this.state.mode === 2) {
          return (
            <Palettes
              palettes={this.state.palettes}
              loadPalette={this.loadPalette}
              deletePalette={this.deletePalette}
              setMode={this.setMode}
            />
          )
        }
      } else {
        return (
          <MiniPicker
            options={this.state.options}
            colors={this.state.colors}
            setPickerSize={this.props.setPickerSize}
            initDropper={this.initDropper}
            saveOptions={this.saveOptions}
          />
        )
      }
    } else {
      return <Dropper width={screenWidth} height={screenHeight} options={this.state.options} />
    }
  }
}
