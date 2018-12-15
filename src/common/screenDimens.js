import { screen } from 'electron'

export default () => {
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds
  return [width, height, x, y]
}
