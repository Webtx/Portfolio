import { Router } from "express";
import { publicRouter } from "./public";
import { adminRouter } from "./admin";

export const apiRouter = Router();

apiRouter.use("/public", publicRouter);
apiRouter.use("/admin", adminRouter);
