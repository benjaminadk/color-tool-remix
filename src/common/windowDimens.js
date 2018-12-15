import { screen } from 'electron'

const inDev = process.env.NODE_ENV === 'development'

export default () => {
  const margin = 5
  const { width, height } = screen.getPrimaryDisplay().size
  let mainWidth = Math.round(width * 0.5)
  let mainHeight = inDev ? Math.round(height * 0.6) : Math.round(height * 0.6)
  let mainX = width - mainWidth - margin * 2
  let mainY = 0 + margin
  return [mainWidth, mainHeight, mainX, mainY]
}
