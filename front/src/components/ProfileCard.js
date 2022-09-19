import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET } from "../others/Axios";
import endpoints from "../others/Endpoints";
import { isEmpty } from "../functions/Utils";
import { deleteUser, updateUser } from "../functions/User";
import { getUser } from "../functions/User";
import { deletePost } from "../functions/Post";
import { deleteLikesByUserId } from "../functions/Like";
import { deleteCommentsByUserId } from "../functions/Comment";

const ProfileCard = () => {
  const userData = useSelector((state) => state.userReducer);
  const postsData = useSelector((state) => state.postReducer);
  const userToSeeId = window.location.toString().split("profile")[1];
  const [infos, setInfos] = useState({});
  const [locked, setLocked] = useState(true);
  const [mail, setMail] = useState(userData.email);

  const [file, setFile] = useState("");
  const [picture, setPicture] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const dispatch = useDispatch();

  useEffect(
    () => {
      GET(`${endpoints.GET_USER}${userToSeeId}`)
        .then((res) => {
          setInfos(res.data);
        })
        .catch((e) => console.log(e));
    },
    [userToSeeId],
    []
  );

  const handlePicture = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleProfile = async () => {
    if (file || mail !== userData.email || (password1 && password2)) {
      const errorMail = document.getElementById("errorMail");
      const errorPass1 = document.getElementById("errorPass1");
      const errorPass2 = document.getElementById("errorPass2");
      const data = new FormData();
      if (file) data.append("imageUrl", file);
      if (mail) {
        if (verifMail(mail)) data.append("email", mail);
        else {
          errorMail.innerText = "L'adresse mail n'est pas valide";
          return false;
        }
      } else data.append("email", userData.email);

      if (password1) {
        if (verifPass(password1)) {
          if (password1 === password2) {
            data.append("password", password1);
          } else {
            errorPass2.innerText = "Les deux mots de passes ne correspondent pas";
            return false;
          }
        } else {
          errorPass1.innerText =
            "Le mot de passe doit avoir au moins\n- une majuscule\n- une minuscule\n- un chiffre\n- entre 5 et 20 caractères\n- aucun espace";
          return false;
        }
      }
      await dispatch(updateUser(userData.userId, data));
      setMail("");
      setPassword1("");
      setPassword2("");
      dispatch(getUser(parseInt(sessionStorage.currentUser)));
      setLocked(true);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Voulez-vous réellement supprimer votre compte ?")) {
      await dispatch(deleteLikesByUserId(parseInt(sessionStorage.currentUser)));
      await dispatch(deleteCommentsByUserId(parseInt(sessionStorage.currentUser)));
      if (!isEmpty(postsData[0])) {
        Array.prototype.forEach.call(postsData, (post) => {
          if (post.authorId === parseInt(sessionStorage.currentUser)) {
            dispatch(deletePost(parseInt(post.postId)));
          }
        });
      }
      await dispatch(deleteUser(parseInt(sessionStorage.currentUser)));
      sessionStorage.clear();
      window.location = "/";
    }
  };

  const nbPosts = (id) => {
    let nb = 0;
    Array.prototype.forEach.call(postsData, (post) => {
      if (post == null || undefined) {
        console.log("Aucun post");
      } else if (post.authorId === id) {
        nb++;
      } else {
        console.log("aucune errreur");
      }
    });
    if (nb <= 1) return nb + " post";
    else return nb + " posts";
  };

  function verifMail(adresse) {
    return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(adresse);
  }

  function verifPass(mdp) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d[\]{};:=<>_+^#$@!%*?&]{7,20}$/.test(mdp);
  }

  if (!locked) {
    return (
      <div className="profileCard">
        <div className="profileCardIMG">
          <img
            className={file ? "profileCardIMG1" : "profileCardIMG2"}
            src={picture ? picture : userData.imageUrl}
            alt="Avatar"
          />
        </div>
        <input
          className="profileCardInputsAvatar"
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => {
            handlePicture(e);
          }}
        ></input>
        <h1 className="profileCardName">{userData.username + " "}</h1>
        <div className="profileCardInputsBlockMail">
          <input
            className="profileCardInputsBlockMailEmail"
            type="email"
            placeholder={userData.email}
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          ></input>
        </div>
        <p className="profileCardInputsError" id="errorMail"></p>
        <input
          className="profileCardInputsPasswords1"
          type="password"
          placeholder="Nouveau mot de passe"
          onInput={(e) => setPassword1(e.target.value)}
          value={password1}
        ></input>
        <p className="profileCardInputsError" id="errorPass1"></p>
        <input
          className="profileCardInputsPasswords2"
          type="password"
          placeholder="Répétez le mot de passe"
          onInput={(e) => setPassword2(e.target.value)}
          value={password2}
        ></input>
        <p className="profileCardInputsError" id="errorPass2"></p>
        <div className="profileCardButts">
          <div className="profileCardButt" onClick={handleProfile}>
            Valider
          </div>
        </div>
      </div>
    );
  } else if (userToSeeId !== sessionStorage.currentUser) {
    return (
      <div className="profileCard">
        <div className="profileCardIMG">
          <img className="profileCardIMG" src={infos.imageUrl} alt="Avatar" />
        </div>
        <h1 className="profileCardName">{infos.usename + " "}</h1>

        <p className="profileCardPosts">{"Auteur de " + nbPosts(infos.userId)}</p>
      </div>
    );
  } else {
    return (
      <div className="profileCard">
        <div className="profileCardImg">
          <img className="profileCardImg" src={userData.imageUrl} alt="Avatar" />
        </div>
        <h1 className="profileCardName">{userData.username + " "}</h1>
        <p className="profileCardEmail">{userData.email}</p>

        <p className="profileCardPosts">{"Auteur de " + nbPosts(userData.userId)}</p>
        <div className="profileCardButts">
          <div className="profileCardButt" onClick={() => setLocked(false)}>
            Modifier
          </div>
          <div className="profileCardButt" onClick={handleDeleteUser}>
            Supprimer
          </div>
        </div>
      </div>
    );
  }
};

export default ProfileCard;
