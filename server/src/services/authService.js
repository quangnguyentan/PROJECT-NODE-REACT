import User from "../models/user";
import Otp from "../models/otp";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();
import otpGenerator from "otp-generator";
const { v4: uuidv4 } = require("uuid");
const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const hashOTP = (otp) => bcrypt.hashSync(otp, bcrypt.genSaltSync(10));
export const registerService = ({ phone }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ phone });
      if (user) {
        throw new Error("Phone number has been already ");
      }
      // cách 1
      // const num = Math.floor(Math.random() * (999999 - 100000) + 100000);
      // const otp = num.toString();
      // cách 2 là sử dụng thư viện
      const OTP = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log(OTP);

      const response = await Otp.create({
        phone,
        otp: hashOTP(OTP),
      });
      // const token =
      //   response &&
      //   jwt.sign(
      //     { id: response.id, phone: response.phone },
      //     process.env.SECRET_KEY,
      //     { expiresIn: "2d" }
      //   );
      resolve({
        err: user ? "Phone number has been already" : 2,
        msg: response ? "OTP send successfully" : "",
        response,
        // token: token || null,
      });
    } catch (error) {
      reject(error);
    }
  });
export const verifyOtpServices = ({ phone, otp }) =>
  new Promise(async (resolve, reject) => {
    try {
      const otpHolder = await Otp.find({ phone });
      if (otpHolder.length === 0) throw new Error("Expired OTP! ");
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      const validUser = bcrypt.compareSync(otp, rightOtpFind.otp);
      if (rightOtpFind.phone === phone && validUser) {
        const user = await User.create({
          phone: rightOtpFind.phone,
          id: uuidv4(),
        });
        const token =
          user &&
          jwt.sign({ id: user.id, phone: user.phone }, process.env.SECRET_KEY, {
            expiresIn: "2d",
          });
        if (user) {
          await Otp.deleteMany({
            phone,
          });
        }

        return resolve({
          err: token ? 0 : 2,
          msg: "Register is successful",
          token: token,
          data: user,
        });
      } else {
        throw new Error("OTP was wrong");
      }
    } catch (error) {
      reject(error);
    }
  });
export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await User.findOne({
        phone,
      });
      console.log(response);
      const isCorrectPassword =
        response && bcrypt.compareSync(password, response.password);
      const token =
        isCorrectPassword &&
        jwt.sign(
          { id: response.id, phone: response.phone },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );
      resolve({
        err: token ? 0 : 2,
        msg: token
          ? "Login is successfully"
          : response
          ? "Phone number or password is incorrect"
          : "Phone number is not available",
        token: token || null,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
export const loginSuccessService = (id, tokenLogin) =>
  new Promise(async (resolve, reject) => {
    const newTokenLogin = uuidv4();
    try {
      let response = await User.findOne({
        id,
        tokenLogin,
      }).select("-cart -wishList");
      console.log(response);
      const token =
        response &&
        jwt.sign(
          {
            id: response.id,
            email: response.email,
            _id: response._id,
            role: response.role,
          },
          process.env.SECRET_KEY,
          { expiresIn: "5d" }
        );
      resolve({
        err: token ? 0 : 3,
        msg: token ? "OK" : "User not found",
        token,
        role: response.role,
      });
      if (response) {
        console.log(response);
        await User.updateOne(
          {
            id: response?.id,
          },
          {
            $set: {
              tokenLogin: newTokenLogin,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
      reject({
        err: 2,
        msg: "Failed at auth service",
      });
    }
  });
