import { Lobby } from "./lobby";
import { sendChat, sendEnterUser, sendRemoveUser, sendUserData, UserData } from "./packet";
import { Remote } from "./remote";

export class IdGenerator
{
  private static id = 0;

  public static nextId()
  {
    this.id = this.id + 1;

    return this.id;
  }

  public static peekId()
  {
    return this.id + 1;
  }
}

export class User
{
  private remote?: Remote;

  private ud: UserData;
  private lobby: Lobby;


  public constructor(ud: UserData, lobby: Lobby)
  {
    this.ud = ud;
    this.lobby = lobby;
  }

  public setRemote(remote: Remote|undefined)
  {
    this.remote?.disconnect();
    this.remote = remote;
  }

  public getUserData()
  {
    return this.ud;
  }

  public getDisplayName()
  {
    return this.ud.displayName;
  }

  public getUserId()
  {
    return this.ud.userId;
  }

  public chatRoom(message: string)
  {
    this.lobby.chat(this, message)
  }

  public sendUserData()
  {
    sendUserData(this.remote, this.getUserId(), this.getDisplayName())
  }

  public sendChat(senderId: number, sender: string, message: string)
  {
    sendChat(this.remote, senderId, sender, message);
  }

  public sendEnterUser(user: User)
  {
    sendEnterUser(this.remote, user.getUserId(), user.getDisplayName());
  }

  public sendDupEnterUser(user: User)
  {
    //sendEnterUser(this.remote, user.getUserId(), user.getDisplayName()+"["+user.getUserId()+"]");
    sendEnterUser(this.remote, user.getUserId(), user.getDisplayName());
  }

  public sendRemoveUser(user: User)
  {
    sendRemoveUser(this.remote, user.getUserId())
  }

  public disconnected()
  {
    this.setRemote(undefined);
  }

  public doChat(message: string)
  {
    this.lobby.chat(this, message);
  }

  public doPrivateChat(receiverId: number, message: string)
  {
    const receiver = this.lobby.getUser(receiverId);
    if (receiver) {
        receiver.sendChat(this.getUserId(), this.getDisplayName(), message);
    } else {
        console.log("Receiver not found");
    }
  }

  public close()
  {
    // remove user
  }
}