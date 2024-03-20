const Order = require("../models/order");
const User = require("../models/user");

const createOrder = async (req, res) => {
  const { _id } = req.currentUser;
  //   const { coupon } = req.body;
  //   const userCart = await User.findById(_id)
  //     .select("cart")
  //     .populate("cart.product", "title prices");
  //   const products = userCart?.cart?.map((el) => ({
  //     product: el.product._id,
  //     count: el.quantity,
  //     color: el.color,
  //   }));
  //   let total = userCart?.cart?.reduce((sum, el) => {
  //     return el.product.prices * el.quantity + sum;
  //   }, 0);
  //   const createData = { products, total };
  //   if (coupon) {
  //     const selectedCoupon = await Coupon.findById(coupon);
  //     total =
  //       Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
  //         1000 || total;
  //     createData.total = total;
  //     createData.coupon = coupon;
  //   }
  const { products, total, address } = req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] }, { new: true });
  }
  const rs = await Order.create({ products, total, postedBy: _id });

  return res.json({
    success: rs ? true : false,
    createdUserCart: rs ? rs : " Cannot create Order",
  });
};

const updateStatus = async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    createdUserCart: response ? response : " Something went wrong",
  });
};
const getUserOrder = async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    createdUserCart: response ? response : " Something went wrong",
  });
};
module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
};
