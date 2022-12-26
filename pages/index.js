import FoodCard from "components/Body/Food";
import { SearchBar } from "components/index";
import { getUserByEmail } from "lib/prisma/user";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const user = session ? await getUserByEmail(session.user.email) : null;
  return {
    props: { user },
  };
};

const Home = ({ user }) => {
  console.log(user);
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState(null);
  useEffect(() => {
    instance
      .get("/api/food")
      .then((res) => {
        console.log(res.data.foods);
        setFoods(res.data.foods);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log(foods?.length);
  return (
    <>
      <div>
        <SearchBar />
        <div className="mt-10">
          {loading && <p>Loading...</p>}
          <div className={`flex flex-wrap md:justify-start justify-between`}>
            {foods &&
              foods.map((food) => <FoodCard {...food} key={food.MaMonAn} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
