import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialContext } from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegFileImage } from "react-icons/fa";
import { MdOutlineModeComment } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const HomePage = () => {
  const { user, fetchProfile } = useContext(SocialContext);
  // console.log(user);
  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("SnapWay"));
    // console.log(userData);
  }, []);

  const [viewMore, setViewMore] = useState(false);
  const [post, setPost] = useState();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  console.log(text, image);

  const handleSubmit = async () => {
    const newform = new FormData();
    newform.append("text", text);
    if (image) newform.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/v1/post/create", {
        method: "POST",
        body: newform,
        credentials: "include",
      });
      const data = await response.json();
      // console.log(data);
      setText("");
      setImage(null);
      fetchAllPosts();
    } catch (error) {}
  };
  const handleLike = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/v1/post/like/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      fetchAllPosts();
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchAllPosts = async (e) => {
    try {
      const response = await fetch("http://localhost:8080/v1/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data?.posts);
      setPost(data?.posts);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="mx-4 mt-2">
      <div className="flex items-center border px-2 ">
        <CiSearch className="text-2xl" />
        <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none p-2 rounded w-full"
        />
      </div>

      <div
        className={`my-3 border ${
          viewMore ? "h-full" : "h-20"
        } overflow-hidden`}
      >
        <div className=" p-2 flex items-center rounded gap-2">
          <img
            src={
              user?.profileImage
                ? user.profileImage
                : "https://img.icons8.com/?size=100&id=7820&format=png&color=000000"
            }
            alt=""
            className="h-16 border rounded-full border-green-500"
          />
          <textarea
            type="text"
            name=""
            className=" w-full outline-none p-2"
            placeholder="Write a post..."
            onChange={(e) => {
              setViewMore(true);
              if (e.target.value.length === 0) {
                setViewMore(false);
              }
              setText(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center mb-2 mx-2 justify-between">
          <div className="relative border border-gray-300 rounded-lg p-2 bg-gray-50 hover:shadow-md transition-shadow duration-300 ease-in-out ">
            <Input
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <FaRegFileImage className="text-gray-400 text-2xl sm:text-3xl mb-1 sm:mb-2 cursor-pointer" />
              <span className="text-gray-500 text-xs sm:text-sm font-medium">
                Upload
              </span>
            </div>
          </div>

          <Button
            className="bg-green-500 text-black font-bold"
            onClick={() => {
              handleSubmit();
              setViewMore(false);
              setText("");
              setImage(null);
              setText("");
              setImage(null);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
      <hr />

      <ScrollArea className="h-[78vh] border p-4 mt-2 flex flex-col gap-10">
        {post &&
          post.map((p, i) => (
            <div
              key={i}
              className=" p-2 flex flex-col  gap-4 bg-gray-50 mt-2 rounded"
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      p.user?.profileImage
                        ? p.user.profileImage
                        : "https://img.icons8.com/?size=100&id=99268&format=png&color=000000"
                    }
                    alt=""
                    className="h-10  rounded-full"
                  />
                  <p
                    className="font-bold"
                    onClick={() => {
                      // fetchProfile(p.user.username);
                      navigate(`/home/user/${p.user.username}`);
                    }}
                  >
                    {p.user.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs">
                    {formatDistanceToNow(new Date(p.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {p.image ? (
                <div className="flex flex-col items-center">
                  {p.image ? (
                    <img src={p.image} alt="" className="h-[200px] mt-4 " />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              <p className="text-gray-400 mt-4 mx-4">{p.text}</p>
              <div className="flex gap-6 my-4 ml-4">
                <div className="flex items-center gap-2">
                  <FaRegHeart
                    className="text-2xl cursor-pointer"
                    onClick={() => {
                      handleLike(p._id);
                    }}
                  />
                  <p>{p.likes.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineModeComment className="text-2xl cursor-pointer" />
                  <p>{p.comments.length}</p>
                </div>
              </div>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default HomePage;
