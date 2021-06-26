import { EventEmitter } from 'events'
import Pusher, {Channel} from 'pusher-js/react-native'

Pusher.logToConsole = true;

export interface ZootManager {
  userId: string
  Pusher: Pusher
  channel: Channel

  on(event: 'state_change', listener: (state: string) => void): this;
  on(event: 'movement', listener: (movement: Movement) => void): this;
}

export class ZootManager extends EventEmitter {
  constructor(userId: string) {
    super()
    this.userId = userId
  }

  listenForMovements() {
    console.log('now listening for movements')
    this.Pusher = new Pusher('bc53c55476f96f1a110b', {cluster: 'us2'})
    this.channel = this.Pusher.subscribe('zoot-staging')
    this.channel.bind('movement', (data: Movement) => {
      console.log('binded movement event')
      this.emit('movement', data)
    })

    this.Pusher.connection.bind('state_change', (states: any) => {
      this.emit('state_change', states.current)
    })
  }

  async move(x: number, y: number) {
    const res = await fetch('https://zoot-api.bruhaustin.repl.co/v1/move', { method: 'POST', body: JSON.stringify({userId: this.userId, x, y})})
    const json = await res.json()
    console.log(json)
  }
}

export interface Movement {
  userId: string,
  movementId: string,
  x: number,
  y: number
}