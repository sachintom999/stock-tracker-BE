import { Request, Response } from "express";
import { addThreshold, getUserData } from "../db";

const setThreshold = async (req: Request, res: Response) => {
  try {
    const email = req.user;
    const reqBody = req.body;

    const newThreshold = await addThreshold(email, reqBody);

    res.status(200).json({ msg: "success", data: newThreshold });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getThresholds = async (req: Request, res: Response) => {
  const { index } = req.params;
  const email = req.user;
  const userData = await getUserData(email);

  const indexThresolds = userData?.thresholds.filter((t) => t.index === index);

  res.status(200).json({ data: indexThresolds });
};

export { setThreshold, getThresholds };
