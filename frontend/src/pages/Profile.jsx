import { SocialContext } from "@/context/store";
import React, { useContext, useState } from "react";
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

const Profile = () => {
  const { user, setUser } = useContext(SocialContext);
  console.log(user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    username: "",
    link: "",
    currentPassword: "",
    newPassword: "",
  });
  const [profileImage, setProfileImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("bio", formData.bio);
    formDataObj.append("username", formData.username);
    formDataObj.append("link", formData.link);
    formDataObj.append("currentPassword", formData.currentPassword);
    formDataObj.append("newPassword", formData.newPassword);

    if (profileImage) {
      formDataObj.append("profileImage", profileImage);
    }
    if (coverImage) {
      formDataObj.append("coverImage", coverImage);
    }

    try {
      const response = await fetch("http://localhost:8080/v1/user/update", {
        method: "POST",
        credentials: "include",
        body: formDataObj,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const userData = await response.json();
      const updatedUser = userData.user;
      console.log(updatedUser);
      localStorage.setItem("SnapWay", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Close the dialog after successful submission
      setDialogOpen(false);

      // Optionally reset form data
      // setFormData({
      //   name: updatedUser.name,
      //   email: updatedUser.email,
      //   bio: updatedUser.bio,
      //   username: updatedUser.username,
      //   link: updatedUser.link,
      //   currentPassword: "",
      //   newPassword: "",
      // });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className=" ">
      <img
        src={
          user?.coverImage
            ? user.coverImage
            : "https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="Profile"
        className="h-[200px] w-full object-cover"
      />
      <div className="mx-8">
        <img
          src={
            user?.profileImage
              ? user.profileImage
              : "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          className="object-cover h-20 w-20 rounded-full border-2 border-green-500 relative top-[-30px] bg-white"
        />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl">{user?.name}</h2>
            <p>@{user?.username}</p>
          </div>
          <p></p>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 w-full">
                <div className="grid  items-center gap-4">
                  <Input
                    className="col-span-3 "
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className=" items-center gap-4">
                  <Input
                    className="col-span-3  "
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid items-center gap-4">
                  <Input
                    className="col-span-3 "
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid  items-center gap-4">
                  <Input
                    className="col-span-3"
                    placeholder="Current Password"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid  items-center gap-4">
                  <Input
                    className="col-span-3  "
                    placeholder="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid  items-center gap-4 ">
                  <Textarea
                    className="w-full "
                    placeholder="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
                <div className=" items-center gap-4">
                  <Input
                    className="   w-full"
                    placeholder="Link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                  />
                </div>
                <div className=" items-center gap-4 border relative">
                  <p className="absolute p-1">
                    {profileImage ? profileImage.name : "Profile Picture"}
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="flex items-center justify-center  cursor-pointer opacity-0"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setProfileImage(e.target.files[0]);
                    }}
                  />
                </div>
                <div className=" items-center gap-4 border relative">
                  <p className="absolute p-1">
                    {" "}
                    {coverImage ? coverImage.name : "Cover Picture"}
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="flex items-center justify-center  cursor-pointer opacity-0"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setCoverImage(e.target.files[0]);
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                  className="bg-green-500 font-bold"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-6  w-[450px] font-bold">{user?.bio}</p>
        {user?.link ? (
          <div className="flex items-center gap-1 mt-4">
            <img
              src="https://img.icons8.com/?size=100&id=59826&format=png&color=BEB9B9"
              alt=""
              className="h-4 "
            />
            <a
              href={user?.link}
              className="italic text-[#BEB9B9] hover:text-gray-500"
            >
              {user?.link}
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="flex items-center gap-4 mt-5">
          <div>0 Posts</div>
          <div>{user?.followers?.length} Followers</div>
          <div>{user?.follwing?.length} Following</div>
        </div>
      </div>
      <hr className="mt-10" />
    </div>
  );
};

export default Profile;
