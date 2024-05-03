import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useUpdateProductError = (res, setRes) => {
  if (res?.status === 200) {
    setRes(() => ({}));
    return Swal.fire({
      icon: "success",
      title: "Product updated successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } 
  if (res?.response?.status == 500 || res?.response?.status == 404) {
    setRes(() => ({}));
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Interval Server Error! Don't update user ❎ ",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
