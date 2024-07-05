import { addUserData, getUserData } from "../db";

export const authenticateUser = async (req, res) => {
  let user1;

  const email = req.user;
  const userData = await getUserData(email);

  if (!userData) {
    const { name } = req.body;

    const user = await addUserData(email, name);

    user1 = {
      name: user.name,
      email: user.email,
    };
  } else {
    user1 = {
      name: userData.name,
      email: userData.email,
    };
  }

  res.status(200).json({ user: req.user, user1 });
};
