/* eslint-disable @typescript-eslint/no-explicit-any */
import { log_err } from "./helper/logger";

export interface PacketMapper { [key: string]: (remote: IPacket, data: any) => Promise<void>; }

export async function dispatchPacket(remote: IPacket, message: string): Promise<boolean>
{
  const packet = JSON.parse(message);
  if (packet === undefined) return false;
  if (packet.name === undefined) return false;

  const func = MAPPER[packet.name];
  if (func !== undefined)
  {
    await func(remote, packet.data);
    return true;
  }

  console.warn(`packet not found: ${packet.name}`);

  return false;
}

export interface IPacket
{
  onConnected(): void;
  onDisconnected(): void;
  disconnect(): void;
  verify(): boolean;
  send(data: string): void;

  recvLogin(user: string): Promise<void>;
  recvChat(message: string): Promise<void>;
  recvPrivateChat(receiverId: number, message: string): Promise<void>;
}

const MAPPER: PacketMapper = {
  Login: dispatchLogin,
  Chat: dispatchChat,
  PrivateChat: dispatchPrivateChat,
};

async function dispatchLogin(remote: IPacket, data: any)
{
  await remote.recvLogin(data.displayName);
}
async function dispatchChat(remote: IPacket, data: any)
{
  if (!remote.verify()) { log_err("dispatchChat verify failed"); return; }
  await remote.recvChat(data.message);
}
async function dispatchPrivateChat(remote: IPacket, data: any)
{
  if (!remote.verify()) { log_err("dispatchDisconnect verify failed"); return; }
  await remote.recvPrivateChat(data.receiverId, data.message);
}

export function sendError(remote: IPacket|undefined, errcode: string, errString: string)
{
  if (remote === undefined) return;
  remote.send(JSON.stringify({ name: "Error", data: { errcode, errString } }));
}

export function sendChat(remote: IPacket|undefined, senderId: number, sender: string, message: string)
{
  if (remote === undefined) return;
  remote.send(JSON.stringify({ name: "Chat", data: { senderId, sender, message } }));
}

export function sendEnterUser(remote: IPacket|undefined, userId: number, displayName: string)
{
  if (remote === undefined) return;
  remote.send(JSON.stringify({ name: "EnterUser", data: { userId, displayName } }));
}

export function sendRemoveUser(remote: IPacket|undefined, userId: number)
{
  if (remote === undefined) return;
  remote.send(JSON.stringify({ name: "RemoveUser", data: { userId } }));
}

export function sendUserData(remote: IPacket|undefined, userId: number, displayName: string)
{
  if (remote === undefined) return;
  remote.send(JSON.stringify({ name: "UserData", data: { userId, displayName } }));
}

export interface UserData
{
  userId: number;
  displayName: string;
}