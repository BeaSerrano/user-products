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
export const productsById = async (formData) => {
  return APIuser.get("/products/:id", formData)
    .then((res) => res)
    .catch((error) => error);
};

//! ----------------------------- GET ALL PRODUCTS -----------------------
export const productsAll = async (formData) => {
  return APIuser.get("/products/", formData)
    .then((res) => res)
    .catch((error) => error);
};

//! ----------------------- GET ALL PRODUCTS OF USER -----------------------
export const productsByUser = async (formData) => {
  return APIuser.get("/products/:userId/products", formData, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! --------------------------- GET PRODUCT BY NAME -----------------------
export const productsByName = async (formData) => {
  return APIuser.get("/products/byName/:name", formData)
    .then((res) => res)
    .catch((error) => error);
};

//! --------------------------- UPDATE PRODUCT -----------------------
export const updateProduct = async (formData) => {
  return APIuser.patch("/products/update/:id", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! --------------------------- DELETE PRODUCT -----------------------
export const deleteProduct = async () => {
  return APIuser.delete("/products/", {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
