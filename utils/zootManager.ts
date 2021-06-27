  import { EventEmitter } from 'events'
import Pusher, {Channel} from 'pusher-js/react-native'

Pusher.logToConsole = true;

export interface ZootManager {
  userId: string
  name: string
  Pusher: Pusher
  channel: Channel
  ZootWS: WebSocket

  on(event: 'state_change', listener: (state: string) => void): this;
  on(event: 'movement', listener: (movement: Movement) => void): this;
}

export class ZootManager extends EventEmitter {
  constructor(userId: string) {
    super()
    this.userId = userId
    this.name = ""
  }

  listenForMovements() {
    console.log('now listening for movements')
    this.ZootWS = new WebSocket('wss://zoot-ws.bruhaustin.repl.co/')
    this.Pusher = new Pusher('bc53c55476f96f1a110b', {cluster: 'us2'})
    this.channel = this.Pusher.subscribe('zoot-staging')
    this.channel.bind('movement', (data: Movement) => {
      this.emit('movement', data)
    })

    this.Pusher.connection.bind('state_change', (states: any) => {
      this.emit('state_change', states.current)
    })

    setInterval(() => {
      this.ZootWS.send(JSON.stringify({type: 'HB'}))
    }, 2000)
  }

  async move(type: 'drag' | 'start' | 'end', x: number, y: number) {
    this.ZootWS.send(JSON.stringify({type: 'MOVEMENT', data: {type: type, userId: this.userId, name: this.name, x: x, y: y}}))
  }
}

export interface Movement {
  type: 'drag' | 'start' | 'end'
  userId: string,
  movementId: string,
  name: string,
  x: number,
  y: number
}