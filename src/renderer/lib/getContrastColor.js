import getHSLParts from './getHSLParts'

export default color => {
  const [_, h, s, l, a] = getHSLParts(color)
  return l >= 55 ? '#333333' : '#EEEEEE'
}
