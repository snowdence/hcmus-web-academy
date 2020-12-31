const express = require("express");
const router = express.Router();

router.route("/wishlist").get((req, res)=>{
    res.render("pages/student/wishlist", {
        title: "Wishlist"
    })
});
module.exports = router;