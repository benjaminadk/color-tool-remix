import React from 'react'
import styled from 'styled-components'
import { remote, ipcRenderer } from 'electron'
import App from '../../App'
import { GlobalStyle, Inner } from './GlobalStyle'
import TitleBar from './TitleBar'
import windowDimens from 'common/windowDimens'
import miniDimens from 'common/miniDimens'
import Picker from '../Picker/Picker'

const id = remote.getCurrentWindow().id
let mainWin = remote.BrowserWindow.fromId(1)

const StyledPage = styled.div`
  height: 100vh;
  width: 100vw;
  color: ${props => props.theme.black};
  background: ${props => (id === 1 ? props.theme.white : 'transparent')};
`

export default class Page extends React.Component {
  state = {
    fullSize: true,
    dropperMode: false,
    showPin: false
  }

  componentDidMount() {
    ipcRenderer.on('picker.restore', () => {
      console.log('renderer recieved picker.restore')
      this.setPickerSize(!this.state.fullSize)
    })

    ipcRenderer.on('picker.focus', () => {
      console.log('renderer recieved picker.focus')
      this.setPickerSize(!this.state.fullSize)
    })
  }

  setPickerSize = mini => {
    const win = remote.getCurrentWindow()
    if (mini) {
      const [w, h, x, y] = miniDimens()
      win.setSize(w, h)
      win.setPosition(x, y)
      win.setSkipTaskbar(true)
      this.setState({ fullSize: false })
    } else {
      const [w, h, x, y] = windowDimens()
      win.setSize(w, h)
      win.setPosition(x, y)
      win.setSkipTaskbar(false)
      this.setState({ fullSize: true })
    }
  }

  setShowPin = showPin => this.setState({ showPin })

  setDropperMode = dropperMode => this.setState({ dropperMode })

  render() {
    return (
      <StyledPage>
        <GlobalStyle />
        <TitleBar
          fullSize={this.state.fullSize}
          showPin={this.state.showPin}
          dropperMode={this.state.dropperMode}
        />
        <Inner>
          <App
            fullSize={this.state.fullSize}
            setShowPin={this.setShowPin}
            setPickerSize={this.setPickerSize}
            setDropperMode={this.setDropperMode}
          />
        </Inner>
      </StyledPage>
    )
  }
}
