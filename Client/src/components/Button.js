function Button({ children, type, onclick }) {
  return (
    <button
      className={`flex items-center justify-center rounded-md py-3 ${
        type === "cta"
          ? "bg-[#5E7CE8] rounded-md text-[#fff] py-3 py-1 px-[2.5rem]"
          : "bg-[#eee] rounded-md text-[#333] py-3 px-[2.1rem]"
      }`}
    >
      {/* <button className="w-[335px] sm:w-[201px] h-[50px] bg-[#5E7CE8] rounded-md text-white py-4 px-3.5"> */}
      {children}
    </button>
  );
}

export default Button;
