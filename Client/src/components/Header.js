function Header({ children }) {
  return (
    <header className="flex flex-start w-full top-0 lg:fixed z-50">
      <div className="w-full">{children}</div>
    </header>
  );
}

export default Header;
