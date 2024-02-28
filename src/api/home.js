import { request } from "@/utils/request"

export const create = (id) => {
  return request.post('/createClipboard', { id })
}