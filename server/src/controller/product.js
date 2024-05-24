const Product = require("../models/products");
const slugify = require("slugify");
const createProduct = async (req, res) => {
  const { title, prices, brand, type, quantity, color } = req.body;
  if (!(title, prices, brand, type, quantity, color))
    throw new Error("Missing inputs");

  req.body.slug = slugify(title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Tạo sản phẩm thành công" : "Tạo sản phẩm thất bại",
  });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const newProduct = await Product.findByIdAndDelete(id);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Xóa sản phẩm thành công" : "Không thể xóa sản phẩm",
  });
};
const getProducts = async (req, res) => {
  const queries = { ...req.query };
  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((e) => delete queries[e]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  let fomatedQueries = JSON.parse(queryString);
  let colorQueryObject = {};
  if (queries?.title) {
    fomatedQueries.title = { $regex: queries.title, $options: "i" };
  }

  if (queries?.brand) {
    fomatedQueries.brand = { $regex: queries.brand, $options: "i" };
  }
  if (queries?.type)
    fomatedQueries.type = { $regex: queries.type, $options: "i" };
  if (queries?.color) {
    delete fomatedQueries.color;
    const colorArr = queries.color?.split(",");

    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));

    colorQueryObject = { $or: colorQuery };
  }
  const q = { ...colorQueryObject, ...fomatedQueries };
  let queryCommad = Product.find(q);
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
        const counts = await Product.find(q).countDocuments();
        return res.status(200).json({
          success: response ? true : false,
          counts,
          products: response ? response : "Cannot get products",
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
const getProductById = async (req, res) => {
  const { id } = req.params;
  const products = await Product.findById(id).populate({
    path: "rating",
    populate: {
      path: "postedBy",
      select: "firstname lastname avatar",
    },
  });
  return res.status(200).json({
    success: products ? true : false,
    productDatas: products ? products : "Cannot get products by id",
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
