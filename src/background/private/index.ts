import { MessageServer } from 'src/services/message/server'
import { PRIVATE_PORT } from 'src/services/private'

import { handlers } from './handlers'

export function initPrivateServer() {
  const server = new MessageServer(PRIVATE_PORT, handlers)

  server.listen()
}
