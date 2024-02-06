const express = require("express");
const router = express.Router();
const controller = require("../controllers/allControlers");
const catchAsync = require("../utils/catchAsync");

router.route("/").get(controller.renderHome).post(controller.checkForm);

router.post("/*****", catchAsync(controller.subscribe));

router.post("/*****", controller.checkForm);

router
  .route("/gallery")
  .get(catchAsync(controller.showGallery))
  .post(controller.sortGallery);

router.get("/*****/:id", catchAsync(controller.verifyUser));

router.get("/*****/:id", catchAsync(controller.getUser));

router.post("/*****/:id", catchAsync(controller.deleteUser));

router.use(controller.send404);

module.exports = router;
