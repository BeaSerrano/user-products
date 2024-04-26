import { ProductId } from "../pages";
import { useParams } from "react-router-dom";

export const ProductIdRoute = () => {
    const { productId } = useParams(); // Obtener el ID del producto de los parámetros de la URL
    return <ProductId productId={productId} />;
};