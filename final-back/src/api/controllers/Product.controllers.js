const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const enumOk = require("../../utils/enumOk");
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
      return res.status(404).json("error general saved Product");
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
//? -------------------------------get all ------------------------------
//! ---------------------------------------------------------------------

const getAllProducts = async (req, res, next) => {
  try {
    const allProduct = await Product.find().populate("user");
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

      const customBody = {
        _id: productById._id,
        image: req.file?.path ? catchImg : oldImg,
        name: req.body?.name ? req.body?.name : productById.name,
      };

      //* CAMBIAR A CATEGORIAS */
      if (req.body?.gender) {
        const resultEnum = enumOk(req.body?.gender);
        customBody.gender = resultEnum.check
          ? req.body?.gender
          : characterById.gender;
      }

      try {
        await Product.findByIdAndUpdate(id, customBody);
        if (req.file?.path) {
          deleteImgCloudinary(oldImg);
        }

        //** ------------------------------------------------------------------- */
        //** VAMOS A TESTEAR EN TIEMPO REAL QUE ESTO SE HAYA HECHO CORRECTAMENTE */
        //** ------------------------------------------------------------------- */

        // ......> VAMOS A BUSCAR EL ELEMENTO ACTUALIZADO POR ID

        const productByIdUpdate = await Product.findById(id);

        // ......> me cojer el req.body y vamos a sacarle las claves para saber que elementos nos ha dicho de actualizar
        const elementUpdate = Object.keys(req.body);

        /** vamos a hacer un objeto vacion donde meteremos los test */

        let test = {};

        /** vamos a recorrer las claves del body y vamos a crear un objeto con los test */

        elementUpdate.forEach((item) => {
          if (req.body[item] === productByIdUpdate[item]) {
            test[item] = true;
          } else {
            test[item] = false;
          }
        });

        if (catchImg) {
          productByIdUpdate.image === catchImg
            ? (test = { ...test, file: true })
            : (test = { ...test, file: false });
        }

        /** vamos a ver que no haya ningun false. Si hay un false lanzamos un 404,
         * si no hay ningun false entonces lanzamos un 200 porque todo esta correcte
         */

        let acc = 0;
        for (clave in test) {
          test[clave] == false && acc++;
        }

        if (acc > 0) {
          return res.status(404).json({
            dataTest: test,
            update: false,
          });
        } else {
          return res.status(200).json({
            dataTest: test,
            update: true,
          });
        }
      } catch (error) {}
    } else {
      return res.status(404).json("este producto no existe");
    }
  } catch (error) {
    return res.status(404).json(error);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------DELETE -------------------------------
//! ---------------------------------------------------------------------

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      // lo buscamos para vr si sigue existiendo o no
      const finByIdProduct = await Product.findById(id);

      try {
        const test = await User.updateMany(
          { products: id },
          { $pull: { products: id } }
        );
        console.log(test);
        //** ESTO SE BORRA PORQUE CREO QUE SON LOS FAVORITOS */
        /* try {
          await User.updateMany(
            { charactersFav: id },
            { $pull: { charactersFav: id } }
          );

          return res.status(finByIdCharacter ? 404 : 200).json({
            deleteTest: finByIdCharacter ? false : true,
          });
        } catch (error) {
          return res.status(404).json({
            error: "error catch update User",
            message: error.message,
          });
        } */
      } catch (error) {
        return res.status(404).json({
          error: "error catch update User",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,
  deleteProduct,
};
