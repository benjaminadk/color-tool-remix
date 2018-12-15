export default color => {
  var hsl, h, s, l, a, bool
  hsl = color.replace(/[^\d,]/g, '').split(',')
  bool = hsl.length > 3
  h = parseInt(hsl[0], 10)
  s = parseInt(hsl[1], 10)
  l = parseInt(hsl[2], 10)
  a = bool ? parseInt(hsl[3], 10) : 100
  return [bool, h, s, l, a]
}
