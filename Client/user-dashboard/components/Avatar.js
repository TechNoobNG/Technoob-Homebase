function Avatar() {
  return (
    <picture className="flex items-center w-[3.5rem] h-[3.5rem] rounded-full overflow-hidden">
      <source srcset="./img/hood_cat.jpg" className="w-full" />
      <img src="./img/hood_cat.jpg" alt="user avatar" className="w-full" />
    </picture>
  );
}

export default Avatar;
