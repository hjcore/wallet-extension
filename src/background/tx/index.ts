import { MessageServer } from 'src/services/message/server'
import { TX_PORT } from 'src/services/tx'

import { handlers } from './handlers'

export function initTxServer() {
  const server = new MessageServer(TX_PORT, handlers)

  server.listen()
}
