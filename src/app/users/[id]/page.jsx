"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Id = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  const fetchUserById = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/users/${id}`);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600">
          User Details
        </h2>
        <div className="space-y-2 text-gray-700 text-base sm:text-lg">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Age:</span> {user.age}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Country:</span> {user.country}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-4 w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Id;
