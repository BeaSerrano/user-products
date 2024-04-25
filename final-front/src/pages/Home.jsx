import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { productsAll, productsByName } from "../services/product.service";
import "./Home.css";

export const Home = () => {
  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (data) => {
    setSearchTerm(data.search);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (searchTerm) {
          response = await productsByName({ name: searchTerm }); // Quitamos el objeto params
        } else {
          response = await productsAll();
        }
        if (response && response.data) {
          setProducts(response.data);
        } else {
          throw new Error("No se han encontrado productos");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  return (
    
    <>
    <div className="homeContainer">
      <div className="formSearch form-wrap">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="search_container">
            <div className="user_container marginTopNo form-group">
              <input
                type="text"
                placeholder="Quiero..."
                {...register("search")}
              />
            </div>
            <div className="btn_container">
              <button className="btn marginTopNo" type="submit"> Search </button>
            </div>
          </div>
        </form>
      </div>
      <div className="gallery">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} className="card-img-top" />
              <h4 className="card-title">{product.name}</h4>
              <div>
                <span className="card-text">Price: {product.price}</span>
              </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};
