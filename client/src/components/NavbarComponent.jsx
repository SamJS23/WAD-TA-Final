import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice"; 
import LogoImg from "../assets/logo.png";
import { useNavigate } from "react-router";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { user, isLoading, isSuccess, isLoggedOut } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Handle logout success
  useEffect(() => {
    if (isSuccess && isLoggedOut) {
      navigate("/signin");
      dispatch(reset());
    }
  }, [isSuccess, isLoggedOut, navigate, dispatch]);

  return (
    <nav className="flex w-full justify-between items-center bg-green-100 shadow-md py-3 px-10">
      {/* Logo */}
      <a href="/">
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <img src={LogoImg} alt="logo-image" className="h-6 w-6" />
          <p className="text-lg font-semibold text-green-600 hover:text-green-700 transition ease-in-out">
            ToDoSome
          </p>
        </div>
      </a>

      {/* Navigation Menu */}
      <div className="flex gap-6 justify-center items-center text-green-900 font-semibold">
        <a href="#" className="text-sm">
          My ToDo
        </a>
        {user ? (
          <div className="flex items-center gap-3">
            {user.user?.photoURL ? (
              <img
                src={user.user.photoURL}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold">
                {user.user?.email?.charAt(0).toUpperCase() || user.user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={handleProfileClick}
              className="bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-500 transition ease-in-out"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`text-white text-sm py-2 px-4 rounded-md transition ease-in-out ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <a
              href="/signin"
              className="bg-green-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-white text-green-800 border-2 border-green-800 text-sm py-2 px-6 rounded-md hover:bg-green-50 transition ease-in-out"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;