import { get, post, _delete } from '@/lin/plugins/axios'

class Specification {
  async getSpecList(page, size) {
    return get(`cms/spec/list?page=${page}&size=${size}`)
  }

  async getSpec(id) {
    return get(`cms/spec/${id}`)
  }

  async editSpec({ id, name, description, unit, standard }) {
    return post('cms/spec/edit', {
      id, name, description, unit, standard
    })
  }

  async deleteSpec(id) {
    return _delete(`cms/spec/${id}`)
  }

  async getSpecAttrList(specId) {
    return get(`cms/spec/attr/list?specId=${specId}`)
  }

  async getSpecAttr(id) {
    return get(`cms/spec/attr/${id}`)
  }

  async editSpecAttr({ id, specId, value, extend }) {
    return post('cms/spec/attr/edit', {
      id, specId, value, extend
    })
  }

  async deleteSpecAttr(id) {
    return _delete(`cms/spec/attr/${id}`)
  }
}

export default new Specification()
