const express =
    require("express");

const router =
    express.Router();

const {

    createSupport,

    getSupports,

    resolveSupport,

} = require(
    "../controllers/supportController"
);


// CREATE REQUEST

router.post(
    "/",
    createSupport
);


// GET REQUESTS

router.get(
    "/",
    getSupports
);


// RESOLVE REQUEST

router.put(
    "/resolve/:id",
    resolveSupport
);

module.exports = router;