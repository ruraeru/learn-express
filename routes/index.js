const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello Express");
});

router.get("/user/:id", (req, res) => {
    console.log(req.params, req.query);
})

module.exports = router;