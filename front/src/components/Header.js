import React from "react";

import { faPowerOff, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const exit = () => {
  sessionStorage.clear();
  window.location = "/";
};

const Header = () => {
  return (
    <div className="header">
      <div className="LogoCenter">
        <img
          src=".\icon-left-font-monochrome-white.png"
          alt="Logo de la société Groupomania"
          className="logoHeaderIMG"
        />
      </div>
      <nav className={window.location.pathname === "/postsfeed" ? "nav" : "nav2"}>
        {window.location.pathname !== "/postsfeed" && (
          <a href="http://localhost:3000/postsfeed">
            <FontAwesomeIcon icon={faArrowLeft} className="fas" title="Retour au fil d'actualités" />
          </a>
        )}
        {window.location.pathname !== "/postsfeed" && <div className="space"></div>}
        <a className="linkUser" href={`/profile${sessionStorage.currentUser}`} title="Consulter son profil">
          <FontAwesomeIcon
            icon={faUser}
            className={window.location.pathname === "/postsfeed" ? "fas fas--user" : "fas fas--user2"}
          />
        </a>
        <div className={window.location.pathname === "/postsfeed" ? "space" : "space2"}></div>

        <FontAwesomeIcon
          icon={faPowerOff}
          className={window.location.pathname === "/postsfeed" ? "fas fas--exit" : "fas fas--exti2"}
          title="Se déconnecter"
          onClick={exit}
        />
      </nav>
    </div>
  );
};

export default Header;
