import { log_info } from "./helper/logger";
import { Server } from "./server";
import { setupProcess } from "./helper/server-helper";

const PORT = ( process.env.PORT || 4000) as number;
const options = { network: { WebsocketPort: PORT } }

log_info("Debuz Job Application Copyright ©2022 Debuz Co.,Ltd. All Right Reserved.");
log_info("");

const server = new Server(options)
setupProcess(server)

log_info(`server started on       ${new Date().toLocaleString()}`);