import browser from 'webextension-polyfill'

import { Message } from './message'

export class MessageRequester<MessageType = string> {
  public port: string

  constructor(port: string) {
    this.port = port
  }

  async sendMessage<MessageBody>(msg: Message<MessageBody, MessageType>) {
    return browser.runtime.sendMessage({
      port: this.port,
      ...msg,
    })
  }
}
