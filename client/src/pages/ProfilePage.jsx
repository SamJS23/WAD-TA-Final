import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";
import axios from "axios";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {


        const response = await axios.get("/service/user/user-infor", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setUserInfo(response.data);
      } catch (err) {
        setError("An error occurred while fetching user information");
      } finally {
        setLoading(false);
      }
    };


    if (user) {
      fetchUserInfo();
    } else {
      setLoading(false); 
      setError("User not signed in");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarComponent />
        <div className="flex justify-center items-center h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarComponent />
        <div className="flex justify-center items-center h-96">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  const photoURL = userInfo?.user_image || "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander";
  const personalId = userInfo?.personal_id || "N/A";
  const name = userInfo?.name || userInfo?.email || "N/A";
  const email = userInfo?.email || "N/A";
  const address = userInfo?.address || "N/A";
  const phoneNumber = userInfo?.phone_number || "N/A";
  const isActivated = userInfo?.isActivated ?? false;
  const joinedAt = userInfo?.joinedAt ? new Date(userInfo.joinedAt).toLocaleDateString() : "N/A";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="flex justify-center mb-6">
            {photoURL ? (
              <img
                src={photoURL}
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-green-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-green-200">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal ID</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">{personalId}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{address}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{phoneNumber}</div>
            </div>

        

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">{joinedAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
