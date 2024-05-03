import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { createProduct } from "../services/product.service";
import { Uploadfile } from "../components";
import { useCreateProductError } from "../hooks";

export const CreateProduct = () => {
    const { register, handleSubmit } = useForm();
    const [res, setRes] = useState({});
    const [send, setSend] = useState(false);
    const [okCreate, setOkCreate] = useState(false);

    const formSubmit = async (formData) => {
        setSend(true);
        setRes(await createProduct(formData));
        setSend(false);
    };

    useEffect(() => {
        console.log(res);
        useCreateProductError(res, setOkCreate, setRes)
    }, [res]);

    if (okCreate) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <>
            <div className="form-wrap">
                <h1>Create Product</h1>
                <p>Add your product details below.</p>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="product_container form-group">
                        <input
                            className="input_product"
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="false"
                            {...register("name", { required: true })}
                        />
                        <label htmlFor="name" className="custom-placeholder">
                            Product Name
                        </label>
                    </div>
                    <div className="description_container form-group">
                        <textarea
                            className="input_product"
                            id="description"
                            name="description"
                            autoComplete="false"
                            {...register("description", { required: true })}
                        ></textarea>
                        <label htmlFor="description" className="custom-placeholder">
                            Product Description
                        </label>
                    </div>
                    <div className="price_container form-group">
                        <input
                            className="input_product"
                            type="number"
                            id="price"
                            name="price"
                            autoComplete="false"
                            {...register("price", { required: true })}
                        />
                        <label htmlFor="price" className="custom-placeholder">
                            Product Price
                        </label>
                    </div>
                    <div className="category_container form-group">
                        <select
                            className="input_product"
                            id="category"
                            name="category"
                            {...register("category", { required: true })}
                        >
                            <option value="">Select Category</option>
                            <option value="vehiculos">Vehiculos</option>
                            <option value="electronica">Electronica</option>
                            <option value="casa">Casa</option>
                            <option value="ropa y complementos">Ropa y Complementos</option>
                            <option value="mascotas">Mascotas</option>
                            <option value="otros">Otros</option>
                        </select>
                        <label htmlFor="category" className="custom-placeholder">
                            Category
                        </label>
                    </div>
                    <Uploadfile />
                    <div className="btn_container">
                        <button
                            className="btn"
                            type="submit"
                            disabled={send}
                            style={{ background: send ? "#fe46c5" : "#ffd819" }}
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
