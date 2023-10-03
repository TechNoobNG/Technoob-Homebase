function AdminAside({ children }) {
  return (
    <aside className="flex justify-between h-auto">
      <div className="hidden sm:block rounded-md shadow-md w-[380px] h-full ">
        {children}
      </div>
    </aside>
  );
}

export default AdminAside;
