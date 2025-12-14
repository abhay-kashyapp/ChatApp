import jwt from "jsonwebtoken";

const tokenGeneration = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  const isProd = process.env
  .NODE_ENV === "production";
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProd ? "none" : "strict",
    secure: isProd, // send cookie only over HTTPS in production
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};

export default tokenGeneration;

