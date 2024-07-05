import express from "express";
import { verifyToken } from "../middlewares";
import { getThresholds, setThreshold } from "../controllers/alertsController";

export const router = express.Router();

router.post("/set-threshold", verifyToken, setThreshold);

router.get("/getThresholds/:index", verifyToken, getThresholds);
