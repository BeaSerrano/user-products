import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { deleteProduct } from "../services/product.service";
import { Navigate } from "react-router-dom";

export const useDeleteProduct = (productId, product, setProduct) => {
  Swal.fire({
    title: "Are you sure you want to delete your product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(73, 193, 162)",
    cancelButtonColor: "#d33",
    confirmButtonText: "YES",
  }).then(async (result) => {
    console.log("result", result);

    if (result.isConfirmed) {
      const res = await deleteProduct(productId);

      switch (res.status) {
        case 200:
          Swal.fire({
            icon: "success",
            title: "Delete product",
            text: "See you soon",
            showConfirmButton: false,
            timer: 1500,
          });

          setProduct(() => null);
          break;

        default:
          Swal.fire({
            icon: "error",
            title: "No delete product ❎",
            text: "Please, try again",
            showConfirmButton: false,
            timer: 1500,
          });

          break;
      }
    }
  });
};
