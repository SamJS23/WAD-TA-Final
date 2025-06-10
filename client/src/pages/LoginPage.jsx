import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NavbarComponent from "../components/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import { reset, signin } from "../features/auth/authSlice";
import { Navigate } from "react-router";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isError: "",
    isSuccess: "",
  });
  const { email, password } = formData;

  const { user, isLoading, isError, isSuccess, isLoggedOut, message } =
    useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, isError: "", isSuccess: "" });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(signin(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      toast.success(message || "Login successful!");
      dispatch(reset());
    }
  }, [user, isSuccess, isError, message, dispatch]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-success loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {user && isLoggedOut === false ? (
        <Navigate to="/" />
      ) : (
        <>
          <NavbarComponent />
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-lg text-green-800 font-semibold mb-4">
              Please login!
            </h1>
            <form
              className="flex flex-col gap-3 w-80"
              onSubmit={handleEmailLogin}
            >
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className="border p-2 rounded-md"
                required
              />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="border p-2 rounded-md"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default LoginPage;