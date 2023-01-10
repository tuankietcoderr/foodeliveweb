import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

const TableModal = ({ table, setShowModal }) => {
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  const { data } = useSession();
  const [phoneNumber, setPhoneNumber] = React.useState("");

  console.log(table);
  const handleBookTable = async (table) => {
    let isExecuted = true;
    if (!selectedDate) return toast.error("Vui lòng chọn ngày đặt bàn");
    if (selectedDate < new Date().toISOString().slice(0, 10))
      return toast.error("Ngày đặt bàn không hợp lệ");
    if (!phoneNumber) return toast.error("Vui lòng nhập số điện thoại");
    table.ChiTietDatBan.forEach(function (item) {
      let date = new Date(item.NgayDat);
      if (date.getTime() === new Date(selectedDate).getTime()) {
        isExecuted = false;
        return;
      }
    });
    if (!isExecuted) return toast.error("Bàn đã được đặt vào ngày này");
    let MaDatBan;
    MaDatBan = table.MaCuaHang + "DB";

    await instance
      .get("/api/book_table_detail")
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          let newId = parseInt(data[data.length - 1].MaDatBan.slice(8)) + 1;
          MaDatBan += newId > 9 ? newId : "0" + newId;
        } else {
          MaDatBan += "01";
        }
      })
      .catch((err) => console.log(err));

    const req_data = {
      MaDatBan,
      MaBanAn: selectedTable,
      NgayDat: new Date(selectedDate).toISOString(),
      TrangThai: 0,
      SoDienThoai: phoneNumber,
      NguoiDat: data.user.name,
      email: data.user.email,
    };
    console.log(req_data);
    await instance
      .post("/api/book_table_detail", req_data)
      .then((res) => res.data)
      .then(async (data) => {
        console.log(data);
        toast.success("Chúng tôi đang tiến hình đặt bàn cho bạn!");
        setShowModal(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="fixed min-h-screen z-[999] grid place-items-center bg-slate-600/[0.5] top-0 bottom-0 left-0 right-0 px-2">
      <div className="md:max-w-[500px] rounded p-2 w-full bg-white">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold z-[1000]">Danh sách bàn</h3>
          <button
            onClick={() => setShowModal(false)}
            className="cursor-pointer p-2"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div>
          {table.map((item) => (
            <div key={item.MaBanAn}>
              <div
                className="py-4 flex items-center justify-between cursor-pointer shadow-md px-2"
                onClick={() => setSelectedTable(item.MaBanAn)}
              >
                <div>
                  <p className="text-md font-semibold">{item.TenBanAn}</p>
                  <p className="text-xs">{item.Loai}</p>
                </div>
                <button
                  className="text-[#ff7a00] font-semibold"
                  onClick={() => setSelectedTable(item.MaBanAn)}
                >
                  Đặt
                </button>
              </div>
              {selectedTable === item.MaBanAn && (
                <div className="my-4 flex sm:flex-row flex-col justify-between gap-2">
                  <input
                    type="date"
                    className="border rounded"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <input
                    type="text"
                    className="border rounded"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <button
                    className="bg-[#ff7a00] text-white rounded px-1"
                    onClick={() => handleBookTable(item)}
                  >
                    Hoàn tất
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableModal;
