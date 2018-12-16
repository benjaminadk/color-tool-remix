import React from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { DragHandle, Close, Remove } from 'styled-icons/material'
import getStaticFile from 'common/getStaticFile'

const TitleBarStyles = styled.div`
  -webkit-app-region: drag;
  height: ${props => props.height}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
  background: ${props => props.theme.accentColor};
  color: ${props => props.theme.accentText};
  font-size: ${props => props.theme.smallerFontSize};
  cursor: move;
  .left {
    display: flex;
    align-items: center;
    -webkit-margin-after: 0;
    -webkit-margin-before: 0;
    padding: 0 1rem;
    color: ${props => props.theme.accentText};
    font-size: ${props => props.theme.smallerFontSize};
    & > * {
      margin-right: 0.5rem;
    }
  }
  .right {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    -webkit-app-region: no-drag;
    cursor: pointer;
    .min,
    .close {
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .close:hover {
      background: #d53939;
    }
  }
`

export default class TitleBar extends React.Component {
  renderTitle = () => {
    const name = 'Color Tool'
    const version = remote.app.getVersion()
    return `${name}  @  ${version} ${this.props.showPin ? '📌' : ''} `
  }

  onCloseClick = () => remote.getCurrentWindow().close()

  onMinimizeClick = () => remote.getCurrentWindow().minimize()

  render() {
    if (!!this.props.dropperMode) return null
    if (remote.getCurrentWindow().id !== 1) return null
    if (!this.props.fullSize)
      return (
        <TitleBarStyles height={25}>
          <DragHandle size={20} color="#FFFFFF" />
          <div>{this.props.showPin ? '📌' : ''}</div>
        </TitleBarStyles>
      )
    return (
      <TitleBarStyles height={35}>
        <div className="left">
          <img src="https://s3-us-west-1.amazonaws.com/benjaminadk/picker-icon-4.png" width="15" />
          {/* <DragHandle size={20} color="#FFFFFF" /> */}
          <div>{this.renderTitle()}</div>
        </div>
        <div className="right">
          <div className="min" onClick={this.onMinimizeClick}>
            <Remove size={20} color="#FFFFFF" />
          </div>
          <div className="close" onClick={this.onCloseClick}>
            <Close size={20} color="#FFFFFF" />
          </div>
        </div>
      </TitleBarStyles>
    )
  }
}
