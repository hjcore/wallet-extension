export interface Message<MessageBody = any, MessageType = string> {
  type: MessageType

  body?: MessageBody
}
