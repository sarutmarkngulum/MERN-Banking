const express = require("express");
const {
  getAllUsers,
  getUser,
  registerController,
  loginController,
} = require("../controllers/userContoller");

const {auth} = require('../middleware/auth')

const router = express.Router();

// GET ALL USERS || GET
router.get("/all-users", getAllUsers);

router.get("/get-user/:id",auth,getUser)

// CREATE USER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

module.exports = router;