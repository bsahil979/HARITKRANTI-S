import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(protect);

router.get("/", getUserNotifications);
router.get("/unread/count", getUnreadCount);
router.patch("/:id/read", markAsRead);
router.patch("/read/all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;




