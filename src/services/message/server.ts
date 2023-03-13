import browser from 'webextension-polyfill'

import { Message } from './message'

function checkIsInternalMessage(
  sender: browser.Runtime.MessageSender,
  extensionId: string,
  extensionUrl: string
): boolean {
  if (!sender.url) {
    throw new Error('Empty sender url')
  }
  const url = new URL(sender.url)

  if (!url.origin || url.origin === 'null') {
    throw new Error('Invalid sender url')
  }

  const browserURL = new URL(extensionUrl)

  if (!browserURL.origin || browserURL.origin === 'null') {
    throw new Error('Invalid browser url')
  }

  if (url.origin !== browserURL.origin) {
    return false
  }

  return sender.id === extensionId
}

interface MsgData extends Message {
  port: string
}

export class MessageServer<T = any> {
  public port: string

  protected handlers: any

  constructor(port: string, handlers: T) {
    this.port = port
    this.handlers = handlers
  }

  listen() {
    browser.runtime.onMessage.addListener(this.onMessage)
  }

  protected onMessage = (
    msg: MsgData,
    sender: browser.Runtime.MessageSender
  ) => {
    const isInternalMsg = checkIsInternalMessage(
      sender,
      browser.runtime.id,
      browser.runtime.getURL('/')
    )

    if (!isInternalMsg || msg.port !== this.port || !this.handlers[msg.type])
      return
    try {
      this.handlers[msg.type](msg.body)
    } catch (e: any) {
      console.log(
        `Failed to process msg ${msg.type}: ${e?.message || e?.toString()}`
      )
    }
  }

  unlisten() {
    browser.runtime.onMessage.removeListener(this.onMessage)
  }
}
