import React from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

const UpdateAccount = ({ open, setOpen, user, setUser }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    await instance
      .put("/api/account", {
        ...user,
      })
      .then((res) => res.data)
      .then((res) => {
        toast.success("Cập nhật thành công!");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="fixed min-h-screen z-[999] grid place-items-center bg-slate-600/[0.5] top-0 bottom-0 left-0 right-0 px-2">
        <div className="md:max-w-[500px] rounded p-4 w-full bg-white">
          <label htmlFor="fullName" className="mb-2 block">
            Họ và tên
          </label>
          <input
            name="fullName"
            id="fullName"
            type="tel"
            className="border focus:border-none focus:outline-none rounded py-1 px-2 focus:ring-2 focus:ring-[#ff7a00] w-full mb-3"
            value={user.fullName || user.name || ""}
            onChange={handleChange}
          />
          <label htmlFor="phoneNumber" className="mb-2 block">
            Số điện thoại
          </label>
          <input
            name="phoneNumber"
            id="phoneNumber"
            type="tel"
            className="border focus:border-none focus:outline-none rounded py-1 px-2 focus:ring-2 focus:ring-[#ff7a00] w-full mb-3"
            value={user.phoneNumber || ""}
            onChange={handleChange}
          />
          <label htmlFor="address" className="mb-2 block">
            Địa chỉ
          </label>
          <input
            name="address"
            id="address"
            type="text"
            className="border focus:border-none focus:outline-none rounded py-1 px-2 focus:ring-2 focus:ring-[#ff7a00] w-full mb-3"
            value={user.address || ""}
            onChange={handleChange}
          />
          <div className="flex float-right gap-4">
            <button className="text-red-500" onClick={() => setOpen(false)}>
              Đóng
            </button>
            <button
              className="py-1 px-2 bg-[#ff7a00] rounded text-white"
              onClick={handleUpdate}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateAccount;
