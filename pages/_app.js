import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NavigationBar } from "components/index";
import Link from "next/link";
import { AddressProvider } from "context/AddressContext";
import { FoodProvider } from "context/FoodContext";

function MyApp({ Component, pageProps, session }) {
  return (
    <>
      <SessionProvider session={session}>
        <ToastContainer autoClose={1000} position={"bottom-center"} />
        <NavigationBar />
        <div className="md:mx-[10%] sm:mb-[5%] mb-4 mx-[1rem]">
          <div className="grid place-items-center">
            <Link href={"/"}>
              <img src="/logo_foode_live_big.png" alt="logo" className="w-40" />
            </Link>
          </div>
          <FoodProvider>
            <AddressProvider>
              <Component {...pageProps} />
            </AddressProvider>
          </FoodProvider>
        </div>
      </SessionProvider>
    </>
  );
}

export default MyApp;
