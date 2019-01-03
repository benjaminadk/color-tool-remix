import React from 'react'
import { remote, desktopCapturer } from 'electron'
import styled from 'styled-components'
import rgbToHsl from 'rgb-to-hsl'
import constants from '../../lib/constants'
import getHSLParts from '../../lib/getHSLParts'
import getHSLString from '../../lib/getHSLString'
import IconBar from './IconBar'
import CanvasStack from './CanvasStack'
import DropperColor from './DropperColor'

const { videoCSS, canvasSize } = constants

const Container = styled.div`
  overflow: hidden !important;
  cursor: crosshair;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  .dropper-ui {
    width: ${props => props.theme.dropperWidth};
    height: ${props => props.theme.dropperHeight};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 3rem 3rem 0 0;
    background: ${props => props.theme.offWhite};
    outline: ${props => props.theme.border};
    opacity: ${props => (props.loading ? 0 : 1)};
  }
`

export default class Dropper extends React.Component {
  state = {
    loading: true,
    frozen: false,
    context: null,
    color: false,
    boxIndex: null,
    x: null,
    y: null,
    message: 'Loading...'
  }

  c1 = React.createRef()
  c2 = React.createRef()
  top = React.createRef()

  componentDidMount() {
    this._mounted = true
    this.initCanvas()
    this.captureScreen()
    this.drawGrid()
  }

  componentWillUnmount() {
    this._mounted = false
    this.top.current.removeEventListener('click', this.selectPixelClick)
    document.body.removeEventListener('keydown', this.changeBoxIndex)
  }

  initCanvas = () => {
    this.c0 = document.createElement('canvas')
    this.ctx0 = this.c0.getContext('2d')
    this.c3 = document.createElement('canvas')
    this.ctx3 = this.c3.getContext('2d')
    this.ctx1 = this.c1.current.getContext('2d')
    this.ctx1.scale(10, 10)
    this.ctx1.imageSmoothingEnabled = false
  }

  captureScreen = () => {
    const { width, height } = this.props
    desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
      if (error) console.log(error)
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[0].id,
              minWidth: width,
              maxWidth: width,
              minHeight: height,
              maxHeight: height
            }
          }
        })
        .then(stream => {
          this.video = document.createElement('video')
          this.video.style.cssText = videoCSS

          this.video.onloadedmetadata = () => {
            this.c0.width = this.video.videoWidth
            this.c0.height = this.video.videoHeight
            this.ctx0.drawImage(this.video, 0, 0, this.c0.width, this.c0.height)
            if (this._mounted) {
              this.setState({
                loading: false,
                frozen: false,
                boxIndex: null,
                message: 'Click Anywhere'
              })
            }
            stream.getTracks()[0].stop()
            this.video.remove()
          }

          this.video.srcObject = stream
          document.body.appendChild(this.video)
        })
        .catch(console.error)
    })
  }

  analyzePixels = () => {
    this.setState({ message: 'Analyzing...' })
    var arr = []
    var obj = {}
    var hsl, hsl2, str
    const p = this.ctx0.getImageData(0, 0, this.c0.width, this.c0.height).data
    for (let i = 0; i < p.length; i += 4) {
      hsl = rgbToHsl(p[i], p[i + 1], p[i + 2])
      hsl2 = `hsl(${parseInt(hsl[0], 10)}, ${parseInt(hsl[1], 10)},${parseInt(hsl[2], 10)})`
      const [bool, h, s, l, a] = getHSLParts(hsl2)
      if (s > 25 && l > 25 && l < 90) {
        str = getHSLString(
          false,
          Math.round(h / 2) * 2,
          Math.round(s / 5) * 5,
          Math.round(l / 5) * 5
        )
        arr.push(str)
      }
    }
    arr.forEach(a => {
      if (obj[a]) obj[a]++
      else obj[a] = 1
    })
    const sortable = []
    for (var color in obj) {
      sortable.push([color, obj[color]])
    }
    const top = sortable
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.props.options.dropperAnalyzerCount)

    remote.BrowserWindow.fromId(1).webContents.send('dropper.analyzer', top)
    remote.getCurrentWindow().close()
  }

  drawGrid = () => {
    this.ctx2 = this.c2.current.getContext('2d')
    for (let i = 0; i <= canvasSize; i += 10) {
      this.ctx2.moveTo(i, 0)
      this.ctx2.lineTo(i, canvasSize)
    }
    for (let i = 0; i <= canvasSize; i += 10) {
      this.ctx2.moveTo(0, i)
      this.ctx2.lineTo(canvasSize, i)
    }
    this.ctx2.strokeStyle = 'rgba(0,0,0,.5)'
    this.ctx2.stroke()
  }

  onMainClick = e => {
    if (this.state.loading) return
    this.setState({ frozen: true, message: 'Select Pixel' })
    this.top.current.addEventListener('click', this.selectPixelClick)
    document.body.addEventListener('keydown', this.changeBoxIndex)
  }

  selectPixelClick = e => {
    const x = Math.ceil(e.layerX / 10)
    const y = Math.ceil(e.layerY / 10)
    const p = this.ctx3.getImageData(x - 1, y - 1, 1, 1).data
    const a = (p[3] / 255).toFixed(2)
    this.setState({ color: this.getColorString(p, a) })
  }

  selectPixelMove = () => {
    const { boxIndex } = this.state
    if (!boxIndex) return
    let x = Math.ceil(document.querySelector(`[data-index='${boxIndex}']`).offsetLeft / 10)
    let y = Math.ceil(document.querySelector(`[data-index='${boxIndex}']`).offsetTop / 10)
    let p = this.ctx3.getImageData(x, y, 1, 1).data
    let a = (p[3] / 255).toFixed(2)
    this.setState({ color: this.getColorString(p, a) })
  }

  handleMouseMoveMain = e => {
    const { loading, frozen } = this.state
    if (loading || frozen) return
    const x = e.screenX - 5
    const y = e.screenY - 5
    const imageData = this.ctx0.getImageData(x, y, 10, 10)
    this.ctx3.putImageData(imageData, 0, 0)
    this.ctx1.drawImage(this.c3, 0, 0)
    this.setState({ x, y })
  }

  getColorString = (p, alpha) =>
    alpha === '1.00' ? `rgb(${p[0]}, ${p[1]}, ${p[2]})` : `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${a})`

  shiftCanvasLeft = () => {
    const { x, y } = this.state
    if (x === 0) return
    const imageData = this.ctx0.getImageData(x - 1, y, 10, 10)
    this.ctx3.putImageData(imageData, 0, 0)
    this.ctx1.drawImage(this.c3, 0, 0)
    this.selectPixelMove()
    this.setState({ x: x - 1 })
  }

  shiftCanvasRight = () => {
    const { x, y } = this.state
    const { width } = this.props
    if (x === width - 10) return
    const imageData = this.ctx0.getImageData(x + 1, y, 10, 10)
    this.ctx3.putImageData(imageData, 0, 0)
    this.ctx1.drawImage(this.c3, 0, 0)
    this.selectPixelMove()
    this.setState({ x: x + 1 })
  }

  shiftCanvasUp = () => {
    const { x, y } = this.state
    if (y === 0) return
    const imageData = this.ctx0.getImageData(x, y - 1, 10, 10)
    this.ctx3.putImageData(imageData, 0, 0)
    this.ctx1.drawImage(this.c3, 0, 0)
    this.selectPixelMove()
    this.setState({ y: y - 1 })
  }

  shiftCanvasDown = () => {
    const { x, y } = this.state
    const { height } = this.props
    if (y === height - 10) return
    const imageData = this.ctx0.getImageData(x, y + 1, 10, 10)
    this.ctx3.putImageData(imageData, 0, 0)
    this.ctx1.drawImage(this.c3, 0, 0)
    this.selectPixelMove()
    this.setState({ y: y + 1 })
  }

  setBoxIndex = boxIndex => {
    if (!this.state.frozen) return
    this.setState({ boxIndex })
  }

  changeBoxIndex = e => {
    const { boxIndex, color } = this.state
    if (boxIndex === null) return
    if (e.keyCode === 13 && color) return this.selectColor()
    const keys = [37, 38, 39, 40]
    const key = e.keyCode
    if (keys.indexOf(key) === -1) return
    if (key === 37) {
      if (boxIndex % 10 === 0) {
        return this.shiftCanvasLeft()
      }
      this.setState({ boxIndex: boxIndex - 1 })
    } else if (key === 38) {
      if (boxIndex < 10) {
        return this.shiftCanvasUp()
      }
      this.setState({ boxIndex: boxIndex - 10 })
    } else if (key === 39) {
      if ((boxIndex + 1) % 10 === 0) {
        return this.shiftCanvasRight()
      }
      this.setState({ boxIndex: boxIndex + 1 })
    } else if (key === 40) {
      if (boxIndex > 89) {
        return this.shiftCanvasDown()
      }
      this.setState({ boxIndex: boxIndex + 10 })
    }
    this.selectPixelMove()
  }

  selectColor = () => {
    const { color } = this.state
    remote.BrowserWindow.fromId(1).webContents.send('dropper.color', color)
    remote.getCurrentWindow().close()
  }

  refresh = () => {
    this.setState({ loading: true })
    this.ctx0.clearRect(0, 0, this.c0.width, this.c0.height)
    this.ctx1.clearRect(0, 0, canvasSize, canvasSize)
    this.top.current.removeEventListener('click', this.selectPixelClick)
    document.body.removeEventListener('keydown', this.changeBoxIndex)
    this.captureScreen()
  }

  exit = () => {
    remote.BrowserWindow.fromId(1).webContents.send('dropper.close', false)
    remote.getCurrentWindow().close()
  }

  render() {
    return (
      <Container
        loading={this.state.loading}
        onClick={this.onMainClick}
        onMouseMove={this.handleMouseMoveMain}
        style={{ width: this.props.width, height: this.props.height }}
      >
        <div className="dropper-ui">
          <IconBar
            options={this.props.options}
            selectColor={this.selectColor}
            analyzePixels={this.analyzePixels}
            refresh={this.refresh}
            exit={this.exit}
          />
          <CanvasStack
            c1Ref={this.c1}
            c2Ref={this.c2}
            topRef={this.top}
            boxIndex={this.state.boxIndex}
            width={canvasSize}
            height={canvasSize}
            options={this.props.options}
            setBoxIndex={this.setBoxIndex}
            shiftCanvasUp={this.shiftCanvasUp}
            shiftCanvasRight={this.shiftCanvasRight}
            shiftCanvasDown={this.shiftCanvasDown}
            shiftCanvasLeft={this.shiftCanvasLeft}
          />
          <DropperColor color={this.state.color} message={this.state.message} />
        </div>
      </Container>
    )
  }
}
