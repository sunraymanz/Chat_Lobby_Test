import { IPacket } from "./packet";
import { IWebsocketConnection } from "./net/ws";
import { IdGenerator, User } from "./user";
import { Lobby } from "./lobby";

export class Remote implements IPacket
{
  private lobby: Lobby;
  private connection?: IWebsocketConnection;
  private user?: User;

  public constructor(conn: IWebsocketConnection, lobby: Lobby)
  {
    this.lobby = lobby;
    this.connection = conn;
    this.user = undefined;
  }

  public verify()
  {
    return this.user !== undefined;
  }

  public async recvLogin(displayName: string): Promise<void>
  {
    // create user
    const ud = { userId: IdGenerator.nextId(), displayName};
    const lobby = this.lobby;
    this.user = new User(ud, lobby);
    this.user.setRemote(this);
    this.user.sendUserData();
    // add user to lobby
    this.lobby.addUser(this.user);
  }

  public async recvChat(message: string): Promise<void>
  {
    console.log("recvChat", message);
    this.user?.doChat(message);
  }

  public async recvPrivateChat(receiverId: number, message: string): Promise<void>
  {
    console.log("recvPrivateChat", message);
    this.user?.doPrivateChat(receiverId, message);
  }

  public onConnected()
  {
    console.log("server: onConnected");
  }

  public onDisconnected()
  {
    if (this.user)
    {
      this.lobby.removeUser(this.user);
      this.lobby.leaveNotice(this.user);
      this.user.disconnected();
      this.user.close();
      this.user = undefined;
    }
  }

  public send(data: string)
  {
    if (this.connection !== undefined)
    {
      this.connection.send(data);
    }
  }

  public disconnect()
  {
    this.connection?.close();
  }

  public close()
  {
    this.disconnect();
    this.connection = undefined;
    if (this.user !== undefined)
    {
      this.user.close();
      this.user = undefined;
    }
  }

}