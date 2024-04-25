const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");

//! ---------------------------------------------------------------------
//? -------------------------------POST create --------------------------
//! ---------------------------------------------------------------------

const createProduct = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    //! -----> ACTUALIZAR INDEXES
    await Product.syncIndexes();

    //! ------> OBTENER EL ID DEL USUARIO AUTENTICADO
    const userId = req.user._id;

    //! ------> INSTANCIAR UN NUEVO PRODUCTO
    const newProduct = new Product({
      ...req.body,
      user: userId,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
    });

    //! -------> VALORAR SI HEMOS RECIBIDO UNA IMAGEN O NO
    if (req.file) {
      newProduct.image = catchImg;
    } else {
      newProduct.image = "https://res.cloudinary.com/dhkbe6djz/image/upload/v1689099748/UserFTProyect/tntqqfidpsmcmqdhuevb.png";
    }

    try {
      //! ------------> VAMOS A GUARDAR LA INSTANCIA DEL NUEVO PRODUCT
      const savedProduct = await newProduct.save();
      if (savedProduct) {
        // Agregar el producto creado al usuario
        await User.findByIdAndUpdate(userId, { $push: { products: savedProduct._id } });
        return res.status(200).json(savedProduct);
      } else {
        return res.status(404).json("No se ha podido guardar el elemento en la DB ❌");
      }
    } catch (error) {
      return (
        res.status(404).json({
          messege: "error general saved Product",
          error: error,
        }) && next(error)
      );
    }
  } catch (error) {
    //! -----> solo entramos aqui en el catch cuando ha habido un error
    req.file?.path && deleteImgCloudinary(catchImg);

    return (
      res.status(404).json({
        messege: "error en el creado del elemento",
        error: error,
      }) && next(error)
    );
  }
};


//! ---------------------------------------------------------------------
//? -------------------------------get by id --------------------------
//! ---------------------------------------------------------------------
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productById = await Product.findById(id);
    if (productById) {
      return res.status(200).json(productById);
    } else {
      return res.status(404).json("no se ha encontrado el producto");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------- get all products of user ------------------------------
//! ---------------------------------------------------------------------


const getAllProductsOfUser = async (req, res, next) => {
  try {
    // Obtener el ID del usuario de la solicitud
    const userId = req.params.userId; // O cualquier otra forma en que recibas el ID del usuario

    // Buscar los productos del usuario específico utilizando el ID del usuario
    const userProducts = await Product.find({ user: userId }).populate("user");

    // Verificar si se encontraron productos para el usuario
    if (userProducts.length > 0) {
      // Devolver los productos encontrados en formato JSON
      return res.status(200).json(userProducts);
    } else {
      // Devolver un mensaje indicando que no se encontraron productos para el usuario
      return res.status(404).json("No se encontraron productos para el usuario");
    }
  } catch (error) {
    // Capturar y manejar cualquier error que ocurra durante la consulta a la base de datos
    return res.status(500).json({
      error: "Error al buscar productos del usuario",
      message: error.message,
    });
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get all ------------------------------
//! ---------------------------------------------------------------------

const getAllProducts = async (req, res, next) => {
  try {
    const allProduct = await Product.find().populate("user");
    console.log(allProduct);
    if (allProduct.length > 0) {
      return res.status(200).json(allProduct);
    } else {
      return res.status(404).json("no se han encontrado Products");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------get by name --------------------------
//! ---------------------------------------------------------------------
const getProductByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    const productByName = await Product.find({ name });
    if (productByName.length > 0) {
      return res.status(200).json(productByName);
    } else {
      return res.status(404).json("no se ha encontrado");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar por nombre capturado en el catch",
      message: error.message,
    });
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------UPDATE -------------------------------
//! ---------------------------------------------------------------------

const updateProduct = async (req, res, next) => {
  await Product.syncIndexes();
  let catchImg = req.file?.path;
  try {
    const { id } = req.params;
    const productById = await Product.findById(id);
    if (productById) {
      const oldImg = productById.image;

      // Convertir la cadena de tags en un array separado por comas
      const updatedTags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : productById.tags;

      const customBody = {
        _id: productById._id,
        image: req.file?.path ? catchImg : oldImg,
        name: req.body?.name ? req.body?.name : productById.name,
        description: req.body?.description ? req.body?.description : productById.description,
        price: req.body?.price ? req.body?.price : productById.price,
        category: req.body?.category ? req.body?.category : productById.category,
        tags: updatedTags,
      };

      // Realiza la actualización del producto
      const updatedProduct = await Product.findByIdAndUpdate(id, customBody, { new: true });

      // Verifica si el producto se actualizó correctamente
      if (!updatedProduct) {
        return res.status(404).json("No se pudo actualizar el producto");
      }

      // Realiza el test de la actualización
      const updatedKeys = Object.keys(req.body);
      const test = {};

      updatedKeys.forEach((item) => {
        test[item] = req.body[item] === updatedProduct[item];
      });

      if (catchImg) {
        updatedProduct.image === catchImg
          ? (test['image'] = true)
          : (test['image'] = false);
      }

      // Devuelve la respuesta con el objeto test y el estado de la actualización
      return res.status(200).json({
        dataTest: test,
        update: true,
        updatedProduct: updatedProduct // Opcional: Devuelve el producto actualizado en la respuesta
      });
    } else {
      return res.status(404).json("Este producto no existe");
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al actualizar el producto",
      message: error.message,
    });
  }
};





//! ---------------------------------------------------------------------
//? -------------------------------DELETE -------------------------------
//! ---------------------------------------------------------------------

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar el producto por ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json("Este producto no existe");
    }

    // Verificar si el usuario autenticado es el propietario del producto
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json("No tienes permiso para eliminar este producto");
    }

    // Eliminar el producto
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (deletedProduct) {
      // Eliminar el producto de la lista de productos del usuario
      try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $pull: { products: id } }, { new: true });
        console.log(updatedUser);
      } catch (error) {
        return res.status(500).json({
          error: "Error al actualizar el usuario",
          message: error.message,
        });
      }

      return res.status(200).json("Producto eliminado exitosamente");
    } else {
      return res.status(404).json("No se pudo eliminar el producto");
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al eliminar el producto",
      message: error.message,
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,
  deleteProduct,
  getAllProductsOfUser,
};
