import React from 'react'
import styled from 'styled-components'
import { remote, ipcRenderer } from 'electron'
import App from '../../App'
import { GlobalStyle, Inner } from './GlobalStyle'
import TitleBar from './TitleBar'
import windowDimens from 'common/windowDimens'
import miniDimens from 'common/miniDimens'

const id = remote.getCurrentWindow().id

const StyledPage = styled.div`
  height: 100vh;
  width: 100vw;
  color: ${props => props.theme.black};
  background: ${props => (id === 1 ? props.theme.offWhite : 'transparent')};
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
    this.setState({ fullSize: !mini })
    const win = remote.getCurrentWindow()
    if (mini) {
      const [w, h, x, y] = miniDimens()
      win.show()
      win.setSize(w, h)
      win.setPosition(x, y)
      win.setSkipTaskbar(true)
    } else {
      const [w, h, x, y] = windowDimens()
      win.show()
      win.setSize(w, h)
      win.setPosition(x, y)
      win.setSkipTaskbar(false)
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
