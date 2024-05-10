import { Lobby } from "./lobby";
import { log_info } from "./helper/logger";
import { WebSocketServer } from "./net/ws-server";
import { NetworkListener, NetworkOptions } from "./network-listener";

export class Server
{
  private lobby?: Lobby;
  private websocket?: WebSocketServer;

  public constructor(opts: ServerOptions)
  {
    this.lobby = new Lobby(this);

    if (opts.network !== undefined)
    {
      const port = opts.network?.WebsocketPort;
      if (port !== undefined)
      {
        log_info(`WebSocket listen on port ${port}`);

        const lobby = this.lobby;
        this.websocket = new WebSocketServer(port, new NetworkListener( lobby ));
      }
    }
  }

  public async close()
  {
    if (this.websocket !== undefined)
    {
      this.websocket.close();
      this.websocket = undefined;
    }

    if (this.lobby !== undefined)
    {
      this.lobby.close();
      this.lobby = undefined;
    }
  }
}

export interface ServerOptions
{
  network?: NetworkOptions;
}



