const Checks = ({ passOptions, handleBox1Change, box1 }) => {
  return (
    passOptions.name && (
      <div className="p-2">
        <div className=" rounded-lg">
          {passOptions.values[0] !== null &&
            passOptions.values.map((value, i) => {
              return (
                <div key={i} className="text-sm p-1.5 pl-4 hover:bg-[#F0F4FE] rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    value={value}
                    onChange={handleBox1Change}
                    checked={box1.includes(value)}
                    id={value}
                  />
                  <label className="px-2" htmlFor={value}>
                    {value}
                  </label>
                </div>
              );
            })}
        </div>
      </div>
    )
  );
};

export default Checks;
