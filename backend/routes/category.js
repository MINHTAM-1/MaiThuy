var express = require('express');
var router = express.Router();
var db = require('./../models/database');

router.get('/category', async function (req, res) {
    const database = await db();

    const category = database.collection('category');
    const products = database.collection('products');

    const result_category = await category.find({}).limit(10).toArray();
    const result_products = await products.find({}).toArray();

    const result = result_category.map(cat => {
        const count = result_products.filter(p => p.category.toString() === cat._id.toString()).length;
        return {
            _id: cat._id,
            name: cat.name,
            icon: cat.icon,
            items: count
        };
    });
    res.json({ category: result});
});

router.get('/category/viewall', async function (req, res) {
    const database = await db();

    const category = database.collection('category');
    const products = database.collection('products');

    const result_category = await category.find({}).toArray();
    const result_products = await products.find({}).toArray();

    const result = result_category.map(cat =>{
        const count = result_products.filter(p => p.category.toString() === cat._id.toString()).length;
        return {
            _id: cat._id,
            name: cat.name,
            icon: cat.icon,
            items: count
        };
    });
    res.json({ category: result});
})

module.exports = router;