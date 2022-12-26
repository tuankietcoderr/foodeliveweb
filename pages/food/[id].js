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
import { getFoodById } from "lib/prisma/food";
import { getRestaurantById } from "lib/prisma/restaurant";
import { toDot } from "lib/todot";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";

export const getServerSideProps = async ({ params }) => {
  const { id } = params;
  const food = await getFoodById(id);
  const restaurant = await getRestaurantById(food.MaCuaHang);
  return {
    props: { food, restaurant: JSON.stringify(restaurant) },
  };
};

const FoodDetail = ({ food, restaurant }) => {
  const [quantity, setQuantity] = useState(1);
  const note = useRef(null);
  const address = useRef(null);
  const handleAddressChange = useCallback((e) => {
    address.current.value = e.target.value;
  }, []);

  const handleNoteChange = useCallback((e) => {
    note.current.value = e.target.value;
  }, []);
  return (
    <>
      <div>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-end">
            <img
              src={food.ImgUrl}
              alt={food.TenMonAn}
              className="w-full rounded-md object-cover object-center"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl">{food.TenMonAn}</h1>
              <button>
                <FontAwesomeIcon icon={faHeart} size="xl" color="#ff7a00" />{" "}
              </button>
            </div>
            <div className="bg-[#fafafa] rounded-sm p-4 my-4">
              <p className="text-[#ff7a00] text-3xl font-semibold">
                {toDot(food.Gia)} VND
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500">Số lượng:</p>
              <button
                className="bg-white border rounded-sm items-center px-1 sm:hover:bg-gray-200 transition-colors"
                onClick={() => {
                  if (quantity == 1) {
                    toast.error("Số lượng không hợp lệ");
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
                  className="w-8 text-center"
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
            <label className="text-gray-500">
              Địa chỉ:
              <input
                type="text"
                className="w-full border outline-none p-2 rounded-sm"
                placeholder="Nhập địa chỉ..."
                ref={address}
                value={address.current?.value}
                onChange={handleAddressChange}
              />
            </label>

            <p className="text-gray-500">Ghi chú</p>
            <textarea
              className="w-full min-h-40 border max-h-60 outline-none p-2 rounded-sm"
              placeholder="Nhập ghi chú..."
              ref={note}
              value={note.current?.value}
              onChange={handleNoteChange}
            />
            <div className="flex flex-wrap gap-4">
              <button className="border border-[#ff7a00] px-4 py-2 bg-[#ff7a00]/[0.3] sm:hover:bg-[#ff7a00] sm:hover:text-white rounded">
                <FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ hàng
              </button>
              <button className="px-4 py-2 sm:hover:bg-[#ff7a00]/[0.3] bg-[#ff7a00] sm:hover:text-black text-white rounded">
                <FontAwesomeIcon icon={faReceipt} /> Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <RestaurantDetail {...JSON.parse(restaurant)} />
    </>
  );
};

export default FoodDetail;
