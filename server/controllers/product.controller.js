var config = require('config.json');
var express = require('express');
var router = express.Router();
var productService = require('services/product.service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.get('/:_id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
    productService.create(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    productService.getAll()
        .then(function (products) {
            res.send(products);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    // console.log(req)
    productService.getById(req.params._id)
        .then(function (product) {
            if (product) {
                res.send(product);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    productService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    productService.delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}