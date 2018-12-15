export default (withAlpha, h, s, l, a) => {
  if (withAlpha) {
    return `hsla(${h},${s}%,${l}%,${(a * 0.01).toFixed(2)})`
  } else {
    return `hsl(${h},${s}%,${l}%)`
  }
}
