import { SocialContext } from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";

const Userprofile = () => {
  const { user, setUser } = useContext(SocialContext);
  const { username } = useParams();

  const [profileImage, setProfileImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [profileuser, setProfile] = useState();

  const fetchProfile = async (username) => {
    try {
      const response = await fetch(
        `https://twitter-clone-44wi.onrender.com/v1/user/profile/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      console.log(data.user);
      setProfile(data.user);
    } catch (error) {
      console.log(error.message);
    }
  };
  const FollowUnfollowProfile = async (id) => {
    try {
      const response = await fetch(
        `https://twitter-clone-44wi.onrender.com/v1/user/follow/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem("profile", JSON.stringify(data.user));
      setUser(data.user);
      fetchProfile(username);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProfile(username);
  }, [username]);

  return (
    <div className=" ">
      <img
        src={
          profileuser?.coverImage
            ? profileuser.coverImage
            : "https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="Profile"
        className="h-[200px] w-full object-cover"
      />
      <div className="mx-8">
        <img
          src={
            profileuser?.profileImage
              ? profileuser.profileImage
              : "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          className="object-cover h-20 w-20 rounded-full border-2 border-green-500 relative top-[-30px] bg-white"
        />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl">{profileuser?.name}</h2>
            <p>@{profileuser?.username}</p>
          </div>
          <p
            className="bg-green-500 p-2 font-bold text-white rounded cursor-pointer"
            onClick={() => {
              //   console.log(profileuser);
              FollowUnfollowProfile(profileuser?._id);
            }}
          >
            Follow
          </p>
        </div>
        <p className="mt-6  w-[450px] font-bold">{profileuser?.bio}</p>
        {profileuser?.link ? (
          <div className="flex items-center gap-1 mt-4">
            <img
              src="https://img.icons8.com/?size=100&id=59826&format=png&color=BEB9B9"
              alt=""
              className="h-4 "
            />
            <a
              href={profileuser?.link}
              className="italic text-[#BEB9B9] hover:text-gray-500"
            >
              {profileuser?.link}
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="flex items-center gap-4 mt-5">
          <div>0 Posts</div>
          <div>{profileuser?.followers?.length} Followers</div>
          <div>{profileuser?.following?.length} Following</div>
        </div>
      </div>
      <hr className="mt-10" />
    </div>
  );
};

export default Userprofile;
