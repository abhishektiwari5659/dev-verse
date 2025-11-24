import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed && feed.length > 0) return;
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if(!feed) return

  if(feed.length === 0) return <h1>You have reached at end</h1>
  return (
    <div className="flex justify-center my-10">
      {feed && Array.isArray(feed) && feed.length > 0 ? (
        <UserCard user={feed[0]} />
      ) : (
        <p className="text-gray-400 text-center">Loading feed...</p>
      )}
    </div>
  );
};

export default Feed;
