const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/products");

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
  const { products, total, address, status } = req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] }, { new: true });
  }
  const data = { products, total, orderBy: _id };
  if (status) data.status = status;
  const rs = await Order.create(data);

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
  const queries = { ...req.query };
  const { _id } = req.currentUser;

  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((e) => delete queries[e]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  let fomatedQueries = JSON.parse(queryString);
  // let colorQueryObject = {};
  // if (queries?.title) {
  //   fomatedQueries.title = { $regex: queries.title, $options: "i" };
  // }

  // if (queries?.brand) {
  //   fomatedQueries.brand = { $regex: queries.brand, $options: "i" };
  // }
  // if (queries?.type)
  //   fomatedQueries.type = { $regex: queries.type, $options: "i" };
  // if (queries?.color) {
  //   delete fomatedQueries.color;
  //   const colorArr = queries.color?.split(",");

  //   const colorQuery = colorArr.map((el) => ({
  //     color: { $regex: el, $options: "i" },
  //   }));

  //   colorQueryObject = { $or: colorQuery };
  // }
  const q = { ...fomatedQueries, orderBy: _id };
  let queryCommad = Order.find(q);
  try {
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommad = queryCommad.sort(sortBy);
      // console.log(queryCommad);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommad = queryCommad.select(fields);
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommad.skip(skip).limit(limit);
    queryCommad
      .then(async (response) => {
        const counts = await Order.find(q).countDocuments();
        const updatedProducts = await Promise.all(
          response.map(async (el, index) => {
            const productId = el.products[index].product;

            const findProduct = await Product.findById(productId).select(
              "title thumb prices quantity brand"
            );

            findProduct.quantity = el.products[index].quantity;
            findProduct.color = el.products[index].color;

            return findProduct;
          })
        );
        console.log(updatedProducts);
        return res.status(200).json({
          success: response ? true : false,
          counts,
          products: updatedProducts ? updatedProducts : "Cannot get products",
          order: response ? response : "Cannot get orders",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
const getOrder = async (req, res) => {
  const queries = { ...req.query };

  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((e) => delete queries[e]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  let fomatedQueries = JSON.parse(queryString);
  // let colorQueryObject = {};
  // if (queries?.title) {
  //   fomatedQueries.title = { $regex: queries.title, $options: "i" };
  // }

  // if (queries?.brand) {
  //   fomatedQueries.brand = { $regex: queries.brand, $options: "i" };
  // }
  // if (queries?.type)
  //   fomatedQueries.type = { $regex: queries.type, $options: "i" };
  // if (queries?.color) {
  //   delete fomatedQueries.color;
  //   const colorArr = queries.color?.split(",");

  //   const colorQuery = colorArr.map((el) => ({
  //     color: { $regex: el, $options: "i" },
  //   }));

  //   colorQueryObject = { $or: colorQuery };
  // }
  const q = { ...fomatedQueries };
  let queryCommad = Order.find(q);
  try {
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommad = queryCommad.sort(sortBy);
      // console.log(queryCommad);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommad = queryCommad.select(fields);
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommad.skip(skip).limit(limit);
    queryCommad
      .then(async (response) => {
        const counts = await Order.find(q).countDocuments();
        console.log(counts);
        response.map((el) => {
          console.log(el);
        });
        return res.status(200).json({
          success: response ? true : false,
          counts,
          order: response ? response : "Cannot get orders",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrder,
};
