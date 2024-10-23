import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa6";
import { SocialContext } from "@/context/store";
import logo from "../../public/SnapWay.svg";

const Layout = () => {
  const navigate = useNavigate();
  const { user, setUser, FollowUnfollowProfile } = useContext(SocialContext);
  const logoutHandler = async () => {
    try {
      const response = await fetch(
        "https://twitter-clone-44wi.onrender.com/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      // console.log(data);
      if (localStorage.getItem("SnapWay")) {
        localStorage.removeItem("SnapWay");
      }
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const [showMenu, setShowMenu] = useState(1);
  const [suggested, setSuggested] = useState([]);
  const menu = [
    {
      id: 1,
      logo: <GoHome className="text-2xl" />,
      link: "home",
      name: "Home",
    },
    {
      id: 2,
      logo: <IoMdHeartEmpty className="text-2xl" />,
      link: "notifications",
      name: "Notifications",
    },

    {
      id: 3,
      logo: <IoPersonOutline className="text-2xl" />,
      link: "profile",
      name: "Profile",
    },
  ];

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  const suggestedUsers = async () => {
    try {
      const response = await fetch(
        "https://twitter-clone-44wi.onrender.com/v1/user/suggested",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data.suggestedUsers);
      setSuggested(data.suggestedUsers);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    suggestedUsers();
  }, [user]);

  return (
    <div className="flex  ">
      <div className="sm:flex justify-between items-start flex-col  h-[100vh] hidden  md:w-[350px]  p-2 border">
        <div className="w-full">
          <div className="flex gap-1 items-center justify-center md:justify-start">
            <img src={logo} alt="" className="h-7 w-7" />
            <p className="text-gray-500 hidden md:block">SnapWay</p>
          </div>
          <div className="mt-6 flex flex-col">
            {menu?.map((item, index) => (
              <div
                key={index}
                className="flex justify-center md:justify-between items-center py-2 px-1 cursor-pointer rounded mt-2 hover:bg-gray-100"
                onClick={() => {
                  setShowMenu(index + 1);
                  navigate(item.link);
                }}
              >
                <div className="flex items-center gap-4 ">
                  <div
                    className={`${
                      showMenu === index + 1 ? "text-green-500" : ""
                    } `}
                  >
                    {item.logo}
                  </div>
                  <p
                    className={`${
                      showMenu === index + 1 ? "text-green-500 " : ""
                    } hidden md:block`}
                  >
                    {item.name}
                  </p>
                </div>

                <div
                  className={`${
                    showMenu === index + 1 ? "block text-green-500" : "hidden"
                  } hidden md:block`}
                >
                  <FaChevronRight />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mb-2">
          <div className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-2 cursor-pointer">
            <img
              src={
                user?.profileImage
                  ? user.profileImage
                  : "https://img.icons8.com/?size=100&id=7820&format=png&color=000000"
              }
              alt=""
              className="h-8 md:h-10 border rounded-full border-green-500"
            />
            <div className="hidden md:block">
              <p>{user?.name}</p>
              <p className="text-xs">{user?.email}</p>
            </div>
          </div>
          <p
            className="bg-gray-100 flex items-center justify-center font-bold py-1 rounded cursor-pointer hover:bg-red-100 text-xs md:text-lg"
            onClick={() => {
              logoutHandler();
            }}
          >
            Logout
          </p>
        </div>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
      <div className="w-[50%] px-2 border hidden lg:block">
        <p className="py-2 font-bold">People you may know</p>
        {suggested &&
          suggested.map((users, index) => (
            <div
              key={index}
              className=" py-3 flex mt-2 rounded justify-between pr-3 items-center cursor-pointer hover:bg-gray-100 "
              onClick={() => {
                // fetchProfile(p.user.username);
                navigate(`/home/user/${users.username}`);
              }}
            >
              <div className="flex gap-2">
                <img
                  src={
                    users?.profileImage
                      ? users?.profileImage
                      : "https://img.icons8.com/?size=100&id=7820&format=png&color=000000"
                  }
                  alt=""
                  className="h-12 w-12 object-cover"
                />
                <div>
                  <p>{users.name}</p>
                  <p>@{users.username}</p>
                </div>
              </div>

              {/* <div
                className="bg-green-500 p-2 text-white font-bold rounded"
                onClick={() => {
                  FollowUnfollowProfile(users._id);
                }}
              >
                <p>follow</p>
              </div> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Layout;
