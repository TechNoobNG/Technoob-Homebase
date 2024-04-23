import { useContext, useState } from "react";
import { SignUPIMG } from "../../data/assets";
import InputField from "../../utility/InputField";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext/AppContext";
import serverApi from "../../utility/server";
import showToast from "../../utility/Toast";

const SignUp = () => {
  const { setIsLoggedIn, setUserProfile, defaults: { stacks } } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PasswordConfirm: "",
    Username: "",
    TechStack: [],
    PhoneNumber: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "Tech Stack") {
      setForm({ ...form, [e.target.name.split(" ").join().replace(",", "")]: [e.target.value] });
    } else {
      setForm({ ...form, [e.target.name.split(" ").join().replace(",", "")]: e.target.value });
    }
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    var raw = {
      firstname: form.FirstName,
      lastname: form.LastName,
      password: form.Password,
      passwordConfirm: form.ConfirmPassword,
      email: form.Email,
      username: form.Username,
      stack: form.TechStack,
    };

    if (form.Password !== form.ConfirmPassword) showToast({
      message: "Passwords do not match",
      type: "error"
    });
    else {
      setLoading(true);
      const abortController = new AbortController();
      try {
        await showToast({
          type: "promise",
          promise: serverApi.post("authenticate/register", raw, {
            signal: abortController.signal,
            headers: {
              "content-type": "application/json",
            },
          }),
        });
        const { data: loginResponse } = await showToast({
          type: "promise",
          promise: serverApi.post("/authenticate/login/", 
            JSON.stringify({
              password: form.Password,
              username: form.Username,
            }), {
            signal: abortController.signal,
            headers: {
              "content-type": "application/json",
            },
          }),
        });
  
        const responseData = loginResponse?.data;
        const token = loginResponse?.token;
        const userInfo = {
          ...responseData,
        };
        setUserProfile(userInfo.user);
        setLoading(false);
        setIsLoggedIn(true);
        sessionStorage.setItem("userData", JSON.stringify(userInfo.user));
        sessionStorage.setItem("user_token", token);
        navigate("/dashboard");
        
      } catch ({err}) {
        showToast({
          message: err.data?.error,
          type: "error"
        });
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    setForm({ ...form });
  };

  return (
    <section>
      <header className="uni text-center md:text-6xl text-3xl font-bold md:py-20 py-10">
        <span className=" text-tblue">Sign</span>
        <span className="text-tgreen"> UP</span>
      </header>

      <div className=" md:flex flex-auto w-screen block md:px-20 md:py-5 nun mb-20 justify-center">
        <img src={SignUPIMG} alt="Sign-Up" className=" xl:block hidden w-[50%]" />

        <form onSubmit={handleSubmit} className="block bgcontact lg:p-20 p-5 w-full gap-4 rounded xl:w-[50%] ">
          <InputField type={"text"} name={"First Name"} placeholder={"First Name"} onChange={handleChange} />
          <InputField type={"text"} name={"Last Name"} placeholder={"Last Name"} onChange={handleChange} />
          <InputField type={"text"} name={"Username"} placeholder={"Username"} onChange={handleChange} />
          <InputField type={"email"} name={"Email"} placeholder={"Email"} onChange={handleChange} />
          <div className="mb-4">
            <label className="text-2xl font-semibold px-4 " htmlFor="stack">
              Choose a Tech Stack
            </label>
            <select
              defaultValue={"Frontend Development"}
              id="stack"
              name="Tech Stack"
              onChange={handleChange}
              placeholder="Tech stack"
              className="w-full text-lg rounded-xl m-1 border placeholder:pl-2 px-2 py-4 outline-0 ring-1 bg-white"
            >
               {stacks.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
            </select>
          </div>

          {/* <div className="mb-5">
            <button
              name={"Login"}
              className="flex justify-center items-center text-[#111111] bg-[#EFF0F5] rounded-md mb-2 py-3 px-3.5 text-base font-[600]"
            >
              Take Short Quiz
            </button>
            <p className="text-[#828282] text-sm">This Quiz is to help in choosing Tech Stack</p>
          </div> */}
          <InputField type={"password"} name={"Password"} placeholder={"Password"} onChange={handleChange} />
          <InputField
            type={"password"}
            name={"Confirm Password"}
            placeholder={"Confirm Password"}
            onChange={handleChange}
          />
          <button type="submit" className=" bg-tblue text-twhite py-[14px] lg:w-[100%] w-[100%] rounded">
            {loading ? "Siging Up..." : "Sign Up"}
          </button>
          <p className="ml-5 pt-10 text-md sm:text-base sm:text-center">
            Already have an account?{" "}
            <span className="text-tblue text-base sm:text-lg underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
