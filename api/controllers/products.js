const mongoose = require('mongoose');

const Product = require('../models/product')

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: req.get('host') + '/products/' + doc._id
                        }
                    }
                })
            };
            // if(docs.length >= 0) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found.'
            //     });
            // }
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path // path from multer
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully.',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request: {
                        type: 'GET',
                        url: req.get('host') + '/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: req.get('host') + '/products/'
                    }
                });
            } else {
                res.status(404).json({message: 'No entry found for provided ID'});
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {  // Loop through all the operations of the request body
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated.',
                request: {
                    type: 'GET',
                    url: req.get('host') + '/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: req.get('host') + '/products/',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}