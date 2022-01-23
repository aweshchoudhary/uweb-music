const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("pages/login", { layout: "authLayout" });
});

module.exports = router;
