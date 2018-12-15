const toHex = c => {
  const n = c.toString(16)
  return n.length == 1 ? '0' + n.toUpperCase() : n.toUpperCase()
}

export default (rgb, h, s, l, a) => {
  var r, g, b
  var h = h / 360
  var s = s / 100
  var l = l / 100

  if (s == 0) {
    r = g = b = l
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  let red = Math.round(r * 255)
  let green = Math.round(g * 255)
  let blue = Math.round(b * 255)

  if (a) {
    let alpha = a * 0.01
    return rgb
      ? `rgba(${red},${green},${blue},${alpha.toFixed(2)})`
      : `#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(Math.round(alpha * 255))}`
  } else {
    return rgb ? `rgb(${red},${green},${blue})` : `#${toHex(red)}${toHex(green)}${toHex(blue)}`
  }
}
