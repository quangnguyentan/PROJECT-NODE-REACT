const router = require("express").Router();
const productController = require("../controller/product");
import { isAdmin, verifyToken } from "../middlewares/verifyToken";
// router.post("/", [verifyAccessToken, isAdmin], productController.createProduct);
router.get("/:id", productController.getProductById);
router.get("/", productController.getProducts);
router.post("/", [verifyToken, isAdmin], productController.createProduct);
router.delete("/:id", [verifyToken, isAdmin], productController.deleteProduct);

module.exports = router;
