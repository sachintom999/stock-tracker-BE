import express from "express";
import cors from "cors";
import { getFirestore } from "firebase-admin/firestore";
import { alertRoutes, authRoutes } from "./routes";
import { checkAndSendAlerts } from "./services/alerts";

require("dotenv").config();

const corsOptions = {
  origin: 'https://market-index-tracker.vercel.app',
  optionsSuccessStatus: 200 
};

const app = express();
const cron = require("node-cron");
const PORT = process.env.PORT;

export const admin = require("firebase-admin");
// const serviceAccount = require("../test-auth-app-key.json");


const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT as string;
const serviceAccountBuffer = Buffer.from(serviceAccountBase64, 'base64');
const serviceAccount = JSON.parse(serviceAccountBuffer.toString('utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = getFirestore();

app.use(cors(corsOptions));
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
