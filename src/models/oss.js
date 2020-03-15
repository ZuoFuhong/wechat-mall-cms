import moment from 'moment'
import { get, post } from '@/lin/plugins/axios'
import util from '@/lin/utils/util'

export default class Oss {
  static async uploadFileToOSS(_file, dir) {
    const policyToken = await this.getPolicyToken(dir)
    const date = moment().format('YYYY/MM/DD')
    // eslint-disable-next-line
    const filename = date + '/' + util.uuid() + '.' + _file.name.split('.')[1]
    // eslint-disable-next-line
    const _key = dir + filename
    const postData = {
      name: filename,
      key: _key,
      policy: policyToken.policy,
      OSSAccessKeyId: policyToken.accessid,
      success_action_status: 200,
      callback: policyToken.callback,
      signature: policyToken.signature,
      file: _file,
    }
    await post(policyToken.host, postData)
    return {
      path: filename,
      url: `${policyToken.host}/${dir}${filename}`,
    }
  }

  static async getPolicyToken(dir) {
    return get(`cms/oss/policy-token?dir=${dir}`)
  }
}
