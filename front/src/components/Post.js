import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faCommentAlt, faPaperPlane, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { isEmpty } from "../functions/Utils";
import { useSelector, useDispatch } from "react-redux";
import { dateParser } from "../others/Date";
import { deletePost, getPosts, updatePost } from "../functions/Post";
import { addComment, deleteCommentByPostId, getAllComments } from "../functions/Comment";
import CommentThread from "./CommentThread";
import { addLike, deleteLike, deleteLikeByPostId, getLikes } from "../functions/Like";

const Post = ({ post }) => {
  const usersData = useSelector((state) => state.usersReducer);
  const commentsData = useSelector((state) => state.commentReducer);
  const likesData = useSelector((state) => state.likesReducer);
  const userData = useSelector((state) => state.userReducer);
  const [comText, setComText] = useState("");
  const [viewCommentField, setViewCommentField] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [fileDeleted, setFileDeleted] = useState(false);
  const [file, setFile] = useState();
  const [picture, setPicture] = useState();
  const [message, setMessage] = useState(post.textContent ? post.textContent : "");
  const [video, setVideo] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    handleVideo();
  }, [message, video]);

  const nbComments = () => {
    let nb = 0;
    Array.prototype.forEach.call(commentsData, (comment) => {
      if (comment.postId === post.postId) nb++;
    });
    return nb;
  };
  const nbLikes = () => {
    let nb = 0;
    Array.prototype.forEach.call(likesData, (like) => {
      if (like.postId === post.postId) {
        nb++;
      }
      if (nb == 2) {
        nb = 1;
      }
    });
    return nb;
  };
  const isLikedByUser = () => {
    const liked = Array.from(likesData).find(
      (like) => like.postId === post.postId && like.userId === parseInt(sessionStorage.currentUser)
    );
    if (liked === undefined) return false;
    else return true;
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (comText) {
      const dataCom = {
        postId: post.postId,
        authorId: parseInt(sessionStorage.currentUser),
        textContent: comText,
        date: Date.now().toString(),
      };
      await dispatch(addComment(dataCom));
      dispatch(getPosts());
      dispatch(getAllComments());
      setComText("");
      setViewComments(true);
      setViewCommentField(false);
    }
  };

  const sendLike = async () => {
    const dataDel = {
      postId: post.postId,
      userId: parseInt(sessionStorage.currentUser),
    };
    if (isLikedByUser()) {
      await dispatch(deleteLike(dataDel));
      dispatch(getLikes());
    } else {
      await dispatch(addLike(dataDel));
      dispatch(getLikes());
    }
  };

  const handleVideo = () => {
    let linkToFind = message.split(" ");
    for (let i = 0; i < linkToFind.length; i++) {
      if (linkToFind[i].includes("https://www.youtu") || linkToFind[i].includes("https://youtu")) {
        let embeded = linkToFind[i].replace("watch?v=", "embed/");
        setVideo(embeded.split("&")[0]);
        linkToFind.splice(i, 1);
        setMessage(linkToFind.join(" "));
        setPicture("");
        setFile("");
      }
    }
  };

  const handlePicture = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo("");
  };

  const handleModify = async () => {
    if (file || message || fileDeleted || video) {
      const data = new FormData();
      if (fileDeleted) data.append("imgContent", "noPic");
      else if (file) data.append("imgContent", file);
      else if (video) data.append("imgContent", video);
      data.append("textContent", message);
      if ((!file || file === "") && (!message || message === "") && fileDeleted && (!video || video === ""))
        alert("Vous ne pouvez pas laisser un post vide.\nEcrivez quelques mots ou supprimez le post.");
      else {
        await dispatch(updatePost(post.postId, data));
        dispatch(getPosts());
        setModifying(false);
        setFileDeleted(false);
        setPicture();
        setFile("");
      }
    } else if (post.imgContent && post.imgContent !== "noPic") {
      const data = new FormData();
      data.append("textContent", message);
      await dispatch(updatePost(post.postId, data));
      dispatch(getPosts());
      setModifying(false);
      setFileDeleted(false);
      setPicture();
      setFile("");
    }
  };

  const deletePicture = () => {
    setFileDeleted(!fileDeleted);
    setPicture();
    setFile();
    setVideo("");
  };

  const largeurVideo = () => {
    const widew = window.innerWidth;
    let hauteur = 0;
    if (widew >= 940) {
      hauteur = (860 * 56.25) / 100;
    } else {
      hauteur = ((widew - 80) * 56.25) / 100;
    }
    return hauteur;
  };

  return (
    <div className="post" key={post.postId}>
      <div className="postHead">
        <div className="postHeadInfos">
          <a className="postHeadInfosIMG" href={`/profile${post.authorId}`}>
            <img
              className="postHeadInfosIMG"
              src={
                !isEmpty(usersData[0])
                  ? usersData
                      .map((user) => {
                        if (user.userId === post.authorId) return user.imageUrl;
                        else return null;
                      })
                      .join("")
                  : "http://localhost:3005/images/default.png"
              }
              alt="Avatar de l'utilisateur"
            ></img>
          </a>
          <a className="postHeadInfosName" href={`/profile${post.authorId}`}>
            {!isEmpty(usersData[0]) &&
              usersData.map((user) => {
                if (user.userId === post.authorId) return user.username + " ";
                else return null;
              })}
          </a>
          <div className="postHeadInfosDate">{"Posté le " + dateParser(parseInt(post.date))}</div>
        </div>
        <div className="postHeadDelete">
          {post.authorId === parseInt(sessionStorage.currentUser) && (
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="postHeadDeleteIcons"
              onClick={() => setModifying(!modifying)}
            />
          )}
          {(post.authorId === parseInt(sessionStorage.currentUser) || userData.isAdmin) && (
            <FontAwesomeIcon
              icon={faTimes}
              className="postHeadDeleteIcons"
              onClick={async () => {
                if (window.confirm("Etes-vous sûr(e) ?\n(Cette action est irréversible)")) {
                  await dispatch(deleteCommentByPostId(post.postId));
                  await dispatch(deleteLikeByPostId(post.postId));
                  await dispatch(deletePost(post.postId));
                  dispatch(getAllComments());
                  dispatch(getLikes());
                  dispatch(getPosts());
                }
              }}
            />
          )}
        </div>
      </div>
      {!isEmpty(post.textContent) && !modifying && <div className="postText">{post.textContent}</div>}
      {modifying && (
        <div
          className={
            !picture && (!post.imgContent || post.imgContent === "noPic") ? "postTextDivPostText2" : "postTextDivText1"
          }
        >
          <textarea
            className="postTextTextarea"
            onChange={(e) => setMessage(e.target.value)}
            placeholder={message ? "" : "Vous pouvez ajouter un message ici"}
            value={message}
          ></textarea>
        </div>
      )}
      {((post.imgContent && post.imgContent !== "noPic") || picture || video) && (
        <div id="reference" className="postContent">
          {((post.imgContent &&
            post.imgContent !== "noPic" &&
            !(post.imgContent.includes("https://www.youtu") || post.imgContent.includes("https://youtu"))) ||
            (picture && picture !== "")) &&
            (!video || video === "") && (
              <img
                className={fileDeleted ? "postContentIMG1" : "postContentIMG2"}
                src={!picture ? post.imgContent : picture}
                alt="Contenu non disponible"
              ></img>
            )}
          {(video || post.imgContent.includes("https://www.youtu") || post.imgContent.includes("https://youtu")) &&
            !picture && (
              <iframe
                style={{ width: "100%", height: largeurVideo() }}
                className={fileDeleted ? "postContentVideo1" : "postContentVideo2"}
                src={video ? video : post.imgContent}
                frameBorder="0"
                allowFullScreen
                title={video}
              ></iframe>
            )}
          {modifying && (
            <div className="postContentIcons">
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  post.imgContent.includes("https://www.youtu") || post.imgContent.includes("https://youtu")
                    ? "postContentIconsCross2"
                    : "postContentIconsCross1"
                }
                onClick={
                  post.imgContent && post.imgContent !== "noPic"
                    ? () => {
                        setFileDeleted(!fileDeleted);
                      }
                    : deletePicture
                }
                title="Supprimer l'image du post"
              />
              {!(post.imgContent.includes("https://www.youtu") || post.imgContent.includes("https://youtu")) && (
                <FontAwesomeIcon icon={faPencilAlt} className="postContentIconsPencil" title="Modifier l'image" />
              )}
              {!(post.imgContent.includes("https://www.youtu") || post.imgContent.includes("https://youtu")) && (
                <input
                  className="postContentIconsInput"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => handlePicture(e)}
                  title="Modifier l'image"
                ></input>
              )}
            </div>
          )}
          {modifying && fileDeleted && (
            <img
              src="./imgs/imageSlash.png"
              className="postContentIMGDelete"
              alt="L'image sera supprimée du post"
            ></img>
          )}
        </div>
      )}
      {modifying && (
        <div className="postTextDiv">
          <div className="postTextDivUpload">
            <input
              className="postTextDivUploadInput"
              type="file"
              accept=".jpg, .jpeg, .png"
              title="Uploadez une image"
              onChange={(e) => handlePicture(e)}
            ></input>
          </div>
          <FontAwesomeIcon
            className="postTextSend"
            icon={faPaperPlane}
            title="Enregistrer vos modifications"
            onClick={handleModify}
          />
        </div>
      )}
      <div className="postPreStuff">
        <div className="postPreStuffLikes">
          <FontAwesomeIcon icon={faThumbsUp} />
          <p className="postPreStuffNumbers">{nbLikes()}</p>
        </div>
        <div
          className="postPreStuffComments"
          onClick={() => {
            if (!isEmpty(commentsData[0])) {
              const isThereComments = Array.from(commentsData).find((comment) => comment.postId === post.postId);
              if (isThereComments) setViewComments(!viewComments);
            }
          }}
        >
          <p className="postPreStuffNumbers">{nbComments()}</p>
          <p className="postPreStuffTexte">commentaire{nbComments() > 1 && "s"}</p>
        </div>
      </div>
      <div className="postStuff">
        <div className="postStuffLikes" onClick={sendLike}>
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={isLikedByUser() ? "comAndLike comAndLike--red" : "comAndLike"}
          />
          <p className={isLikedByUser() ? "postStuffTexte1" : "postStuffTexte2"}>J'aime</p>
        </div>
        <div className="postStuffComments" onClick={() => setViewCommentField(!viewCommentField)}>
          <FontAwesomeIcon icon={faCommentAlt} className="comAndLike" />
          <p className="postStuffTexte">Commenter</p>
        </div>
      </div>
      {viewCommentField && (
        <form className="postComment" method="get" onSubmit={sendComment}>
          <input
            className="postCommentInput"
            placeholder="Ajoutez un commentaire..."
            onChange={(e) => setComText(e.target.value)}
            value={comText}
          ></input>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="postCommentSend"
            type="submit"
            onClick={(e) => sendComment(e)}
          />
        </form>
      )}
      {!viewComments ? <div className="spacediv"></div> : <CommentThread postId={post.postId} />}
    </div>
  );
};

export default Post;
