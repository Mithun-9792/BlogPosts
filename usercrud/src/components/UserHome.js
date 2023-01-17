import React, { useEffect, useState } from "react";
import TypeWriter from "./UserHome/TypeWriter";
// import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:3030/";

export default function UserHome() {
  const [user, setuser] = useState();
  const token = localStorage.getItem("token");

  const logindata = async (token) => {
    let data = await me(token);
    setuser(data);
    // console.log(data, 'user data');
  };

  async function me(token1) {
    return await fetch(`${baseURL}me`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token1}`,
      },
    }).then((data) => data.json());
  }

  useEffect(() => {
    logindata(token);
  }, [token]);

  if (!user) return null;
  // console.log(user.name);
  return (
    <div
      style={{
        background: "rgb(2,0,36)",
        backgroundImage:
          "linear-gradient(200deg, rgba(2,0,36,1) 0%, rgba(9,85,121,1) 35%, rgba(0,212,255,1) 100%)",
        height: "100vh",
        color: "white",
        marginTop: "3.5rem",
      }}
      className="border border-warning"
    >
      <div className="container">
        <h2> Welcome {user.name}😎 </h2>
      </div>
      <div
        className="container "
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "transparent",
          background: "linear-gradient(90deg, #00DBDE 0%, hwb(241deg 18% 25%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          height: "12rem",
        }}
      >
        <TypeWriter
          text={
            "I hope you are well. Your welcome you login here, now you can start your journey with us. <br /> You can create your posts and see other people's posts and enjoy content"
          }
        />
      </div>
      <div
        className="container"
        style={{
          fontSize: "6rem",
          fontWeight: "bold",
          color: "transparent",
          background: "linear-gradient(90deg, #00DBDE 0%, hwb(241deg 18% 25%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <TypeWriter
          text={"EXPLORE CONNECT<br />LIVE"}
          delay={100}
          deleteSpeed={545}
        />
      </div>
    </div>
  );
}
