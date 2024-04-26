import Swal from "sweetalert2/dist/sweetalert2.all.js";
export const useUpdateError = (res, setRes, setUser, logout, userlogin) => {
  //!---------------------------------------> 200
  let contador;
  if (res?.data) {
    contador = 0;
    res?.data?.testUpdate?.map((item) => {
      for (let clave in item) {
        if (item[clave] == false) {
          contador++;
        }
      }
    });
  }

  if (contador == 0) {
    let check = "";

    res?.data?.testUpdate?.forEach((item) => {
      for (let clave in item) {
        if (item[clave] == true) {
          check += `-${clave}-`;
        }
      }
    });
    if (res?.status == 200) {
      const currentUser = localStorage.getItem("user");
      const parseUser = JSON.parse(currentUser);
      const customUser = {
        ...parseUser,
        name: res?.data?.updateUser?.name,
        image: res?.data?.updateUser?.image,
      };

      const stringUser = JSON.stringify(customUser);
      // llamamos a la funcion de login para resetear que el check esta a true
      userlogin(stringUser);

      setRes(() => ({}));
      return Swal.fire({
        icon: "success",
        title: `Update data user✅`,
        text: ` Update: ${check} `,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  //! -------------------------------------> 404 general y el 500

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

  if (contador != 0) {
    if (res?.status == 200) {
      setRes(() => ({}));
      return Swal.fire({
        icon: "error",
        title: `Error update data user ❌`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};
