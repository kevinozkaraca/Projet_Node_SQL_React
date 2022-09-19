import React, { useState } from "react";
import { useSelector } from "react-redux";
import { POST } from "../others/Axios";
import ENDPOINTS from "../others/Endpoints";

const SignUpFrom = (props) => {
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");

  const [password, setPassword] = useState("");
  const zindex = useSelector((state) => state.logReducer);

  const handleSignUp = (event) => {
    event.preventDefault();
    const emailError = document.getElementById("emailUpError");
    const usernameError = document.getElementById("usernameUpError");

    const passwordError = document.getElementById("passwordUpError");

    POST(ENDPOINTS.USER_SIGNUP, { email, username, password })
      .then((res) => {
        switch (res.data.message) {
          case "exists":
            emailError.innerHTML = "Cette adresse existe déjà";
            usernameError.innerHTML = "";

            passwordError.innerHTML = "";
            break;
          case "badInputMail":
            emailError.innerHTML = "Vérifiez le format de l'adresse e-mail !";
            usernameError.innerHTML = "";

            passwordError.innerHTML = "";
            break;
          case "badInputusername":
            emailError.innerHTML = "";
            usernameError.innerHTML = "Données non valables";

            passwordError.innerHTML = "";
            break;

          case "invalidPassword":
            emailError.innerHTML = "";
            usernameError.innerHTML = "";

            passwordError.innerHTML = "Le mot de passe doit contenir 5 à 20 caractères";
            break;
          case "success":
            sessionStorage.setItem("currentUser", res.data.user);
            sessionStorage.setItem("token", res.data.token);
            window.location = "/postsfeed";
            break;
          default:
            emailError.innerHTML = "";
            usernameError.innerHTML = "";

            passwordError.innerHTML = "";
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div onClick={props.increment} className="cadreSignup" style={{ zIndex: zindex }}>
      <h1>S'incrire</h1>
      <form method="get" className="form" onSubmit={handleSignUp}>
        <div className="formSignupMail">
          <label htmlFor="email">Adresse e-mail : </label>
          <input
            type="text"
            name="email"
            id="email"
            required
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          ></input>
          <p id="emailUpError"></p>
        </div>
        <div className="formSignupUsername">
          <label htmlFor="username">Nom d'utilisateur : </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(event) => setusername(event.target.value)}
            value={username}
          ></input>
          <p id="usernameUpError"></p>
        </div>

        <div className="formSignupPassword">
          <label htmlFor="password">Mot de passe : </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          ></input>
          <p id="passwordUpError"></p>
        </div>
        <div className="formSignupSubmit">
          <input className="formSignupSubmitInput" type="submit" value="Valider" />
        </div>
      </form>
    </div>
  );
};

export default SignUpFrom;
