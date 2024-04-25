const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {type: String, required: false,},
    tags: [{ type: String }],
    category: { type: String, enum: ['vehiculos', 'electronica', 'casa', 'ropa y complementos', 'mascotas', 'otros'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
