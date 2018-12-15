import { remote } from 'electron'
import path from 'path'

export default filename => path.join(remote.app.getPath('userData'), filename)
