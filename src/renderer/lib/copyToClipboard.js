import { clipboard } from 'electron'

export default text => {
  clipboard.writeText(text)
}
