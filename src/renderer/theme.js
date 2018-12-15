import { remote } from 'electron'
import getContrastColor from './lib/getContrastColor'

let accentColor, accentText
if (process.platform === 'win32') {
  accentColor = '#' + remote.systemPreferences.getAccentColor().substr(0, 6)
  accentText = getContrastColor(accentColor)
} else {
  accentColor = '#333333'
  accentText = getContrastColor(accentColor)
}

export default {
  barWidth: '360px',
  barHeight: '16px',
  thumbWidth: '10px',
  swatchWidth: `150px`,
  swatchHeight: '75px',
  paletteSize: '240px',
  paletteItemSize: `${240 * 0.125}px`,
  miniPickerWidth: '50px',
  inputWidth: '25px',
  dropperWidth: '145px',
  dropperHeight: '250px',
  accentColor,
  accentText,
  black: '#333333',
  white: '#eeeeee',
  grey: '#dedede',
  border: '1px outset rgb(206, 206, 206)',
  hoverBorder: '2px outset rgb(206, 206, 206)',
  smallFontSize: '1.5rem',
  smallerFontSize: '1.25rem',
  smallFontPadding: '0 1rem',
  iconSize: '20px'
}
