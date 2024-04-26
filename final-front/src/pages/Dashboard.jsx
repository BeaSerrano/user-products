import "./Dashboard.css";
import { useState, useEffect } from "react";
import { productsByUser } from "../services/product.service";
import { useDashboardError } from "../hooks/useDashboardError";
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const { handleDashboardError } = useDashboardError();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem('user')); 
        const productsUser = await productsByUser(userLocal._id);
        setProducts(productsUser);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        console.error("Detalles del error:", error.response.data); // Imprimir detalles del error
      }
    };

    fetchProducts();
  }, [handleDashboardError]);
  

  return (
    <>
      <div className="homeContainer">
        <div className="gallery">
          {Array.isArray(products) && products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-link">
            <div key={product._id} className="product-card">
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
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
