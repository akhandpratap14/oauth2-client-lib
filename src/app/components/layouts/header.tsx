const Header = () => {
  return (
    <div className="border shadow-ms !bg-white flex h-20 w-full px-60 justify-between items-center">
      <div className="flex gap-x-3 text-xl">
        <div className="text-[#5c41ff] font-medium flex justify-center items-center">
          <img
            src={"/icons/noscrubs.png"}
            className="h-10 w-10"
            height={1}
            width={1}
            alt="Logo"
          />
          NoScrubs
        </div>
        <div className="font-bold flex justify-center items-center">
          Laundry Delivery Service
        </div>
      </div>
      <div>Register</div>
    </div>
  );
};

export default Header;
