import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import AuthLayout from "../layouts/AuthLayout";

import { FaTimes } from "react-icons/fa";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      alert(
        res.data.message
      );

      if (
        res.data.user.role ===
        "admin"
      ) {

        navigate(
          "/admin-dashboard"
        );
      }

      else if (
        res.data.user.role ===
        "staff"
      ) {

        navigate(
          "/staff-dashboard"
        );
      }

      else {

        navigate(
          "/passenger-dashboard"
        );
      }

    } catch (error) {

      alert(
        error.response.data.message
      );
    }
  };

  return (

    <AuthLayout title="Login">

      <div className="relative">

        <button
          onClick={() => navigate("/")}
          className="absolute -top-16 right-0 text-gray-600 hover:text-red-500 text-2xl"
        >
          <FaTimes />
        </button>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-5">

          Don’t have an account?

          <Link
            to="/register"
            className="text-green-950 font-semibold ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
};

export default Login;