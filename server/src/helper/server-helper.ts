/* eslint-disable @typescript-eslint/no-explicit-any */
import { log_err, log_info } from "./logger";
import { Server } from "./../server";

export function setupProcess(server: Server)
{
  // install unhandled exception handler
  process.on('unhandledRejection', (err, _promise) => {
    log_err(err);
  });
  process.on('uncaughtException', (err) => {
    log_err(err.stack);
  });

  // install shutdown signal handlers
  let guard = false; // prevent to shutdown() 2 times for unknown reason
  const shutdown = async (signal: any) => {
    if (guard) return;
    guard = true;
    log_info(`Signal: ${signal} server is shuting down`);
    await server.close();
    log_info("server is shuted down successfully");
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGHUP", shutdown);
  process.on("SIGBREAK", shutdown);
}
