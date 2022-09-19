import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Thread from "../components/Thread";
import PostCreator from "../components/PostCreator";
import { useDispatch } from "react-redux";
import { getAllComments } from "../functions/Comment";
import { getPosts } from "../functions/Post";
import { getUser } from "../functions/User";
import { getUsers } from "../functions/Users";
import { getLikes } from "../functions/Like";
import "./PostFeed.css";

const PostsFeed = () => {
  const [loadPost, setLoadPost] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loadPost) {
      dispatch(getAllComments());
      dispatch(getLikes());
      dispatch(getPosts());
      dispatch(getUsers());
      dispatch(getUser(parseInt(sessionStorage.currentUser)));
      setLoadPost(false);
    }
  }, [loadPost, dispatch]);

  return (
    <div className="greatContainer">
      <Header />
      <div className="feedContainer">
        <PostCreator />
        <Thread />
      </div>
    </div>
  );
};

export default PostsFeed;
