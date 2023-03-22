const express = require('express');
const router = express.Router();
const userSchema = require('../models/User');

const authJwt = require('../middlewares/authJwt');

router.get("/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    userSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
});

module.exports = router;