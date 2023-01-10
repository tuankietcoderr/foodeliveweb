import CartAdded from "components/Body/Cart/CartAdded";
import CartCancelled from "components/Body/Cart/CartCancelled";
import CartConfirmed from "components/Body/Cart/CartConfirmed";
import CartDelivered from "components/Body/Cart/CartDelivered";
import CartDelivering from "components/Body/Cart/CartDelivering";
import CartWaiting from "components/Body/Cart/CartWaiting";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

const Links = [
  {
    name: "Giỏ hàng của bạn",
    q: "added",
  },
  {
    name: "Chờ xác nhận",
    q: "waiting",
  },
  {
    name: "Đã xác nhận",
    q: "confirmed",
  },
  {
    name: "Đang giao",
    q: "delivering",
  },
  {
    name: "Đã giao",
    q: "delivered",
  },
  {
    name: "Đã hủy",
    q: "cancelled",
  },
];
const Cart = () => {
  const router = useRouter();
  const [carts, setCarts] = useState(null);
  useEffect(() => {
    async function fetchData() {
      await instance
        .get(`/api/cart?type=${router.query?.type}`)
        .then((res) => res.data)
        .then((data) => {
          setCarts(data.carts);
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    }
    (async function () {
      if (router.isReady) {
        if (!router.query.type) {
          router.replace(`/cart?type=added`).then(async () => {
            router.query.type = "added";
            await fetchData();
          });
        } else {
          await fetchData();
        }
      }
    })();
  }, [router.isReady, router.query]);
  const RenderedCard = useCallback(
    ({ cart, carts, setCarts }) => {
      const status = router.query?.type;
      switch (status) {
        case "added":
          return <CartAdded {...cart} setCartz={setCarts} cartz={carts} />;
        case "waiting":
          return <CartWaiting {...cart} setCartz={setCarts} cartz={carts} />;
        case "confirmed":
          return <CartConfirmed {...cart} setCartz={setCarts} cartz={carts} />;
        case "delivering":
          return <CartDelivering {...cart} setCartz={setCarts} cartz={carts} />;
        case "delivered":
          return <CartDelivered {...cart} setCartz={setCarts} cartz={carts} />;
        case "cancelled":
          return <CartCancelled {...cart} setCartz={setCarts} cartz={carts} />;
        default:
          return <CartAdded {...cart} setCartz={setCarts} cartz={carts} />;
      }
    },
    [router.query]
  );

  return (
    <>
      {router.isReady && router.query.type && carts && (
        <>
          <div className="overflow-x-auto scrollbar-hide z-[99] flex w-full sm:justify-center sticky self-start top-0 bg-white my-4">
            {Links.map((link) => (
              <Link
                href={`/cart?type=${link.q}`}
                key={link.q}
                className={`text-center border-b-[3px] px-4 py-2 sm:hover:bg-gray-200 sm:rounded-t text-sm whitespace-nowrap ${
                  link.q === router.query?.type ? "border-[#ff7a00]" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mb-12">
            {carts.length > 0 ? (
              carts.map((cart) => (
                <RenderedCard
                  cart={cart}
                  carts={carts}
                  setCarts={setCarts}
                  key={cart.MaDonHang}
                />
              ))
            ) : (
              <div className="text-center text-sm opacity-50">Trống</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
