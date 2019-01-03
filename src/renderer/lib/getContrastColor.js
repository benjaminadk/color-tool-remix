import getHSLParts from './getHSLParts'

export default color => {
  const [_, h, s, l, a] = getHSLParts(color)
  if (h >= 45 && h <= 180 && l >= 50) {
    return '#333'
  } else if (l >= 55) {
    return '#333'
  } else {
    return '#EEE'
  }
}
