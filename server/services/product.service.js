var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('products');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.getByName = getByName;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.products.find().toArray(function (err, products) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(products);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product) {
            deferred.resolve(product);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getByName(_name) {
    var deferred = Q.defer();

    db.products.findOne(
        { name: _name },
        function (err, product) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (product) {
                deferred.resolve(product);
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function create(productParam) {
    var deferred = Q.defer();

    // 验证
    db.products.findOne(
        { name: productParam.name },
        function (err, product) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (product) {
                // 已存在
                deferred.reject('Product "' + productParam.name + '" is already taken');
            } else {
                createProduct();
            }
        });

    function createProduct() {
        var product = productParam;

        db.products.insert(
            product,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, productParam) {
    var deferred = Q.defer();

    // 验证
    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product.name !== productParam.name) {
            // 名称已更改，检查是否重名
            db.products.findOne(
                { name: productParam.name },
                function (err, product) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (product) {
                        // 商品已存在
                        deferred.reject('Product "' + productParam.name + '" is already taken')
                    } else {
                        updateProduct();
                    }
                });
        } else {
            updateProduct();
        }
    });

    function updateProduct() {
        // 要更新的字段
        var set = {
            name: productParam.name,
            price: productParam.price,
        };

        db.products.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.products.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}