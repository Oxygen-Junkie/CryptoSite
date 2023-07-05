import VueUploadComponent from 'vue-upload-component'
import { type UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.component('FileUpload', VueUploadComponent)
}
