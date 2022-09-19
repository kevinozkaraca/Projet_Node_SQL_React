import React, { useState } from "react";
import { POST } from "../others/Axios";
import ENDPOINTS from "../others/Endpoints";

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    const emailError = document.getElementById("emailInError");
    const passwordError = document.getElementById("passwordInError");

    POST(ENDPOINTS.USER_LOGIN, { email, password })
      .then((res) => {
        if (res.data.message === "unknown") {
          emailError.innerHTML = "Cet utilisateur n'existe pas";
          passwordError.innerHTML = "";
        } else if (res.data.message === "mdpIncorrect") {
          emailError.innerHTML = "";
          passwordError.innerHTML = "Mot de passe incorrect !";
        } else {
          sessionStorage.setItem("currentUser", res.data.currentUser);
          sessionStorage.setItem("token", res.data.token);
          window.location = "/postsfeed";
        }
      })
      .catch((e) => {
        if (e.status === 401) {
          console.log("C'est catché !");
        }
      });
  };

  return (
    <div onClick={props.decrement} className="cadreSignin">
      <h1>Se connecter</h1>
      <form method="get" className="form" onSubmit={handleLogin}>
        <div className="formSigninMail">
          <label htmlFor="email">Adresse e-mail : </label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          ></input>
          <p id="emailInError"></p>
        </div>
        <div className="formSigninPassword">
          <label htmlFor="password">Mot de passe : </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          ></input>
          <p id="passwordInError"></p>
        </div>
        <div className="formSigninSubmit">
          <input className="formSigninSubmitInput" type="submit" value="Valider" />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
