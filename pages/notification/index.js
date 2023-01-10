import prisma from "lib/prisma";
import moment from "moment";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const notifications = await prisma.thongBao.findMany({
    where: {
      OR: [
        {
          ChiTietDonHang: {
            DonHang: {
              email: session.user.email,
            },
          },
        },
        {
          ChiTietDatBan: {
            email: session.user.email,
          },
        },
      ],
    },
    include: {
      ChiTietDatBan: {
        include: {
          BanAn: {
            include: {
              CuaHang: true,
            },
          },
          User: true,
        },
      },
      ChiTietDonHang: {
        include: {
          MonAn: true,
        },
      },
    },
  });
  return {
    props: {
      notifications: JSON.stringify(notifications),
    },
  };
};

export const foodStatus = {
  0: { name: " đã thêm vào giỏ hàng", link: "/cart?type=added" },
  1: { name: " đang chờ xác nhận", link: "/cart?type=waiting" },
  2: { name: " đã xác nhận", link: "/cart?type=confirmed" },
  3: { name: " đang giao", link: "/cart?type=delivering" },
  4: { name: " đã giao", link: "/cart?type=delivered" },
  5: { name: " đã hủy", link: "/cart?type=cancelled" },
};

export const tableStatus = {
  0: "đang chờ xác nhận",
  1: "đã tiếp nhận",
  2: "đã hủy",
};

const Notification = ({ notifications }) => {
  notifications = JSON.parse(notifications);
  console.log(notifications);
  const [filterNotifications, setFilterNotifications] = useState(notifications);
  const handleFilterChange = (e) => {
    console.log(e.target.value);
    const filter = e.target.value;
    switch (filter) {
      case "filter":
        setFilterNotifications(notifications);
        return;
      case "food":
        return setFilterNotifications(
          notifications.filter((notification) => notification.ChiTietDonHang)
        );
      case "table":
        return setFilterNotifications(
          notifications.filter((notification) => notification.ChiTietDatBan)
        );
      default:
        return;
    }
  };
  return (
    <>
      <select onChange={handleFilterChange}>
        <option value={"filter"}>Bộ lọc</option>
        <option value={"food"}>Đơn hàng</option>
        <option value={"table"}>Đặt bàn</option>
      </select>
      {filterNotifications.length > 0 ? (
        filterNotifications.reverse().map((notification) => (
          <ul key={notification.MaThongBao} className="not">
            {notification.ChiTietDatBan && (
              <li className="list-disc py-2">
                <Link
                  href={`/restaurant/${notification.ChiTietDatBan.BanAn.MaCuaHang}`}
                >
                  <b>{notification.ChiTietDatBan.BanAn.TenBanAn} </b> của cửa
                  hàng{" "}
                  <b>{notification.ChiTietDatBan.BanAn.CuaHang.TenCuaHang}</b>{" "}
                  {tableStatus[notification.ChiTietDatBan.TrangThai]}
                  <p className="text-xs italic opacity-60">
                    Thời gian đặt:{" "}
                    {moment(notification.ChiTietDatBan.NgayDat).format(
                      "DD/MM/YYYY"
                    )}
                  </p>
                  <p className="text-xs italic opacity-60">Loại: Đặt bàn</p>
                </Link>{" "}
              </li>
            )}
            {notification.ChiTietDonHang && (
              <li className="py-2 list-disc">
                <Link
                  href={`${
                    foodStatus[notification.ChiTietDonHang.TrangThai].link
                  }#${notification.MaDonHang}`}
                >
                  Đơn hàng{" "}
                  <b className="sm:hover:underline sm:hover:text-[#ff7a00]">
                    {notification.ChiTietDonHang.MonAn.TenMonAn}
                  </b>
                  {foodStatus[notification.ChiTietDonHang.TrangThai].name}
                  <p className="text-xs italic opacity-60">Loại: Đơn hàng</p>
                </Link>
              </li>
            )}
          </ul>
        ))
      ) : (
        <p className="opacity-50">Không có thông báo nào</p>
      )}
    </>
  );
};

export default Notification;
