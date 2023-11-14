import { useReducer } from "react";

const initialState = {
  name: "Files",
  isLoading: false,
  data: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { isLoading: true };
    case "dataLoaded":
      return { name: "Files", isLoading: false, data: action.payload };
    case "rejected":
      return { name: "Files", isLoading: false, data: action.payload };
    default:
      throw new Error("unknown action type");
  }
}

function useUserDetails() {
  const [userDetails, dispatch] = useReducer(reducer, initialState);
  return { userDetails, dispatch };
}

export default useUserDetails;
