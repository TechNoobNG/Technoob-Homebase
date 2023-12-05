import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const promisify = (promise) => {
  return promise.then((response) => {
    return { data: response, status: 'success' };
  }).catch((err) => {
    if (err.response) {
      throw { err: err.response, status: 'error' };
    } else if (err.request) {
      throw { err: 'No response received', status: 'error' };
    } else {
      throw { err: 'Request setup error', status: 'error' };
    }
  });
};
const Toast = ({ message, type = 'info', position, autoClose, promise ,promiseMessage }) => {
  if (type = 'promise') {
    const {
      pending =  'Loading',
      success = 'Successful',
      error = 'Failed' }
      = promiseMessage || {}
    return toast.promise(
      promisify(promise),
    {
      pending: {
        render(){
          return pending
        },
        icon: false,
      },
      success: {
        render({data}){
          return data.message || success
        },
        icon: "🟢",
      },
      error: {
        render({data: {err}}) {
          console.log("in toast------", err)
          return err?.data?.message || err?.data?.error || error;
        },
        icon: "🚨",
      }
    }
)
  } else {
    return toast[type](message, {
    position: position || 'top-center',
    autoClose: autoClose || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
  }


};

const showToast = ({ message, type = 'info', position, autoClose, promise ,promiseMessage }) => {
  return Toast({
    message,
    type,
    position,
    autoClose,
    promise,
    promiseMessage
  });
};

export default showToast;
