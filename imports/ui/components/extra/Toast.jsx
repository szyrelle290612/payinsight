import { toast } from "react-toastify";

// learn more about toast here
// https://fkhadra.github.io/react-toastify/positioning-toast

export const Toast = ({ text = "", position = "TOP_RIGHT", type = "success", autoClose = 4000 }) => {
    toast[type](text, {
        position: toast.POSITION[position],
        autoClose,
    });
};
