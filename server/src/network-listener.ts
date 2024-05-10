import { dispatchPacket } from "./packet";
import { IWebSocketListener, IWebsocketConnection } from "./net/ws";
import { Remote } from "./remote"
import { Lobby } from "./lobby";
import { log_err } from "./helper/logger";

export class NetworkListener implements IWebSocketListener
{
  private lobby: Lobby;

  public constructor(lobby: Lobby )
  {
    this.lobby = lobby;
  }

  public onServerError(err: Error)
  {
    log_err(`Websocket Server Error: ${err.name} ${err.message}`);
  }

  public async onError(conn: IWebsocketConnection, err: Error)
  {
    log_err(`Websocket connection Error: ${err.name} ${err.message}`);
  }

  public async onConnected(conn: IWebsocketConnection)
  {
    const lobby = this.lobby;
    const remote = new Remote(conn, lobby);
    conn.setUserData(remote);
    remote.onConnected();
  }

  public async onDisconnected(conn: IWebsocketConnection)
  {
    const remote: Remote = conn.getUserData();
    if (remote !== undefined)
    {
      conn.setUserData(undefined);
      remote.onDisconnected();
      remote.close();
    }
  }

  public async onReceived(conn: IWebsocketConnection, message: string)
  {
    const remote: Remote = conn.getUserData();
    if (remote !== undefined)
    {
      if (!await dispatchPacket(remote, message))
      {
        log_err(`dispatchPacket Error: ${message}`);
        remote.disconnect();
      }
      return;
    }
    conn.close();
  }
}

export interface NetworkOptions
{
  WebsocketPort: number;
}



