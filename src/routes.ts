import { Router } from "express";
import ConvertController from "./features/convert/convert.controller";

const routes = Router()

// Convert Routes
routes.post('/convert/logs/cdn-to-agora', ConvertController.convertCDNLogsToAgoraFormat)

export default routes