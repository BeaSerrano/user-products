const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");

const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct,
    getAllProductsOfUser
} = require("../controllers/Product.controllers");

const ProductRoutes = require("express").Router();

ProductRoutes.post("/", isAuth, upload.single("image"), createProduct);
ProductRoutes.get("/:id", getProductById);
ProductRoutes.get("/", getAllProducts);
ProductRoutes.get("/:userId/products", isAuth, getAllProductsOfUser);
ProductRoutes.get("/byName/:name", getProductByName);
ProductRoutes.patch("/:id", upload.single("image"), updateProduct);
ProductRoutes.delete("/:id", isAuth, deleteProduct);

module.exports = ProductRoutes;