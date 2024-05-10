/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";

// tslint:disable: no-console

function formatDateYYYYMMDD(d: Date)
{
  const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;

  return `${d.getFullYear()}${month}${day}`;
}

const DEV = false;
const FOLDER_NAME = "logs"
export enum LogType
{
  err = 0,
  warn,
  info,
}

const LOGTYPE_NAME = ["err", "warn", "info"];

function logger(type: LogType, msg?: any)
{
  const date = new Date();
  const log = `[${LOGTYPE_NAME[type.valueOf()]}] ${JSON.stringify(msg)}`;
  const name = `${FOLDER_NAME}/log_${formatDateYYYYMMDD(date)}.txt`;

  fs.appendFile(name, `${date.toLocaleString()} ${log}\n`, function (err) {
    if (err && DEV) console.warn(`Logger appendFile error ${err}`);
  });
}

const COLOR_RESET = "\x1b[0m"
const COLOR_RED = "\x1b[31m"
const COLOR_YELLOW = "\x1b[33m"

export function log_info(msg?: any)
{
  console.log(msg);
  logger(LogType.info, msg);
}

export function log_warn(msg: any)
{
  console.warn(`${COLOR_YELLOW}%s${COLOR_RESET}`, msg);
  logger(LogType.warn, msg);
}

export function log_err(msg: any)
{
  console.error(`${COLOR_RED}%s${COLOR_RESET}`, msg);
  logger(LogType.err, msg);
}
