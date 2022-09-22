import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { spaceBetween } from "../others/Date";
import { deleteComment, getAllComments } from "../functions/Comment";

const Comment = (com) => {
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  return (
    <div className="commentContainer">
      <div className="commentContent">
        <div className="commentContentLight">
          <a className="commentContentName" href={`/profile${com.comment.authorId}`}>
            {usersData.map((user) => {
              if (user.userId === com.comment.authorId) {
                return user.username + " ";
              } else return null;
            })}
          </a>
          {(com.comment.authorId === parseInt(sessionStorage.currentUser) || userData.isAdmin) && (
            <FontAwesomeIcon
              icon={faTimes}
              className="fas-times commentContentDelete"
              onClick={async () => {
                if (window.confirm("Etes-vous sûr(e) ?\n(Cette action est irréversible)")) {
                  await dispatch(deleteComment(com.comment.comId));
                  await dispatch(getAllComments());
                  window.location.reload(true);
                }
              }}
            />
          )}
          <div className="commentBody">{com.comment.textContent}</div>
        </div>
        <div className="commentFoot">{"Il y a " + spaceBetween(com.comment.date, Date.now())}</div>
      </div>
    </div>
  );
};

export default Comment;
