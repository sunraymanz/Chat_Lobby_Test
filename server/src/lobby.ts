import { Server } from "./server";
import { User } from "./user";

export class Lobby
{
  private users: Map<number, User>;

  public constructor(_server: Server)
  {
    this.users = new Map<number, User>();
  }

  public addUser(user: User)
  {
    //if (this.checkSameName(user)) 
    this.users.forEach((otherPlayer) => {user.sendEnterUser(otherPlayer);});
    this.broadcast((playerId, player) => player.sendEnterUser(user));    
    this.users.set(user.getUserId(), user);
    this.checkUser();
  }
  
  public checkUser()//for debuging
  {
    console.log("=== People In Lobby ===");
    this.users.forEach((Map) => {console.log("ID : "+ Map.getUserId() +" is "+ Map.getDisplayName())});
  }

  //check if there are player with same name already in lobby
  public checkSameName(user: User) : boolean 
  {
    let found = false;
    this.users.forEach((otherPlayer) => 
    {
      //get other player info to show lobby list
      if (otherPlayer.getDisplayName() == user.getDisplayName()) 
        {
          user.sendDupEnterUser(otherPlayer);
          console.log("same name");
          found = true;
        }
      else { user.sendEnterUser(otherPlayer);} 
    });
    return found;
  }

  public removeUser(user: User)
  {
    this.users.delete(user.getUserId())
    this.broadcast((playerId, player) => player.sendRemoveUser(user));
    this.checkUser();
  }

  public getUser(userId: number)
  {
    return this.users.get(userId);
  }

  public chat(sender: User, message: string)
  {
    this.broadcast((playerId, player) => {
      player.sendChat(sender.getUserId(), sender.getUserData().displayName, message)
    });
  }
  
  //broadcast player leave
  public leaveNotice(sender: User)
  {
    console.log(sender.getDisplayName()+"["+sender.getUserId()+"] has left");
    this.broadcast((playerId, player) => {
      player.sendChat(sender.getUserId(), sender.getDisplayName()+"["+sender.getUserId()+"] ", "has left")
    });
  }

  private broadcast(handler: (playerId: number, player: User) => void)
  {
    for (const [id, player] of this.users)
    {
      if (player !== undefined)
      {
        handler(id, player);
      }
    }
  }

  public close()
  {
    this.users.clear();
  }
}