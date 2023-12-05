const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/welcome", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "welcome",
    "welcome.html"
  );
  res.sendFile(filePath);
});

router.get("/loginPage", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "login", "login.html");
  res.sendFile(filePath);
});

router.get("/signupPage", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "signup",
    "signup.html"
  );
  res.sendFile(filePath);
});
router.get("/expenses", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "expanseTracker",
    "expanseTracker.html"
  );
  res.sendFile(filePath);
});
router.get("/forgot", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "forgotPassword",
    "forgotPassword.html"
  );
  res.sendFile(filePath);
});
router.get("/resetPage", (req, res) => {
  const uuid = req.params.uuid;
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "resetPassword",
    "resetPassword.html"
  );
  res.sendFile(filePath, { query: { uuid } });
});
router.get("/report", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "report",
    "report.html"
  );
  res.sendFile(filePath);
});

module.exports = router;
