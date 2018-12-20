# Color Tool Remix

An HSL color picker, dropper, color analyzer and palette generator. The do it all color tool.

🧐 Looking for a contributor to help testing on `macOS`.

[![GitHub release](https://img.shields.io/github/release/benjaminadk/color-tool-remix.svg?style=flat-square)](https://github.com/benjaminadk/color-tool-remix/releases) [![Github All Releases](https://img.shields.io/github/downloads/benjaminadk/color-tool-remix/total.svg?style=flat-square)](https://github.com/benjaminadk/color-tool-remix/releases)

![Platform](https://img.shields.io/badge/platform-windows-lightgrey.svg?style=flat-square) ![AppVeyor](https://img.shields.io/appveyor/ci/benjaminadk/color-tool-remix.svg?style=flat-square) ![Platform](https://img.shields.io/badge/platform-osx-lightgrey.svg?style=flat-square) ![Travis](https://img.shields.io/travis/benjaminadk/color-tool-remix.svg?style=flat-square)

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-1.gif" width='500' />

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Picker](#picker)
  - [Dropper](#dropper)
  - [Palettes](#palettes)
  - [Generator](#generator)
  - [Project Mode](#project-mode)
  - [User Interface](#user-interface)
  - [Options](#options)
- [Tech Stack](#tech-stack)
- [Changelog](#changelog)
- [Contributors](#contributors)
- [Donate](#donate)

### Installation

[**Latest Release**](https://github.com/benjaminadk/color-tool-remix/releases/latest)

|  Platform   | Auto Updates |                 Exexutable                  |
| :---------: | :----------: | :-----------------------------------------: |
| **Windows** |     yes      | `electron-picker-remix-setup-[VERSION].exe` |
|  **macOS**  |      no      | `electron-picker-remix-setup-[VERSION].dmg` |
|  **Linux**  |     N/A      |                     N/A                     |

_System warnings are normal due to lack of Code Signing_

### Usage

#### Picker

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-1.gif" width='500' />

_Create a color quickly, via a variety of input methods_

#### Dropper

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-3.gif" width='500' />

_Select a single pixel from anywhere on your screen_

#### Palettes

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-4.gif" width="500" />

_Create, name, save and manage palettes for different projects_

#### Generator

Generate colors based on color theory

- _*Complementary*_

- _*Split Complementary*_

- _*Triad*_

- _*Tetrad*_

- _*Analagous*_

- _*Monochromatic*_

#### Project Mode

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-6.gif" width="500" />

_A minimal interface, ideal size for working on projects_

#### Analyzer

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-5.gif" width="500" />

_Capture the entire color theme of a website, application or photo_

#### User Interface

<img src="https://s3-us-west-1.amazonaws.com/color-tool-remix/color-tool-chart.png" width='500' />

---

1. Hue, Saturation, Lightness & Opacity Color Bars
2. Active Palette
3. Hue, Saturation, Lightness & Opacity Value Inputs
4. Selected Color
5. Color String Outputs in HSL, RGB, HEX formats
6. Palette Name Input
7. Add Color to Palette
8. Switch to Dropper Mode
9. Open Color String Parser
10. Generate Random Color
11. Switch to Project Mode
12. Open Options
13. Save Active Palette to disk
14. View Saved Palettes
15. Clear Active Palette
16. Open Documentation

---

#### Options

|         Option         |           Description            |  Type   | Default |
| :--------------------: | :------------------------------: | :-----: | :-----: |
|       Alpha Mode       | Toggle alpha component in color  | Boolean | `false` |
|     Always On Top      |     Pin app to top of window     | Boolean | `false` |
|     Palette Format     | Color string format in Palettes  | String  | `'hsl'` |
|   Dropper Hightlight   |    Highlight color in Dropper    | String  | `'red'` |
| Dropper Analyzer Count | # of colors returned by Analyzer | Number  |   `8`   |

### Tech Stack

|       Package       |                       Description                       |                    Link                    |
| :-----------------: | :-----------------------------------------------------: | :----------------------------------------: |
|     `electron`      | Build cross platform apps with JavaScript, HTML and CSS |      [Docs](https://electronjs.org/)       |
| `electron-webpack`  |           Compile Electron code with Webpack            |  [Docs](https://webpack.electron.build/)   |
| `electron-builder`  |    Package and build Electron apps for distribution     |    [Docs](https://www.electron.build/)     |
|       `react`       |     JavaScript library for building user interfaces     |        [Docs](https://reactjs.org/)        |
|     `react-dom`     |         React package for working with the DOM          | [Repo](https://github.com/facebook/react)  |
| `styled-components` |         Visual primitives for the component age         | [Docs](https://www.styled-components.com/) |

### Changelog

Keep up with new features and changes in the [**Changelog**](https://github.com/benjaminadk/color-tool-remix/blob/master/CHANGELOG.md)

### Contributors

|                                [**benjaminadk**](https://github.com/benjaminadk)                                |
| :-------------------------------------------------------------------------------------------------------------: |
| [<img src="https://avatars2.githubusercontent.com/u/28043421?s=80" width="80">](https://github.com/benjaminadk) |

### Donate

_For those who would like to show their appreciation the hours of work going into this free app_

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=H5FBFKUNGF9S2)
