import * as userService from "../services/userService";
import User from "../models/user";
const makeToken = require("uniqid");

export const getCurrent = async (req, res) => {
  const { currentUser } = req;
  try {
    if (!currentUser?.id) {
      res.status(400).json({
        err: 1,
        msg: "missing input",
      });
    }
    const response = await userService.getCurrentService(currentUser?.id);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      err: -1,
      msg: "Failed at auth controller" + error,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const response = await User.find();
    // const response = await userService.getAllService();
    return res.status(200).json({
      success: response ? true : false,
      user: response,
    });
  } catch (error) {
    res.status(500).json({
      err: -1,
      msg: "Failed at auth controller" + error,
    });
  }
};
const finalRegister = async (req, res) => {
  // const cookie = req.cookies;

  const { token } = req.params;
  const notActiveEmail = await User.findOne({
    email: new RegExp(`${token}`),
  });
  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0]);
    notActiveEmail.save();
  }
  return res.json({
    success: notActiveEmail ? true : false,
    mess: notActiveEmail
      ? "Register is successfully. Please, Go Login"
      : "It's wrong!!",
  });
  // if (!cookie || cookie?.dataregister?.token !== token) {
  //   res.clearCookie("dataregister");
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  // }
  // const newUser = await User.create({
  //   email: cookie?.dataregister.email,
  //   password: cookie?.dataregister.password,
  //   mobile: cookie?.dataregister.mobile,
  //   firstname: cookie?.dataregister.firstname,
  //   lastname: cookie?.dataregister.lastname,
  // });
  // res.clearCookie("dataregister");
  // if (newUser)
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
};
const refreshAcessToken = async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie && !cookie.refreshToken) throw new Error("No refresh token");
  const rs = jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET
    // async (err, decode) => {
    //   if (err) throw new Error("Invalid refresh token");
    //   const response = await User.findOne({
    //     id: decode._id,
    //     refreshToken: cookie.refreshToken,
    //   });
    //   return response.status(200).json({
    //     success: response ? true : false,
    //     newAccessToken: response
    //       ? generateAccesToken(response._id, response.role)
    //       : "Refresh token not matched",
    //   });
    // }
  );
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccesToken(response._id, response.role)
      : "Refresh token not matched",
  });
};
const register = async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }
  const user = await User.findOne({ email });
  const isMobile = await User.findOne({ mobile });
  if (isMobile) {
    throw new Error("Mobile has been already");
  } else if (user) {
    throw new Error("Email has been already");
  } else {
    const token = makeToken();
    // res.cookie(
    //   "dataregister",
    //   { ...req.body, token },
    //   {
    //     httpOnly: true,
    //     maxAge: 15 * 60 * 1000,
    //   }
    // );

    // const html = `
    // Xin click vào link dưới đây để hoàn tất quá trình đăng ký.Link sẽ hết hạn sau 15 phút kể từ bây giờ <a href = "${process.env.URL_SERVER}/api/user/finalregister/${token}">Click here</a> `;
    // cách 2 đăng kí và lưu cookie dưới db
    const emailEdit = btoa(email) + "@" + token;
    const newUser = await User.create({
      email: emailEdit,
      password,
      firstname,
      lastname,
      mobile,
    });

    if (newUser) {
      const html = `<h2>Register Code:</h2><br/><blockquote>${token}</blockquote>`;
      await sendMail({
        email,
        html,
        subject: "Confirm register password Digital Word ",
      });
    }
    setTimeout(async () => {
      await User.deleteOne({ email: emailEdit });
    }, [300000]);
    return res.json({
      success: newUser ? true : false,
      mes: newUser ? "Please check your email" : "Please, Try again!",
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mess: "Missing input",
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrecPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccesToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, accessToken, userData });
  } else {
    throw new Error("Invalid credentials");
  }
};
const logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) throw new Error("No refresh token ");
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mess: "Logout ok",
  });
};
const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // console.log(passwordResetToken);
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid password reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
};

export const updateCard = async (req, res) => {
  try {
    const { _id } = req.currentUser;
    const { pid, quantity = 1, color } = req.body;
    if (!pid || !color) throw new Error("Missing inputs");
    const user = await User.findById(_id).select("cart");
    console.log(user);
    const alreadyProduct = user?.cart?.find(
      (el) => el.product.toString() === pid
    );
    console.log(alreadyProduct);
    if (alreadyProduct && alreadyProduct.color === color) {
      // const updateQuantity = {
      //   ...alreadyProduct,
      //   quantity: alreadyProduct.quantity + quantity,
      // };
      const updatedQuantity = alreadyProduct.quantity + quantity;
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": updatedQuantity } },
        // { $set: { "cart.$.prices": prices } },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated your cart" : "Some thing went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        {
          new: true,
        }
      );
      console.log(response);
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated your cart" : "Cannot find user",
      });
    }
  } catch (error) {
    console.log("Faild at " + error);
  }
};

export const removeProductCard = async (req, res) => {
  try {
    const { _id } = req.currentUser;
    const { pid } = req.params;
    const user = await User.findById(_id).select("cart");
    const alreadyProduct = user?.cart?.find(
      (el) => el.product.toString() === pid
    );
    if (!alreadyProduct)
      return res.status(200).json({
        success: true,
        mess: "Updated your cart",
      });

    const response = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { cart: { product: pid } },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Cannot find user",
    });
  } catch (error) {
    console.log("Faild at " + error);
  }
};
