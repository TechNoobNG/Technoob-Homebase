import React, { useContext, useState } from "react";
import { esther } from "../../../data/assets";
import Button from "../../../utility/button";
import {AppContext} from '../../../AppContext/AppContext';
import serverApi from "../../../utility/server";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const [roles, setroles] = useState(false);
  const [permission, setpermission] = useState(true);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    update_params: {
      lastname: "franklin",
      bio: "i am a boy"
    }
  });

  const handleChange = (e) => {
    setUserInfo({...userInfo.update_params, [e.target.name]: e.target.value})
    if(e.target.name === 'employmentHistory'){
      setUserInfo({
        ...userInfo, 
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = { update_params: {
      ...userInfo
    }}

    console.log(data);

    try {
      serverApi.requiresAuth(true)
      const response = await serverApi.post(
          '/user/edit',
          data,
          {
            signal: AbortController.signal,
            headers: {
              'content-type': 'application/json',
            }
          }
      )
      setLoading(false)
      console.log(response);
      // sessionStorage.setItem("userData", response?.data?.data)
      if(response.status === 201){
        toast(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          } );
      }
      
    
      
    
    } catch (error) {
      console.log(error);
      if(error.message === "Network Error"){
        toast(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          } );
      }
      setLoading(false)
      toast(error?.response?.data?.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        } );
    }finally{
      setLoading(false)
    }
  }
  
  const { userData } = useContext(AppContext);

  // console.log('from the profile', userData);

  return (
    <div className="min-h-[100vh] w-full pb-16 rounded-md relative">
      <ToastContainer />
      <div className="bg-slate-50 flex rounded-md flex-col min-h-[100vh] md:gap-8">
        <div className="flex-1 flex flex-col rounded-md max-h-[70vh]">
          <div className="bg-gradient-to-r from-green-400 to-indigo-500 rounded-t-md w-full h-[80px] md:h-[25vh] "></div>
          <div className=" pt-20 pb-10 md:px-20 h-full w-full flex max-sm:gap-4 max-sm:flex-col rounded-b-md bg-white relative">
            <div className=" absolute -top-[20%] max-sm:left-3 sm:-top-[30%] w-[96px] h-[96px] sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center">
              <img
                src={esther}
                alt="page5"
                className="rounded-full w-[95%] h-[95%]"
              />
            </div>
            <div className="flex-[1.4] flex flex-col md:gap-3">
              <div className="flex items-center">
                <h1 className="font-bold text-2xl mr-4 text-black">
                  {userData?.firstname }
                </h1>
                <p className="flex justify-center items-center gap-2 text-sm font-semibold">
                  <span className="w-[5px] h-[5px] bg-green-500 rounded-full"></span>{" "}
                  {userData?.role}
                </p>
              </div>
              <p className="text-slate-400 text-xl">🇳🇬 Lagos, Nigeria</p>
              <div className="flex items-center gap-2">
                <p>@{userData?.username}</p>
                <span className="w-[5px] h-[5px] bg-slate-300 rounded-full"></span>
                <p className="font-semibold text-lg">CEO at Netlife</p>
                <span className="w-[5px] h-[5px] bg-slate-300 rounded-full"></span>
                <p className="text-slate-400">Full time</p>
              </div>
              <Button name={"Share Profile"} />
            </div>
            <div className="h-full flex-1 flex md:justify-end">
           { !edit && <button onClick={() =>setEdit(true)} type='submit' className={`flex justify-start border border-tblue text-tblue w-fit h-fit px-12 py-2 rounded max-sm:w-[335px] max-sm:py-5 max-sm:justify-center`}>
                {edit ? 'Cancel' : 'Edit Profile'}
              </button>}
              {edit && 
                <div className="flex gap-5">
                 {/* <Button name={'Save'}/> */}
                  <button onClick={() =>setEdit(false)} type='submit' className={`flex justify-center items-center border border-tblue text-tblue w-[335px] sm:w-[201px] h-[54px] text-base font-[400] px-12 py-2 rounded`}>
                    Cancel
                  </button>
                </div>
                
              }
            </div>
          </div>
        </div>

        {!edit && (
          <>
            <div className="flex-1 flex flex-col gap-4 rounded-md h-full bg-white md:px-6 py-8">
              <nav className=" border-b-2 w-[100%] flex gap-5 mb-10">
                <div
                  onClick={() => {
                    setpermission(true);
                    setroles(false);
                  }}
                  className={`${
                    permission && "text-tblue"
                  } bg-gray-200 p-3 w-full md:w-[120px] flex justify-center mb-1 cursor-pointer `}
                >
                  Permission
                </div>

                <div
                  onClick={() => {
                    setpermission(false);
                    setroles(true);
                  }}
                  className={`${
                    roles && "text-tblue"
                  } bg-gray-200 p-3 w-full md:w-[120px] flex justify-center mb-1 cursor-pointer `}
                >
                  Roles
                </div>
              </nav>

              {permission && userData?.role === 'super admin' ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="mb-4">Add Admin</p>

                    <div className="flex gap-5">
                      <input
                        type="text"
                        placeholder="Enter Email"
                        className="border-2 px-2 outline-tblue border-slate-300 rounded-md"
                      />
                      <button className="flex justify-start bg-gray-200 max-sm:text-sm w-fit h-fit px-8 py-2 rounded hover:bg-gray-300 transition duration-[0.2s]">
                        Add Admin
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-4">Remove Admin</p>

                    <div className="flex gap-5">
                      <input
                        type="text"
                        placeholder="Enter Email"
                        className="border-2 px-2 outline-tblue border-slate-300 rounded-md"
                      />
                      <button className="flex justify-start bg-gray-200 max-sm:text-sm w-fit h-fit px-8 py-2 rounded hover:bg-gray-300 transition duration-[0.2s]">
                        Add Admin
                      </button>
                    </div>
                  </div>
                </div>
              ) : 
              (
                <div>
                  <h1 className="md:text-2xl">Opps, you do not have clearance to be here.</h1>
                </div>
              )
              }
              {roles && (
                <div className="flex flex-col gap-5">
                  <input
                    value={"Post on job section"}
                    type="text"
                    disabled
                    placeholder="Enter Email"
                    className="border-2 px-3 py-3 md:w-[23rem] bg-gray-200 border-slate-200 text-gray-700 "
                  />
                  <input
                    value={"Access to quiz / competition page"}
                    type="text"
                    disabled
                    placeholder="Enter Email"
                    className="border-2 px-3 py-3 md:w-[23rem] bg-gray-200 border-slate-200 text-gray-700 "
                  />
                  <input
                    value={"Access to dashboard analytics"}
                    type="text"
                    disabled
                    placeholder="Enter Email"
                    className="border-2 px-3 py-3 md:w-[23rem] bg-gray-200 border-slate-200 text-gray-700 "
                  />
                  <input
                    value={"Access to add / revoke admin"}
                    type="text"
                    disabled
                    placeholder="Enter Email"
                    className="border-2 px-3 py-3 md:w-[23rem] bg-gray-200 border-slate-200 text-gray-700 "
                  />
                </div>
              )}
            </div>
          </>
        )}

        {edit && <div className="pb-5 md:px-6 flex bg-white rounded-md">
          <form action="" onSubmit={handleSubmit} className="py-10 flex flex-col w-full">
            <div className="absolute top-[16%] right-[20rem] max-sm:hidden">
            <button  type='submit' className={`flex justify-center items-center border border-tblue bg-tblue text-white  w-[335px] sm:w-[201px] h-[54px] text-base font-[400] px-12 py-2 rounded`}>
                Save
              </button>
            </div>
            <div className="max-sm:flex-col max-sm:gap-3 md:pl-20 flex justify-between items-start w-full">
              <label
                htmlFor="name"
                id="name"
                
                className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
              >
                Name
              </label>
              <div className="md:flex-[2] w-full flex justify-between max-sm:flex-col mb-8 gap-3 md:gap-10">
                <input
                  onChange={handleChange}
                  name='firstname'
                  placeholder="First Name"
                  defaultValue={userData?.firstname }
                  type="text"
                  className="border-2 py-3 px-2 w-full md:w-[20rem] rounded-md outline-tblue"
                />
                <input
                  name='lastName'
                  onChange={handleChange}
                  type="text"
                  placeholder="Last Name"
                  defaultValue={userData?.lastname}
                  className="border-2 py-3 px-2 w-full md:w-[20rem] rounded-md outline-tblue"
                />
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px] my-5 md:my-10" />
            <div className="md:pl-20 flex justify-between max-sm:gap-3 items-start max-sm:flex-col w-full">
              <label
                htmlFor="name"
                id="name"
                className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
              >
                Email
              </label>
              <div className="md:flex-[2] w-full flex md:gap-10 mb-10">
                <input
                  name='email'
                  onChange={handleChange}
                  type="email"
                  defaultValue={userData?.email }
                  placeholder="test@test.com"
                  className="border-2 py-3 px-2 w-full rounded-md outline-tblue"
                />
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px] my-10 " />
            <div className="md:pl-20 flex max-sm:flex-col justify-between max-sm:gap-3 items-start w-full">
              <label
                htmlFor="name"
                id="name"
                className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
              >
                Tech Stack
              </label>
              <div className="md:flex-[2] w-full flex gap-10 mb-10">
                <select
                  onChange={handleChange}
                  id="stack"
                  name="Stack"
                  defaultValue={userData?.stack[0] }
                  placeholder="Tech stack"
                  className="border-2 py-3 px-2 w-full rounded-md outline-tblue"
                >
                  <option selected hidden value={userData?.stack[0] }>{userData?.stack[0] }</option>
                  <option value="Frontend Development">
                    Frontend Development
                  </option>
                  <option value="UI/UX">UI/UX </option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Technical Writing">Technical Writing</option>
                  <option value="Cloud Development">Cloud Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Testing">Software Testing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="SEO">SEO</option>
                </select>
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px] my-10 " />
            <div className="md:pl-20 flex justify-between max-sm:flex-col max-sm:gap-3 items-start w-full">
              <label
                htmlFor="name"
                id="name"
                className="flex-1 text-tblue text-base font-semibold"
              >
                Country
              </label>
              <div className="md:flex-[2] w-full flex gap-10 mb-10">
                <select
                  required
                  onChange={handleChange}
                  name="country"
                  type="text"
                  className="border-2 py-3 px-2 w-full rounded-md outline-tblue"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Nigeria">South Africa</option>
                </select>
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px] my-10 " />
            <div className="md:pl-20 flex max-sm:flex-col max-sm:gap-3 justify-between items-start w-full">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  id="name"
                  className=" text-tblue text-base font-semibold"
                >
                  Bio
                </label>
                <p className="text-slate-400">Write a short introduction</p>
              </div>
              <div className="md:flex-[2] w-full flex gap-10 mb-10">
                <textarea
                  onChange={handleChange}
                  name="bio"
                  required
                  type="text"
                  defaultValue={userData?.bio }
                  placeholder="I am a product manager, based in Lagos, Nigeria. I specialize in UI brand strategy,
                    webflow development...."
                  className="border-2 min-h-[8rem] max-h-[12rem] py-3 px-2 w-full rounded-md outline-tblue"
                />
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[1px] my-10 " />
            <div className=" md:pl-20 flex max-sm:flex-col max-sm:gap-3 justify-between items-start w-full">
              <label
                htmlFor="name"
                id="name"
                className="flex-1 text-tblue text-base font-semibold"
              >
                Employment History
              </label>
              <div className="md:flex-[2] w-full flex flex-col justify-between mb-8 gap-5">
                <div className="flex max-sm:flex-col gap-5">
                  <input
                    onChange={handleChange}
                    name="role"
                    placeholder="Role"
                    type="text"
                    className="border-2 py-3 px-2 md:w-[20rem] rounded-md outline-tblue"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    className="border-2 py-3 px-2 md:w-[20rem] rounded-md outline-tblue"
                  />
                </div>
                <div className="flex max-sm:flex-col gap-5">
                  <input
                    placeholder="Job type"
                    type="text"
                    className="border-2 py-3 px-2 md:w-[20rem] rounded-md outline-tblue"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="border-2 py-3 px-2 md:w-[20rem] rounded-md outline-tblue"
                  />
                </div>
              </div>
            </div>
              <button  type='submit' className={`flex justify-start border border-tblue text-tblue w-fit h-fit px-12 py-2 rounded`}>
                {loading ? "loading" : "Save"}
              </button>
          </form>
        </div>}
      </div>
    </div>
  );
};

export default Profile;
