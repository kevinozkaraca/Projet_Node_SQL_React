import React from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../functions/Utils";
import Comment from "./Comment";

const CommentThread = (post) => {
  const comments = useSelector((state) => state.commentReducer);

  return (
    <div className="commentThread">
      {!isEmpty(comments[0]) &&
        comments.map((comment) => {
          if (comment.postId === post.postId) return <Comment comment={comment} key={comment.comId} />;
          else return false;
        })}
    </div>
  );
};

export default CommentThread;
