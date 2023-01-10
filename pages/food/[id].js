import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCartPlus,
  faMinus,
  faPlus,
  faReceipt,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RestaurantDetail from "components/Body/Restaurant/Detail";
import { AddressContext } from "context/AddressContext";
import { getFoodById } from "lib/prisma/food";
import { toMoney } from "lib/todot";
import { getSession, useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

export const getServerSideProps = async ({ params, req }) => {
  const { id } = params;
  const session = await getSession({ req });
  const food = await getFoodById(id);
  const liked = !!food.Liked.find(
    ({ email }) => email === session?.user?.email
  );
  return {
    props: {
      food: JSON.stringify(food),
      liked,
      user: session.user,
    },
  };
};

const FoodDetail = ({ food, liked, user }) => {
  food = JSON.parse(food);
  const [quantity, setQuantity] = useState(1);
  const {
    address,
    setAddress,
    ward,
    province,
    district,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
  } = useContext(AddressContext);

  const [note, setNote] = useState("");

  const handleAddressChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      specific_address: e.target.value,
    }));
  };
  const handleNoteChange = useCallback((e) => {
    setNote(e.target.value);
  }, []);

  const [isLiked, setIsLiked] = useState(liked);
  const { status } = useSession();

  const handleAddToCart = async () => {
    let re_data;
    if (status === "unauthenticated") {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      return null;
    }

    if (
      !address.province ||
      !address.district ||
      !address.ward ||
      !address.specific_address
    ) {
      toast.error("Vui lòng chọn địa chỉ");
      return null;
    }

    const data = {
      MaMonAn: food.MaMonAn,
      SoLuong: quantity,
      Gia: food.Gia,
      GhiChu: note,
      DiaChi: Object.values(address).reverse().join(", "),
      email: user.email,
    };
    await instance
      .post("/api/cart", data)
      .then((res) => {
        console.log("success");
        toast.success("Đã thêm vào giỏ hàng");
        re_data = res.data;
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Đã có lỗi xảy ra");
        re_data = null;
      });
    return re_data;
  };

  const handleOrder = async () => {
    await handleAddToCart().then(async (data) => {
      if (!data) return toast.error("Đã có lỗi xảy ra");
      const res = data.result;
      const DonHang = res.chiTietDonHang;
      console.log(res);
      await instance
        .put(`/api/cart/${DonHang.MaDonHang}/${DonHang.MaMonAn}`, {
          SoLuong: quantity,
          TrangThai: 1,
        })
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          toast.success("Đặt hàng thành công");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Đặt hàng thất bại");
        });
    });
  };

  const handleLiked = async () => {
    if (status === "unauthenticated") {
      return toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
    }
    await instance
      .post(`/api/liked/food`, {
        email: user.email,
        MaMonAn: food.MaMonAn,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Đã thêm vào món ăn yêu thích");
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã có lỗi xảy ra");
      });
  };

  const handleDisliked = async () => {
    if (status === "unauthenticated") {
      return toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
    }
    await instance
      .delete(`/api/liked/food`, {
        data: {
          email: user.email,
          MaMonAn: food.MaMonAn,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Đã xóa khỏi món ăn yêu thích");
        setIsLiked(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã có lỗi xảy ra");
      });
  };

  return (
    <>
      <div>
        <div className="grid md:grid-cols-3 gap-8 mb-4">
          <div className="flex items-end">
            <img
              src={food.ImgUrl}
              alt={food.TenMonAn}
              className="w-full rounded-md object-cover object-center"
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl">{food.TenMonAn}</h1>
              {!isLiked ? (
                <button onClick={handleLiked}>
                  <FontAwesomeIcon icon={faHeart} size="xl" color="#ff7a00" />{" "}
                </button>
              ) : (
                <button onClick={handleDisliked}>
                  <FontAwesomeIcon
                    icon={faHeartSolid}
                    size="xl"
                    color="#ff7a00"
                  />{" "}
                </button>
              )}
            </div>
            <div className="bg-[#fafafa] rounded-sm p-4 my-4">
              <p className="text-[#ff7a00] text-3xl font-semibold">
                {toMoney(food.Gia)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p>Số lượng:</p>
              <button
                className={`${
                  quantity == 1
                    ? "opacity-50 sm:hover:bg-none"
                    : "opacity-100 sm:hover:bg-gray-200"
                } bg-white border rounded-sm items-center px-1 
                transition-colors`}
                disabled={quantity == 1}
                onClick={() => {
                  if (quantity == 1) {
                    return;
                  }
                  setQuantity((prev) => parseInt(prev) - 1);
                }}
              >
                <FontAwesomeIcon icon={faMinus} />{" "}
              </button>
              <label>
                <input
                  type="text"
                  value={quantity || 1}
                  className="w-8 text-center outline-none"
                  onChange={(e) => {
                    if (
                      e.target.value == 0 ||
                      e.target.value == "" ||
                      e.target.value == "-" ||
                      e.target.value == "0" ||
                      e.target.value < 0 ||
                      e.target.value < "0"
                    ) {
                      setQuantity(1);
                      return;
                    }
                    setQuantity(parseInt(e.target.value));
                  }}
                />
              </label>
              <button
                className="bg-white border rounded-sm items-center px-1 sm:hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setQuantity((prev) => parseInt(prev || 1) + 1);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <label>
              <div>Địa chỉ:</div>
              <div className="grid sm:grid-cols-3 gap-2">
                {province && (
                  <select onChange={(e) => handleProvinceChange(e)}>
                    <option value={"default"}>Chọn tỉnh</option>
                    {province?.map((item) => (
                      <option key={item.code} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
                {district && (
                  <select onChange={(e) => handleDistrictChange(e)}>
                    <option value={"default"}>Chọn quận</option>
                    {district?.map((item) => (
                      <option key={item.code} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
                {ward && (
                  <select onChange={(e) => handleWardChange(e)}>
                    <option value={"default"}>Chọn phường</option>
                    {ward?.map((item) => (
                      <option key={item.code} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                className="w-full border outline-none p-2 rounded-sm mt-2"
                placeholder="Nhập địa chỉ cụ thể..."
                onChange={handleAddressChange}
              />
            </label>

            <p>Ghi chú</p>
            <textarea
              className="w-full min-h-40 border max-h-60 outline-none p-2 rounded-sm"
              placeholder="Nhập ghi chú..."
              value={note}
              onChange={handleNoteChange}
            />
            <div className="flex flex-wrap gap-4">
              <button
                className="border border-[#ff7a00] px-4 py-2 bg-[#ff7a00]/[0.3] sm:hover:bg-[#ff7a00] sm:hover:text-white rounded"
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ hàng
              </button>
              <button
                className="px-4 py-2 sm:hover:bg-[#ff7a00]/[0.3] bg-[#ff7a00] sm:hover:text-black text-white rounded"
                onClick={handleOrder}
              >
                <FontAwesomeIcon icon={faReceipt} /> Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <RestaurantDetail {...food.CuaHang} />
    </>
  );
};

export default FoodDetail;
