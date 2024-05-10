/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ws from 'ws';
import * as net from 'net';
import { IWebSocketListener, IWebsocketConnection } from './ws';

export class WebsocketConnection implements IWebsocketConnection
{
  private socket: ws;
  private ud: any;
  private connection?: net.Socket;
  private closed:boolean;

  public constructor(socket: any, listener: IWebSocketListener, connection: net.Socket)
  {
    this.socket = socket;
    this.connection = connection;
    this.closed = false;

    this.socket.on("error", async (err: Error) => {
      await listener.onError(this, err);
      this.closed = true;
    });

    this.socket.on("message", async (message: Buffer) => {
      await listener.onReceived(this, message.toString());
    });

    this.socket.on("close", async () => {
      await listener.onDisconnected(this);
      this.close();
    });
  }

  public setUserData(ud: any)
  {
    this.ud = ud;
  }

  public getUserData(): any
  {
    return this.ud;
  }

  public send(data: string)
  {
    /* istanbul ignore if */
    if (this.socket.readyState !== ws.OPEN) return;

    this.socket.send(data);
  }

  public close()
  {
    if (this.closed) return;
    this.socket.close();
    this.closed = true;
  }

  public getRemoteName(): string|undefined
  {
    return `${this.getRemoteAddress()}:${this.getRemotePort()}`;
  }

  public getRemoteAddress(): string|undefined
  {
    return this.connection?.remoteAddress;
  }

  public getRemotePort(): number|undefined
  {
    return this.connection?.remotePort;
  }

  public getLocalName(): string|undefined
  {
    return `${this.getLocalAddress()}:${this.getLocalPort()}`;
  }

  public getLocalAddress(): string|undefined
  {
    return this.connection?.localAddress;
  }

  public getLocalPort(): number|undefined
  {
    return this.connection?.localPort;
  }
}

export class WebSocketServer
{
  private server: ws.Server;

  public constructor(port: number, listener: IWebSocketListener)
  {
    this.server = new ws.Server({ port });
    this.server.on('connection', async (client, request) => {
      await listener.onConnected(new WebsocketConnection(client, listener, request.connection));
    });
    this.server.on('error', async (err) => {
      listener.onServerError(err);
    });
  }

  public close()
  {
    this.server.close();
  }
}
