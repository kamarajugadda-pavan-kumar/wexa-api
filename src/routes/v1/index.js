const express = require("express");
const router = express.Router();

const authRoutes = require("./auth-routes");
const friendReuestRoutes = require("./friend-request-routes");
const messsageRoutes = require("./message-routes");
const userRoutes = require("./user-routes");
const ActivityRoutes = require("./activity-routes");
const PostRoutes = require("./post-routes");

router.use(authRoutes);
router.use(friendReuestRoutes);
router.use(messsageRoutes);
router.use(userRoutes);
router.use(ActivityRoutes);
router.use(PostRoutes);

module.exports = router;
