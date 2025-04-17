import express from 'express'
import { protect } from '../Middleware/auth.middle.js';
import { getMessages, getUserforSidebar, sendMessage } from '../Controllers/message.contro.js';

const router = express.Router()


router.get("/users", protect, getUserforSidebar);
router.get("/:id", protect, getMessages);

router.post("/send/:id",protect,sendMessage);

export default router;