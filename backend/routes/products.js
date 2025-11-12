var { ObjectId } = require("mongodb");
var express = require('express');
var router = express.Router();
var db = require('./../models/database');

/* GET: Lay all du lieu products. */
router.get('/products', async function (req, res) {
    const database = await db();
    // Truy cap table products
    const products = database.collection('products');

    // Thực hiện query
    const result = await products.find({}).toArray();

    res.json({ products: result });
});

/* GET: Lay all du lieu products. */
router.get('/products/:id', async function (req, res) {
    const database = await db();
    // Truy cap table products
    const products = database.collection('products');

    // Thực hiện query
    const result = await products.findOne({ _id: new ObjectId(req.params.id) });

    res.json({ products: result });
});

// POST gio hang
router.post("/products/cart/add", async (req, res) => {
    const { user_id, product } = req.body;

    const database = await db();
    const cart = await database.collection("cart").findOne({ user_id });

    if (cart) {
        // Tìm xem sản phẩm đã có trong giỏ chưa
        const existingItem = cart.items.find(i => i.product_id === product.product_id);
        if (existingItem) {
            // Nếu có thì tăng số lượng
            await database.collection("cart").updateOne(
                { user_id, "items.product_id": product.product_id },
                { $inc: { "items.$.quantity": product.quantity } }
            );
        } else {
            // Nếu chưa có thì thêm mới
            await database.collection("cart").updateOne(
                { user_id },
                { $push: { items: product } }
            );
        }
    } else {
        // Tạo giỏ hàng mới cho user
        await database.collection("cart").insertOne({
            user_id,
            items: [product],
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    res.json({ message: "Đã thêm sản phẩm vào giỏ hàng." });
});

/* GET: Lay du lieu cart theo user_id. */
router.get('/products/cart/:userId', async function (req, res) {
    const database = await db();
    // Truy cap table cart
    const cart = database.collection('cart');

    // Thực hiện query
    const result = await cart.findOne({ user_id: req.params.userId });

    res.json({ cart: result });
});

module.exports = router;
