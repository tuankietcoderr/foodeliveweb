import {
  faArrowUpRightFromSquare,
  faBars,
  faBell,
  faCartShopping,
  faChampagneGlasses,
  faGears,
  faHeart,
  faHomeAlt,
  faLinesLeaning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const NavigationBar = () => {
  const { data, status } = useSession();
  const user = data?.user;
  const [expander, setExpander] = useState("translate-x-[-100%]");
  const handleExpand = () => {
    if (expander === "translate-x-[-100%]") {
      setExpander("translate-x-0");
    } else {
      setExpander("translate-x-[-100%]");
    }
  };

  const router = useRouter();
  return (
    <>
      <header
        className={`fixed top-4 p-2 left-0 bottom-4 shadow-2xl ${expander} w-60 transition-all rounded z-[9999] bg-white`}
      >
        <button
          onClick={handleExpand}
          className="absolute right-[-2rem] bg-[#ff7a00] text-white px-1 py-[0.1rem] rounded-md"
        >
          {expander === "translate-x-[-100%]" ? (
            <FontAwesomeIcon icon={faBars} size="xl" />
          ) : (
            <FontAwesomeIcon icon={faLinesLeaning} size="xl" />
          )}
        </button>
        {status === "authenticated" ? (
          <div className="flex items-end gap-2">
            <img
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="rounded"
            />
            <span>
              Xin chào,
              <Link
                href={"/account"}
                className="sm:hover:underline sm:hover:text-[#ff7a00]"
              >
                <span className="font-semibold">{user.name}</span>{" "}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
              </Link>
            </span>
          </div>
        ) : status === "unauthenticated" ? (
          <p className="text-center">
            <Link
              className="font-semibold underline hover:text-[#ff7a00]"
              href="/auth/signin"
            >
              Đăng nhập
            </Link>{" "}
            để có trải nghiệm tốt hơn
          </p>
        ) : (
          <span>Loading...</span>
        )}
        <div className="grid grid-rows-3">
          <ul className="my-8">
            <li className={`${router.pathname === "/" ? "active" : ""}`}>
              <Link href="/">
                <div>
                  <FontAwesomeIcon icon={faHomeAlt} /> Trang chủ
                </div>
              </Link>
            </li>
            <li
              className={`${router.pathname === "/restaurant" ? "active" : ""}`}
            >
              <Link href="/restaurant">
                <div>
                  <FontAwesomeIcon icon={faChampagneGlasses} /> Nhà hàng
                </div>
              </Link>
            </li>

            {status === "authenticated" && (
              <li className={`${router.pathname === "/cart" ? "active" : ""}`}>
                <Link href="/cart?type=added">
                  <div>
                    <FontAwesomeIcon icon={faCartShopping} /> Giỏ hàng
                  </div>
                </Link>
              </li>
            )}
            {status === "authenticated" && (
              <li
                className={`${
                  router.pathname === "/notification" ? "active" : ""
                }`}
              >
                <Link href="/notification">
                  <div>
                    <FontAwesomeIcon icon={faBell} /> Thông báo
                  </div>
                </Link>
              </li>
            )}
          </ul>
          <div></div>
          {status === "authenticated" && (
            <div className="self-end mb-2 grid place-items-center absolute bottom-0 right-0 left-0">
              <button
                className="bg-red-500 rounded px-3 py-1 text-white"
                onClick={() => signOut()}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default NavigationBar;
