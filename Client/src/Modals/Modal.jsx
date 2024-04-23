const Modal = ({ isOpen, onClose, children, setIsModalOpen }) => {
  const closeModal = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    // onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 overflow-y-hidden top-2 w-full left-0 " id="modal">
          <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-[0.96]" onClick={closeModal} />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-auto">&#8203;</span>
            <div
              className="inline-block align-center  bg-white rounded-[10px] text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
