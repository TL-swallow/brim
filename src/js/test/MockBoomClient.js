/* @flow */

import {BoomClient, Handler} from "boom-js-client"

export default function MockBoomClient() {
  BoomClient.call(this)
  return this
}

MockBoomClient.prototype = Object.create(BoomClient.prototype)
MockBoomClient.prototype.constructor = MockBoomClient

MockBoomClient.prototype.stubPromise = function(method: string, returnVal: *) {
  const stub = () => new Promise(r => r(returnVal))
  const props = method.split(".")

  let parent = this
  for (let i = 0; i < props.length; i++) {
    if (!parent[props[i]])
      throw new Error(`${method} does not exist on BoomClient`)

    if (i < props.length - 1) {
      parent = parent[props[i]]
    } else {
      parent[props[i]] = stub
    }
  }

  return this
}

MockBoomClient.prototype.stubPromiseError = function(method: string, error: *) {
  const stub = () => new Promise((_, r) => r(error))

  const props = method.split(".")
  let parent = this
  for (let i = 0; i < props.length; i++) {
    if (!parent[props[i]])
      throw new Error(`${method} does not exist on BoomClient`)

    if (i < props.length - 1) {
      parent = parent[props[i]]
    } else {
      parent[props[i]] = stub
    }
  }

  return this
}

MockBoomClient.prototype.stubStream = function(method: string, returnVal: *) {
  const handler = new Handler(() => {})
  const stub = () => {
    setTimeout(() => handler.onDone(returnVal), 0)
    return handler
  }

  const props = method.split(".")
  let parent = this
  for (let i = 0; i < props.length; i++) {
    if (!parent[props[i]])
      throw new Error(`${method} does not exist on BoomClient`)

    if (i < props.length - 1) {
      parent = parent[props[i]]
    } else {
      parent[props[i]] = stub
    }
  }

  return this
}

MockBoomClient.prototype.send = () => {
  throw new Error(`
Http Requests are disabled in tests.
Use #stubStream(method, val) or #stubPromise(method, val)
to mock the server response.`)
}