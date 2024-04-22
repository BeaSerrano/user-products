const { isAuth, isAuthAdmin } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  registerLargo,
  resendCode,
  checkNewUser,
  login,
  autoLogin,
  changePassword,
  sendPassword,
  modifyPassword,
  update,
  deleteUser,
} = require("../controllers/User.controllers");
const express = require("express");
const UserRoutes = express.Router();

//! ---------------- endPoints sin auth ---------------------------------------
UserRoutes.post("/registerLargo", upload.single("image"), registerLargo);
UserRoutes.post("/resend", resendCode);
UserRoutes.post("/check", checkNewUser);
UserRoutes.post("/login", login);
UserRoutes.post("/login/autologin", autoLogin);
UserRoutes.patch("/forgotpassword", changePassword);
UserRoutes.delete("/", [isAuth], deleteUser);

//! ---------------- endPoints con auth ---------------------------------------

UserRoutes.patch("/changepassword", [isAuth], modifyPassword);
UserRoutes.patch("/update/update", [isAuth], upload.single("image"), update);

/// ------------------> rutas que pueden ser redirect
UserRoutes.patch("/sendPassword/:id", sendPassword);
module.exports = UserRoutes;
