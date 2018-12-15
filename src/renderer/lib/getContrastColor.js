import getHSLParts from './getHSLParts'

export default color => {
  const [_, h, s, l, a] = getHSLParts(color)
  return l >= 50 ? '#000000' : '#FFFFFF'
}
