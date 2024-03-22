const router = require("express").Router();
const orderController = require("../controller/order");
const {
  verifyAccessToken,
  verifyToken,
  isAdmin,
} = require("../middlewares/verifyToken");
router.post("/", verifyToken, orderController.createOrder);
router.put(
  "/status/:oid",
  [verifyToken, isAdmin],
  orderController.updateStatus
);
router.get("/", verifyToken, orderController.getUserOrder);
router.get("/admin", verifyToken, orderController.getOrder);

module.exports = router;
