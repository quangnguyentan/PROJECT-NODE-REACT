import jwt from "jsonwebtoken";
require("dotenv").config();
export const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err)
        res.status(200).json({
          err: 2,
          msg: "Token không hợp lệ",
        });
      req.currentUser = decode;
      next();
    });
  } else {
    res.status(200).json({
      err: 2,
      msg: "Bạn chưa đăng nhập",
    });
  }
};
export const isAdmin = (req, res, next) => {
  const { role } = req.currentUser;

  console.log(role);
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      mes: "Requested admin role",
    });
  next();
};
