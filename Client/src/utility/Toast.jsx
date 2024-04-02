import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const promisify = (promise) => {
  return promise
    .then((response) => {
      return { data: response.data, status: "success" };
    })
    .catch((err) => {
      if (err.response) {
        throw { err: err.response, status: "error" };
      } else if (err.request) {
        throw { err: "No response received", status: "error" };
      } else {
        throw { err: "Request setup error", status: "error" };
      }
    });
};
const Toast = ({ message, type = "info", position, autoClose, promise, promiseMessage }) => {
  if (type === "promise") {
    const {
      pending = "⏳ Hang tight, getting things ready for you...",
      success = "🎉 Awesome, it worked like a charm!",
      error = "😓 Uh-oh, we hit a bump in the road!",
    } = promiseMessage || {};
    return toast.promise(promisify(promise), {
      pending: pending,
      success: {
        render({ data }) {
          return data.data.message || success;
        },
        icon: "🤖",
      },
      error: {
        render({ data: { err } }) {
          console.log(err);
          return err?.data?.message || err?.data?.error || error;
        },
        icon: "🚨",
      },
    });
  } else {
    return toast[type](message, {
      position: position || "top-center",
      autoClose: autoClose || 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

const showToast = ({ message, type = "info", position, autoClose, promise, promiseMessage }) => {
  return Toast({
    message,
    type,
    position,
    autoClose,
    promise,
    promiseMessage,
  });
};

export default showToast;
