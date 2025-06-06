import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../Controllers/auth.contro.js';
import { protect } from '../Middleware/auth.middle.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile",protect,updateProfile)

router.get("/check",protect, checkAuth)




export default router;  