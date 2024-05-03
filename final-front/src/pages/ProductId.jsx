import { useEffect, useState } from "react";
import { productsById, updateProduct, deleteProduct } from "../services/product.service";
import { useForm } from "react-hook-form";
import { useUpdateProductError, useDeleteProduct } from "../hooks";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import "./ProductId.css";

export const ProductId = ({ productId }) => {
  const [res, setRes] = useState({});
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { register, handleSubmit } = useForm();
  const [resUpdate, setResUpdate] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsById(productId);
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    useUpdateProductError(resUpdate, setResUpdate);
  }, [resUpdate]);

  const handleUpdate = async (data) => {
    try {
      setUpdating(true);
      await updateProduct(productId, data);
      const updatedProductData = await productsById(productId);
      setProduct(updatedProductData);
      setResUpdate({ status: 200 });
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response && error.response.status !== 200) {
        setResUpdate({ status: error.response.status });
      }
    } finally {
      setUpdating(false);
    }
  };

  //const handleDeleteProduct = () => useDeleteProduct(productId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="containerProfile">
      <div className="containerDataNoChange">
        <div className="product-card">
              <img src={product.image} alt={product.name} className="card-img-top" />
              <div className="card-info">
                <h4 className="card-title">{product.name}</h4>
                <span>{product.price} €</span>
              </div>
              <div className="card-description">
                <p>{product.description}</p>
              </div>
              <div className="card-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
        </div>
      </div>
      <div className="form-wrap formProfile">
      <h1>Edit your product ♻</h1>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className="user_container form-group">
            <input className="input_user" type="text" defaultValue={product.name} {...register("name")} />
            <input className="input_user" type="text" defaultValue={product.description} {...register("description")} />
            <input className="input_user" type="number" defaultValue={product.price} {...register("price")} />
            <div className="btn_container">
              <button className="btn" type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Product"}
              </button>
            </div>
        </div>
        </form>
        <div className="btn_container">
          <button className="btn" onClick={() => useDeleteProduct(productId, product, setProduct)}>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};