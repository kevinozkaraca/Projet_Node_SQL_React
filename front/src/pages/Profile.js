import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import { getUser } from "../functions/User";
import { getPosts } from "../functions/Post";
import "./Profile.css";

const Profile = () => {
  const [loadProfile, setLoadProfile] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loadProfile) {
      dispatch(getUser(parseInt(sessionStorage.currentUser)));
      dispatch(getPosts());
      setLoadProfile(false);
    }
  }, [loadProfile, dispatch]);

  return (
    <div className="greatContainer">
      <Header />
      <div className="feedContainer">
        <ProfileCard />
      </div>
    </div>
  );
};

export default Profile;
