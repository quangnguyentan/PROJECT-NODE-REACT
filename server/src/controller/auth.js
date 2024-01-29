import * as authService from "../services/authService";
export const register = async (req, res) => {
  const { fullname, phone, password } = req.body;
  console.log(phone);
  try {
    // if (!fullname || !phone || !password)
    if (!phone)
      return res.status(400).json({
        err: 1,
        msg: "Missing input",
      });
    const response = await authService.registerService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed to register " + error,
    });
  }
};
export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    if (!phone || !otp)
      return res.status(400).json({
        err: 1,
        msg: "Missing input",
      });
    const response = await authService.verifyOtpServices(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: -1,
      msg: "Failed to get phone",
    });
  }
};
export const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password)
      return res.status(400).json({
        err: 1,
        msg: "Missing input",
      });
    const response = await authService.loginService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed to register " + error,
    });
  }
};

export const loginSuccess = async (req, res) => {
  const { id, tokenLogin } = req?.body;
  try {
    if (!id || !tokenLogin) {
      res.status(400).json({
        err: 1,
        msg: "missing input",
      });
    }
    const response = await authService.loginSuccessService(id, tokenLogin);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      err: -1,
      msg: "Failed at auth controller" + error,
    });
  }
};
