const router = require("express").Router();
const insertController = require("../controller/insertData");
router.post("/", insertController.insertProduct);

module.exports = router;
