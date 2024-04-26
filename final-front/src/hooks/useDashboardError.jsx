import { useState } from "react";
import Swal from "sweetalert2";

export const useDashboardError = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const handleDashboardError = (error) => {
        if (error.response) {
        const status = error.response.status;
        if (status === 404) {
            setErrorMessage("No se encontraron productos para el usuario.");
        } else if (status === 500) {
            setErrorMessage("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
        } else {
            setErrorMessage("Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.");
        }
        } else {
        setErrorMessage("No se ha recibido respuesta del servidor. Por favor, verifica tu conexión.");
        }
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        });
    };

    const clearDashboardError = () => {
        setErrorMessage("");
    };

    return {
        errorMessage,
        handleDashboardError,
        clearDashboardError
    };
};

