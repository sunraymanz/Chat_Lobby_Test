/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IWebSocketListener
{
  onServerError(err: Error): void;
  onError(conn: IWebsocketConnection, err: Error): Promise<void>;
  onConnected(conn: IWebsocketConnection): Promise<void>;
  onDisconnected(conn: IWebsocketConnection): Promise<void>;
  onReceived(conn: IWebsocketConnection, message: string): Promise<void>;
}

export enum ConnectionState
{
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

export enum ConnectEvent
{
  ERROR,
  ESTABLISHED,
}

export interface IWebsocketConnection
{
  setUserData(ud: any): void;
  getUserData(): any;
  close(): void;
  send(data: string): void;
}
