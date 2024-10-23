import { createContext, useState } from "react";

export const SocialContext = createContext();

const MainContext = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("SnapWay")));

  const FollowUnfollowProfile = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/v1/user/follow/${id}`,
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
      // console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <SocialContext.Provider value={{ user, setUser, FollowUnfollowProfile }}>
      {children}
    </SocialContext.Provider>
  );
};

export default MainContext;
