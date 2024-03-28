import serverApi from "./server";

const uploadFile = async (file, type, params) => {
  try {
    const formData = new FormData();
    formData.append(type, file);
    serverApi.requiresAuth(true);

    const response = await serverApi.post(type === "image" ? "/utils/upload-image" : "/utils/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadFile;
