import React, { useContext, useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "./context/store";

const App = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(SocialContext);
  // console.log(user);

  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name === "" ||
      formData.username === "" ||
      formData.password === "" ||
      formData.email === ""
    ) {
      return alert("All the fields are required");
    }
    if (formData.password.length < 6) {
      return alert("Password must be at least 6 characters long");
    }

    try {
      const response = await fetch(
        "https://twitter-clone-44wi.onrender.com/v1/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      // console.log(data.success);
      if (data.name) {
        // console.log(data);
        localStorage.setItem("SnapWay", JSON.stringify(data));
        setUser(data);
        navigate("/home/home");
      } else {
        console.log(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      navigate("/home");
    }
  }, []);

  return (
    <div className=" pt-6">
      <div className="absolute left-4 text-xl flex items-center gap-1">
        <img src="./SnapWay.svg" alt="" className="h-8" />
        <p className="text-gray-500">SnapWay</p>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="flex items-center justify-center h-[100vh] flex-col gap-5">
          <form
            className="flex items-start justify-center flex-col w-[90%] md:w-[60%]"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="mb-2">
              <div className="bg-[#18e018] w-[50px] p-2 rounded my-2">
                <img src="./SnapWay.svg" alt="" />
              </div>
              <p className="font-bold text-2xl mt-6">Get Started</p>
              <p className="mt-2 text-lg">
                Welcome to the SocialWay - Let's create your account
              </p>
            </div>
            <hr className="border-1 border-gray-200 w-full mt-6" />

            <label className="font-bold mt-4">Name</label>
            <Input
              placeholder="Enter name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <label className="font-bold mt-4">Username</label>

            <Input
              placeholder="Enter Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <label className="font-bold mt-4">Email</label>

            <Input
              placeholder="Enter Gmail"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <label className="font-bold mt-4">Password</label>

            <div className="relative w-full">
              <Input
                placeholder="Enter Password"
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <div
                className="absolute top-[10px] right-3 cursor-pointer "
                onClick={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? <AiFillEye /> : <AiOutlineEyeInvisible />}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-green-800 text-white font-bold hover:bg-green-500"
              type="submit"
            >
              Button
            </Button>
          </form>
          <p>
            Already have an account?{" "}
            <span
              className="text-green-700 font-bold cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#000000] to-[#0f9b0f] rounded-md text-white  items-center justify-center hidden md:flex">
          <h1 className=" text-5xl lg:text-7xl" id="heading">
            Enter the future <br /> of the <br /> Social.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
