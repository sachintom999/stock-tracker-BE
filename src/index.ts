import express from "express";
import cors from "cors";
import { getFirestore } from "firebase-admin/firestore";
import { alertRoutes, authRoutes } from "./routes";
import { checkAndSendAlerts } from "./services/alerts";

require("dotenv").config();

const app = express();
const cron = require("node-cron");
const PORT = process.env.PORT;

export const admin = require("firebase-admin");
const serviceAccount = require("../test-auth-app-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = getFirestore();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes);

let pattern;
// pattern = `*/55 * * * * *`; // every  55s - for demo

pattern = "0 0 * * *"; // every day at 12am-

cron.schedule(pattern, async () => {
  await checkAndSendAlerts();
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT} ✅`);
});
