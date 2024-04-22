const { upload } = require("../../middleware/files.middleware");
const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct
} = require("../controllers/Product.controllers");

const ProductRoutes = require("express").Router();

ProductRoutes.post("/", upload.single("image"), createProduct);
ProductRoutes.get("/:id", getProductById);
ProductRoutes.get("/", getAllProducts);
ProductRoutes.get("/byName/:name", getProductByName);
ProductRoutes.patch("/:id", upload.single("image"), updateProduct);
ProductRoutes.delete("/:id", deleteProduct);

module.exports = ProductRoutes;