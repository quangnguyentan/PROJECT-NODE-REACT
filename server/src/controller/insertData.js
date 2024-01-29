const slugtify = require("slugify");
const data = require("../../../data/mayanh.json");
const Product = require("../models/products");

const {
  createSlugCategories,
  categories,
  createSlug,
} = require("../utils/helper");
const fakeColor = (type) => {
  const color = [];
  type?.variants?.map((variant) => {
    if (variant?.colorName === "Màu" || variant?.colorName === "Màu sắc") {
      variant.variants.map((el) => {
        if (el != null) color.push(el);
      });
    }
  });
  return color;
};

const fn = async (product) => {
  await Product.create({
    title: product?.title,
    slug: slugtify(product?.title) + Math.round(Math.random() * 100) + " ",
    brand: product?.brand?.brandName,
    brandLink: product?.brand?.link,
    prices: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    variants: product?.variants,
    thumb: product?.thumb,
    totalRatings: 0,
    color: fakeColor(product),
    category: createSlug(categories[24].categoryName),
    type: createSlugCategories(categories[24].categoryName)[0],
  });
};
const insertProduct = async (req, res) => {
  const promises = [];
  for (let product of data) {
    promises.push(fn(product));
  }

  await Promise.all(promises);
  return res.json("Done");
};
module.exports = { insertProduct };
