import axios from "axios";
import { db } from "..";
import { sendEmailNotification } from "./emails";

require("dotenv").config();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const API_REQUEST_LIMIT = 3;
const API_REQUEST_INTERVAL = 120000; // 2 minute in milliseconds

const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCurrentPrice = async (index:string) => {
  const url = `https://api.polygon.io/v2/aggs/ticker/${index}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
  const response = await axios.get(url);
  return response.data.results[0].c;
};

export const checkAndSendAlerts = async () => {
  try {
    const userRef = db.collection("userData");
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      
      return;
    }

    const alertPromises:any = [];
    let requestCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const { email, thresholds } = data;

      for (const threshold of thresholds) {
        const { index, type, value } = threshold;

        alertPromises.push(
          (async () => {
            if (requestCount >= API_REQUEST_LIMIT) {
              console.log(
                "Rate limit reached. Waiting for the next interval..."
              );
              await delay(API_REQUEST_INTERVAL);
              requestCount = 0;
            }

            const currentPrice = await fetchCurrentPrice(index);
            

            if (
              (type === "above" && currentPrice >= parseFloat(value)) ||
              (type === "below" && currentPrice < parseFloat(value))
            ) {
              console.log("Sending email...");
              await sendEmailNotification(
                email,
                index,
                value,
                type,
                currentPrice
              );
            }

            requestCount++;
          })()
        );
      }
    });

    await Promise.all(alertPromises);
  } catch (error) {
    console.log("error----", error);
  }
};
