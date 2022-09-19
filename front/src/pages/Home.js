import React from "react";
import "./Home.css";
import { SignIn, SignUp } from "../reducers/LogContainer";

const Home = () => {
  return (
    <div className={"Home"}>
      <div className="LogoCenter">
        <img
          src=".\icon-left-font-monochrome-white.png"
          alt="Logo de la société Groupomania"
          className="logoHeaderIMG"
        />
      </div>
      <SignIn />
      <SignUp />
    </div>
  );
};

export default Home;
