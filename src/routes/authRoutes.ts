import express from "express";
import { verifyToken } from "../middlewares";
import { authenticateUser } from "../controllers/authController";

export const router = express.Router();

router.post("/authenticate", verifyToken, authenticateUser);
