import express from "express";
import usersRoutes from "./users-routes";
import picturesRoutes from "./pictures-routes";
import friendsRoutes from "./friends-routes";
import blacklistRoutes from "./blacklist-routes";
import messagesRoutes from "./messages-routes";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/pictures", picturesRoutes);
router.use("/friends", friendsRoutes);
router.use("/blacklist", blacklistRoutes);
router.use("/messages", messagesRoutes);

export default router;
