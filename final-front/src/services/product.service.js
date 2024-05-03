import { updateToken } from "../utils";
import { APIuser } from "./serviceApiUse.config";


//! ------------------------------- CREATE PRODUCT ------------------------
export const createProduct = async (formData) => {
  return APIuser.post("/products/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ----------------------------- GET PRODUCT BY ID -----------------------

export const productsById = async (productId) => {
  try {
    const response = await APIuser.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//! ----------------------------- GET ALL PRODUCTS -----------------------
export const productsAll = async (formData) => {
  return APIuser.get("/products/", formData)
    .then((res) => res)
    .catch((error) => error);
};

//! ----------------------- GET ALL PRODUCTS OF USER -----------------------
export const productsByUser = async (formData) => {
  try {
    const userId = formData; // Asumiendo que formData ya contiene el userId
    const response = await APIuser.get(`/products/${userId}/products`, {
      headers: {
        Authorization: `Bearer ${updateToken()}`,
      },
    });
    return response.data; // Devolver solo los datos de la respuesta
  } catch (error) {
    throw error; // Lanzar el error para que se maneje en el componente
  }
};


//! --------------------------- GET PRODUCT BY NAME -----------------------
export const productsByName = async (formData) => {
  return APIuser.get("/products/byName/:name", formData)
    .then((res) => res)
    .catch((error) => error);
};

//! --------------------------- UPDATE PRODUCT -----------------------

export const updateProduct = async (productId, formData) => {
  return APIuser.patch(`/products/update/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! --------------------------- DELETE PRODUCT -----------------------

export const deleteProduct = async (productId) => {
  return APIuser.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
