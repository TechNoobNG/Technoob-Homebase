function AdminHeader({ children }) {
  return (
    <header className="flex flex-start h-full w-full top-0  z-50">
      <div className="w-full h-full">{children}</div>
    </header>
  );
}

export default AdminHeader;
