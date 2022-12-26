import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import React from "react";

export const getServerSideProps = async ({ req, params }) => {
  console.log(params.email);
  const user = await prisma.user.findUnique({
    where: {
      email: params.email,
    },
  });
  return {
    props: { user },
  };
};

const UserDetail = ({ user }) => {
  console.log(user);
  return (
    <>
      <div>{user.name}</div>
    </>
  );
};

export default UserDetail;
