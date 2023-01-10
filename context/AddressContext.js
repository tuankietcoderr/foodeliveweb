import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    specific_address: "",
  });
  useEffect(() => {
    const fetchAddress = async () => {
      await axios
        .get("https://provinces.open-api.vn/api/p")
        .then((res) => res.data)
        .then((data) => setProvince(data))
        .catch((err) => {
          console.log(err.message);
        });
    };
    fetchAddress();
  }, []);
  async function handleProvinceChange(e) {
    if (e.target.value === "default") return;
    setWard(null);
    const p = JSON.parse(e.target.value);
    setAddress((prev) => ({ ...prev, province: p.name }));
    await axios
      .get(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`)
      .then((res) => res.data)
      .then((data) => {
        setDistrict(data.districts);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function handleDistrictChange(e) {
    if (e.target.value === "default") return;
    const d = JSON.parse(e.target.value);
    setAddress((prev) => ({ ...prev, district: d.name }));
    await axios
      .get(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`)
      .then((res) => res.data)
      .then((data) => {
        setWard(data.wards);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function handleWardChange(e) {
    if (e.target.value === "default") return;
    const w = JSON.parse(e.target.value);
    setAddress((prev) => ({ ...prev, ward: w.name }));
  }

  const value = {
    address,
    setAddress,
    ward,
    setWard,
    province,
    setProvince,
    district,
    setDistrict,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
