import { screen } from 'electron'

const inDev = process.env.NODE_ENV === 'development'

export default () => {
  const margin = 5
  const { width, height } = screen.getPrimaryDisplay().size
  let mainWidth = 50
  let mainHeight = 500
  let mainX = width - mainWidth - margin * 4
  let mainY = 0 + margin
  return [mainWidth, mainHeight, mainX, mainY]
}
