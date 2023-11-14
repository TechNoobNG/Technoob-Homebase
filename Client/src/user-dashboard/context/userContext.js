import { createContext, useEffect } from "react";
import useUserDetails from "../hooks/useUserDetail";

const UserContext = createContext();

function UserProvider({ children }) {
  const { userDetails, dispatch } = useUserDetails();
  const BASE_URL = `http://technoobstaging-env.eba-izgw9fe4.eu-west-2.elasticbeanstalk.com`;

  useEffect(
    function () {
      async function fetchUserOverview() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/api/v1/user/dashboard`, {
            headers: { Authorization: `Bearer ${process.env.REACT_APP_TOKEN}` },
          });
          // const res = await fetch("http://localhost:8000/data");

          if (!res.ok) throw new Error("User data failed to load");

          const user = await res.json();

          dispatch({ type: "dataLoaded", payload: user });
        } catch (error) {
          dispatch({ type: "rejected", payload: error.message });
          console.log(error.message);
        }
      }

      fetchUserOverview();
    },
    [BASE_URL, dispatch]
  );

  async function fetchQuiz(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/api/v1/quizzes/get/${id}`, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_TOKEN}` },
      });

      if (!res.ok) throw new Error("Quiz data failed to load");
      const quiz = await res.json();

      dispatch({ type: "dataLoaded", payload: quiz });
    } catch (error) {
      dispatch({ type: "rejected", payload: error });
    }
  }

  return (
    <UserContext.Provider value={{ ...userDetails, fetchQuiz }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
