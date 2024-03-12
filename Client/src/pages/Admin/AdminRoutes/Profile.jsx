import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import Button from "../../../utility/button";
import { AppContext } from "../../../AppContext/AppContext";
import serverApi from "../../../utility/server";
import { ToastContainer } from "react-toastify";
import showToast from "../../../utility/Toast";
import { emptyProfile } from "../../../data/assets/asset/index";
import { avatar } from "../../../data/assets";
import ProfileUpdateNotification from "../../../utility/ProfileUpdateNotification";
import CountryDropdown from "../../../utility/CountryDropdown";
import { AiFillPlusCircle } from "react-icons/ai";
const Profile = () => {
  // const [roles, setroles] = useState(false);
  // const [permission, setpermission] = useState(true);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateParams, setupdateParams] = useState({});
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  // const [firstVisit, setFirstVisit] = useState(true);

  const handleChange = (e) => {
    e.preventDefault();
    setupdateParams({ ...updateParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const differences = {};

    const updateDataValidator = (userData, updateParams) => {
      Object.keys(userData).forEach((key) => {
        if (updateParams.hasOwnProperty(key)) {
          if (
            JSON.stringify(userData[key]) === JSON.stringify(updateParams[key])
          ) {
            delete updateParams[key];
          } else {
            differences[key] = updateParams[key];
          }
        }
      });

      Object.keys(updateParams).forEach((key) => {
        if (!userData.hasOwnProperty(key)) {
          differences[key] = updateParams[key];
        }
      });

      return {
        differences,
        updateParams,
      };
    };

    try {
      updateDataValidator(userData, updateParams);
      if (Object.keys(updateParams).length < 1) {
        throw new Error(
          "No updates detected. Please provide at least one field to update. 🌝"
        );
      }
      setDisplayConfirmation(true);
    } catch (error) {
      showToast({
        message: error.message || "An error ocurred, please contact support.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const sendUpdateRequest = async (updateParams) => {
    setLoading(true);
    try {
      const data = { update_params: { ...updateParams } };

      serverApi.requiresAuth(true);
      const { data: response } = await showToast({
        type: "promise",
        promise: serverApi.post("/user/edit", data, {
          signal: AbortController.signal,
          headers: {
            "content-type": "application/json",
          },
        }),
      });
      const responseData = response?.data;
      const userInfo = {
        ...responseData,
      };
      sessionStorage.setItem("userData", JSON.stringify(userInfo));
      setLoading(false);
      setEdit(false);
    } catch (error) {
      showToast({
        message: error.message || "An error ocurred, please contact support.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      serverApi.requiresAuth(true);
      const response = await serverApi.get("/user/profile", {
        withCredentials: true,
      });
      const responseData = response?.data?.data;
      const userInfo = { ...responseData };
      setUserData(userInfo);
      sessionStorage.setItem("userData", JSON.stringify(userInfo));
    } catch (error) {
      handleFetchError(error);
    }
  };

  const handleFetchError = (error) => {
    showToast({
      message: error.message || "An error occurred, please contact support.",
      type: "error",
    });
  };

  const { userData, setUserData } = useContext(AppContext);

  const fetchData = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      handleFetchError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-[100vh] w-full pb-16 rounded-md relative">
      {displayConfirmation && (
        <ProfileUpdateNotification
          title="Profile Update"
          message="Are you sure you want to update your profile? Changes may affect your account settings."
          updateInfo={updateParams}
          setDisplayConfirmation={setDisplayConfirmation}
          sendUpdateRequest={sendUpdateRequest}
        />
      )}
      <ToastContainer />
      <div className="bg-slate-50 flex rounded-md flex-col min-h-[100vh] md:gap-8">
        <div className="flex-1 flex flex-col rounded-md max-h-[70vh]">
          <div className="bg-gradient-to-r from-green-400 to-indigo-500 rounded-t-md w-full h-[80px] md:h-[25vh] "></div>
          <div className=" pt-20 pb-10 md:px-20 h-full w-full flex max-sm:gap-4 max-sm:flex-col rounded-b-md bg-white relative">
            <div className=" absolute -top-[20%] max-sm:left-3 sm:-top-[30%] w-[96px] h-[96px] sm:w-32 sm:h-32 rounded-full bg-white border flex items-center justify-center cursor-pointer">
              <img
                src={userData?.photo || avatar}
                alt="avatar"
                className="rounded-full w-[95%] h-[95%] object-cover p-1 relative"
              />
              <AiFillPlusCircle className="absolute bottom-0 right-3 text-2xl text-tblue" />
            </div>
            <div className="flex-[1.4] flex flex-col md:gap-3">
              <div className="flex items-center">
                <h1 className="font-bold text-2xl mr-4 text-black">
                  {userData?.firstname}
                </h1>
                <p className="flex justify-center items-center gap-2 text-sm font-semibold">
                  <span className="w-[5px] h-[5px] bg-green-500 rounded-full"></span>{" "}
                  {_.capitalize(userData?.role)}
                </p>
              </div>
              <p className="text-slate-400 text-xl"></p>
              <div className="flex items-center gap-2">
                <p>@{userData?.username}</p>
                {userData?.employmentHistory &&
                  userData?.employmentHistory[0]?.role && (
                    <span className="w-[5px] h-[5px] bg-slate-300 rounded-full"></span>
                  )}
                <p className="font-semibold text-lg">
                  {userData?.employmentHistory &&
                    userData?.employmentHistory[0]?.role}
                </p>
                {userData?.employmentHistory &&
                  userData?.employmentHistory[0]?.jobType && (
                    <span className="w-[5px] h-[5px] bg-slate-300 rounded-full"></span>
                  )}
                <p className="text-slate-400">
                  {userData?.employmentHistory &&
                    userData?.employmentHistory[0]?.jobType}
                </p>
              </div>
              {!edit && <Button name={"Share Profile"} />}
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center ">
                {!edit && (
                  <button
                    onClick={() => setEdit(true)}
                    type="submit"
                    className={`flex justify-start border border-tblue text-tblue w-fit h-fit px-12 py-2 rounded max-sm:w-[335px] max-sm:py-5 max-sm:justify-center mr-5`}
                  >
                    {edit ? "Cancel" : "Edit Profile"}{" "}
                  </button>
                )}
                {edit && (
                  <button
                    type="submit"
                    className={`flex justify-center items-center border border-tblue bg-tblue text-white w-[335px] sm:w-[201px] h-[54px] text-base font-[400] px-12 py-2 rounded`}
                  >
                    Save
                  </button>
                )}
              </div>

              {edit && (
                <div className="flex gap-5">
                  {/* <Button name={'Save'}/> */}
                  <button
                    onClick={() => setEdit(false)}
                    type="submit"
                    className={`flex justify-center items-center border border-tblue text-tblue w-[335px] sm:w-[201px] h-[54px] text-base font-[400] px-12 py-2 rounded`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!edit && (
          <>
            <div className="flex-1 flex flex-col gap-4 rounded-md h-full bg-white md:px-6 py-8">
              <UserProfile userData={userData} />
            </div>
          </>
        )}

        {/* {!edit && (
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
        )} */}

        {edit && (
          <UserProfileForm
            userData={userData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            setupdateParams={setupdateParams}
            updateParams={updateParams}
          />
        )}
      </div>
    </div>
  );
};

const UserProfile = ({ userData }) => {
  return (
    <div className="pb-5 md:px-6 flex bg-white rounded-md">
      <div className="py-10 flex flex-col w-full">
        <div className="max-sm:flex-col max-sm:gap-3 md:pl-20 flex justify-between items-start w-full">
          <label
            htmlFor="name"
            id="name"
            className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
          >
            Name
          </label>
          <div className="md:flex-[2] w-full flex justify-between max-sm:flex-col mb-8 gap-3 md:gap-10">
            <p className="text-base">{`${userData?.firstname} ${userData?.lastname}`}</p>
          </div>
        </div>
        <div className="w-full bg-gray-300 h-[0.5px] my-5 md:my-10" />
        <div className="md:pl-20 flex justify-between max-sm:gap-3 items-start max-sm:flex-col w-full">
          <label
            htmlFor="name"
            id="name"
            className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
          >
            Email
          </label>
          <div className="md:flex-[2] w-full flex md:gap-10 mb-10">
            <p className="text-base">{userData?.email}</p>
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
          <div className="md:flex-[2] w-full flex gap-2 mb-10">
            {userData?.stack &&
              userData.stack.map((tech, index) => (
                <div
                  key={index}
                  className="bg-tblue text-white py-1 px-2 rounded-md"
                >
                  {tech}
                </div>
              ))}
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
            <p className="text-base">{userData?.country}</p>
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
          </div>
          <div className="md:flex-[2] w-full flex gap-10 mb-10">
            <p className="text-base">{userData?.bio}</p>
          </div>
        </div>
        <div className="w-full bg-gray-300 h-[1px] my-10 " />
        <div className="md:pl-20 flex max-sm:flex-col max-sm:gap-3 justify-between items-start w-full ">
          <label
            htmlFor="name"
            id="name"
            className="flex-1 text-tblue text-base font-semibold"
          >
            Employment History
          </label>
          <div className="md:flex-[2] w-full flex flex-col gap-5 ">
            {userData?.employmentHistory &&
              userData.employmentHistory.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md shadow-md mb-4"
                >
                  <div className="mb-2">
                    <strong>Role: </strong> {entry.role}
                  </div>
                  <div className="mb-2">
                    <strong>Company: </strong> {entry.company}
                  </div>
                  <div className="mb-2">
                    <strong>Job Type: </strong> {entry.jobType}
                  </div>
                  <div>
                    <strong>Country: </strong> {entry.country}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfileForm = ({
  userData,
  handleChange,
  handleSubmit,
  loading,
  setupdateParams,
  updateParams,
}) => {
  const [newTechStack, setNewTechStack] = useState(userData?.stack || []);
  const [newEmploymentArray, setNewEmploymentArray] = useState(
    (userData?.employmentHistory || []).map(({ _id, ...rest }) => rest)
  );

  const handleAddTechStackSelection = (e) => {
    e.preventDefault();
    setNewTechStack((prevArray) => {
      const updatedStack = [...new Set([...prevArray, e.target.value])];
      setupdateParams({ ...updateParams, stack: updatedStack });
      return updatedStack;
    });
  };

  const handleRemoveTechStack = (e, index) => {
    e.preventDefault();
    setNewTechStack((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1);
      setupdateParams({ ...updateParams, stack: newArray });
      return newArray;
    });
  };

  const handleAddEmploymentEntry = (e, index) => {
    e.preventDefault();
    setNewEmploymentArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = {
        ...newArray[index],
        [e.target.name.replace(`_${index}`, "")]: e.target.value,
      };
      setupdateParams({ ...updateParams, employmentHistory: newArray });
      return newArray;
    });
  };

  const handleAddEmploymentCountrySelect = (value, index, name) => {
    setNewEmploymentArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = {
        ...newArray[index],
        [name.replace(`_${index}`, "")]: value,
      };
      setupdateParams({ ...updateParams, employmentHistory: newArray });
      return newArray;
    });
  };

  const handleRemoveEmploymentEntry = (e, index) => {
    e.preventDefault();
    setNewEmploymentArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1);
      return newArray;
    });
    setupdateParams({ ...updateParams, employmentHistory: newEmploymentArray });
  };

  return (
    <div className="pb-5 md:px-6 flex bg-white rounded-md">
      <form
        action=""
        onSubmit={handleSubmit}
        className="py-10 flex flex-col w-full"
      >
        <div className="absolute top-[16%] right-[20rem] max-sm:hidden"></div>
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
              name="firstname"
              placeholder="First Name"
              defaultValue={userData?.firstname}
              type="text"
              className="border-2 py-3 px-2 w-full md:w-[20rem] rounded-md outline-tblue"
            />
            <input
              name="lastname"
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
              name="email"
              onChange={handleChange}
              type="email"
              defaultValue={userData?.email}
              placeholder="email"
              className="border-2 py-3 px-2 w-full rounded-md outline-tblue"
            />
          </div>
        </div>
        <div className="w-full bg-gray-300 h-[1px] my-10" />
        <div className="md:pl-20 flex max-sm:flex-col justify-between max-sm:gap-3 items-start w-full">
          <label
            htmlFor="name"
            id="name"
            className="flex-1 text-tblue max-sm:text-2xl text-base font-semibold"
          >
            Tech Stack
          </label>
          <div className="md:flex-[2] w-full flex flex-col gap-4 mb-4">
            {newTechStack &&
              newTechStack.length &&
              newTechStack.map((tech, index) => (
                <div
                  key={index}
                  class="tech-stack-item bg-gray-200 p-4 flex items-center justify-between"
                >
                  <span class="mr-4">{tech}</span>
                  <button
                    type="button"
                    class="ml-4"
                    onClick={(e) => handleRemoveTechStack(e, index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
          <div className="md:flex-[2] w-full px-3 flex gap-4 pl-10">
            <select
              onChange={handleAddTechStackSelection}
              id="stack"
              name="stack"
              className="border-2 py-3 px-2 w-full rounded-md outline-tblue"
            >
              <option value="" disabled>
                Select Tech Stack
              </option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="UI/UX">UI/UX </option>
              <option value="Backend Development">Backend Development</option>
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
            <CountryDropdown
              defaultCountry={userData?.country}
              onSelect={(value) => {
                setupdateParams({ ...updateParams, country: value });
              }}
              className="border-2 py-3 px-2  rounded-md outline-tblue"
              name="country"
              id="country"
            />
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
              defaultValue={userData?.bio}
              placeholder="I am a product manager, based in Lagos, Nigeria. I specialize in UI brand strategy,
                    webflow development...."
              className="border-2 min-h-[8rem] max-h-[12rem] py-3 px-2 w-full rounded-md outline-tblue"
            />
          </div>
        </div>

        <div className="w-full bg-gray-300 h-[1px] my-10" />
        <div className="md:pl-20 flex max-sm:flex-col max-sm:gap-3 justify-between items-start w-full">
          <label
            htmlFor="name"
            id="name"
            className="flex-1 text-tblue text-base font-semibold"
          >
            Employment History
          </label>

          <div className=" flex-[2]">
            {(newEmploymentArray &&
              newEmploymentArray.length &&
              newEmploymentArray.map((entry, index) => (
                <div key={index} className="flex flex-col gap-5 pb-10">
                  <div className="flex max-sm:flex-col gap-5 ">
                    <input
                      onChange={(e) => handleAddEmploymentEntry(e, index)}
                      name={`role_${index}`}
                      placeholder="Role"
                      type="text"
                      defaultValue={entry.role}
                      className="border-2 py-3 px-2 md:w-[50%] rounded-md outline-tblue"
                    />
                    <input
                      name={`company_${index}`}
                      onChange={(e) => handleAddEmploymentEntry(e, index)}
                      type="text"
                      placeholder="Company"
                      defaultValue={entry.company}
                      className="border-2 py-3 px-2 md:w-[50%] rounded-md outline-tblue"
                    />
                  </div>
                  <div className="flex max-sm:flex-col gap-5">
                    <input
                      onChange={(e) => handleAddEmploymentEntry(e, index)}
                      name={`jobType_${index}`}
                      placeholder="Job type"
                      type="text"
                      defaultValue={entry.jobType}
                      className="border-2 py-3 px-2 md:w-[50%] rounded-md outline-tblue"
                    />
                    <CountryDropdown
                      defaultCountry={entry.country}
                      onSelect={handleAddEmploymentCountrySelect}
                      className=" rounded-md outline-tblue  md:w-[50%]"
                      name={`country_${index}`}
                      propIndex={index}
                    />
                  </div>
                  <div class="flex justify-center items-center">
                    <button
                      type="button"
                      class="border border-tblue text-tblue px-7 py-1 rounded"
                      onClick={(e) => handleRemoveEmploymentEntry(e)}
                    >
                      Remove Entry
                    </button>
                  </div>
                </div>
              ))) ||
              null}

            <div className="md:flex-[2] w-full flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setNewEmploymentArray((prevArray) => [
                    ...prevArray,
                    {
                      role: "",
                      company: "",
                      jobType: "",
                      country: "",
                    },
                  ]);
                }}
                className="border-2 py-3 px-2 rounded-md bg-tblue text-white"
              >
                Add a New Experience
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`ml-20 flex justify-start border border-tblue text-tblue w-fit h-fit px-12 py-2 rounded`}
        >
          {loading ? "loading" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
