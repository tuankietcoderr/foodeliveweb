import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProviders, signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function SignIn({ providers }) {
  const { data: session, status } = useSession();
  console.log(status);
  if (session) {
    return (
      <>
        <h1>Bạn đã đăng nhập thành công.</h1>
        <h1>Chúng tôi đang chuyển bạn đến trang chủ...</h1>
      </>
    );
  }
  return (
    <>
      <div className="min-h-screen grid place-items-center content-center gap-4">
        <Image
          src={"/logo_foode_live_big.png"}
          alt="logo foodelive"
          width="400"
          height="600"
        />
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="bg-white shadow px-6 py-2 rounded flex items-center gap-4 sm:hover:shadow-lg transition-shadow"
              onClick={() => signIn(provider.id)}
            >
              <FontAwesomeIcon icon={faGoogle} size="xl" />
              <span className="font-semibold">
                Đăng nhập với {provider.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
