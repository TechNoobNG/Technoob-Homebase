import { useState } from "react";
import img from "../img/threeinone.jpg";
import showToast from "../../../../utility/Toast";
import serverApi from "../../../../utility/server";

const Footer = () => {
  const [email, setEmail] = useState("");

  const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (regEx.test(email) === false) {
      showToast({
        message: "Please enter a valid email.",
        type: "error",
      });
    } else {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          email,
        });

        await serverApi.post("user/mailing-list",raw,{
          headers: {
            "content-type": "application/json",
          },
        })
        showToast({
          message: "Thank you for reaching out, We will revert to you soon.",
          type: "info",
        })
      } catch (error) {
        showToast({
          message: error.message || "An error ocurred, please contact support.",
          type: "error",
        });
      }

      setEmail("");
    }
  };
  return (
    <footer className="flex items-center justify-center flex-col px-5 text-center bg-twhitee py-10">
      <img src={img} alt="" className="mx-auto h-20 w-50" />
      <div className=" py-5">
        <h4 className="font-bold text-lg">
          <span className=" text-tblue">Stay </span>
          <span className=" text-tgreen">in the loop</span>
        </h4>
        <p className=" text-[#667085] nun">
          want to be the first to know when we have exciting news? subscribe to our list
        </p>
      </div>
      <form className="w-[70%] flex">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className=" rounded m-1 ring-1 border w-full px-10 py-4 placeholder:italic"
        />
        <button type="submit" onClick={handleClick} className=" rounded px-24 py-4 m-1 bg-tblue text-twhite">
          Subscribe
        </button>
      </form>
    </footer>
  );
};

export default Footer;
