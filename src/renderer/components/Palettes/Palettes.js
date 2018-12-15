import React from 'react'
import styled from 'styled-components'
import Palette from './Palette'

const Container = styled.div`
  height: calc(100vh - 55px);
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: 0.5rem;
`

const List = styled.div`
  display: grid;
  grid-template-rows: 5px repeat(auto-fit, 30px);
`

const ListItem = styled.p`
  width: 170px;
  height: 30px;
  display: grid;
  align-items: center;
  font-size: 1.25rem;
  margin: 0;
  padding: 0rem 1rem;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
  background: ${props => (props.selected ? props.theme.black : 'transparent')};
  color: ${props => (props.selected ? 'white' : props.theme.black)};
`

const Display = styled.div`
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  p {
    width: 75%;
    font-family: 'Oswald';
    font-size: 3rem;
    text-align: center;
    margin: 0;
    padding: 0;
    background: white;
    border: ${props => props.theme.border};
  }
  .grid {
    display: grid;
  }
  button {
    width: 100px;
    background: white;
    border: ${props => props.theme.border};
    padding: 0.5rem 1rem;
    margin-right: 0.75rem;
    transition: all 0.25s;
    user-select: none;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
  }
`

const NoPalettes = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  justify-items: center;
  align-items: center;
  p {
    background: white;
    color: ${props => props.theme.black};
    font-size: 3rem;
    font-family: 'Oswald';
    padding: 1rem;
    margin: 0;
    border: ${props => props.theme.border};
  }
  button {
    width: 100px;
    background: white;
    color: ${props => props.theme.black};
    padding: 0.5rem 1rem;
    user-select: none;
    transition: all 0.25s;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
  }
`

export default class Palettes extends React.Component {
  state = {
    index: 0
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.palettes.length !== this.props.palettes.length) {
      this.setState({ index: 0 })
    }
  }

  handleDelete = (i, name) => {
    this.setState({ index: 0 }, () => {
      this.props.deletePalette(i, name)
    })
  }

  setIndex = index => this.setState({ index })

  render() {
    const { index } = this.state
    const { palettes } = this.props
    if (!palettes.length) {
      return (
        <NoPalettes>
          <p>No Saved Palettes</p>
          <button onClick={() => this.props.setMode(0)}>Back</button>
        </NoPalettes>
      )
    } else {
      const { name, colors } = palettes[index]
      return (
        <Container>
          <List>
            <span />
            {palettes.map((p, i) => (
              <ListItem key={p.name} selected={index === i} onClick={() => this.setIndex(i)}>
                {p.name}
              </ListItem>
            ))}
          </List>
          <Display>
            <p>{name}</p>
            <div className="grid">
              <Palette colors={colors} onSwatchClick={() => {}} onContextMenu={() => {}} />
            </div>

            <div>
              <button onClick={() => this.props.loadPalette(palettes[index])}>Load Palette</button>
              <button onClick={() => this.handleDelete(index, name)}>Delete Palette</button>
              <button onClick={() => this.props.setMode(0)}>Back</button>
            </div>
          </Display>
        </Container>
      )
    }
  }
}
