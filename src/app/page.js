"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4000/users");
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteData = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;
    await axios.delete(`http://localhost:4000/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
  };

  const onSubmit = async (user) => {
    if (editingUserId) {
      const { data } = await axios.put(`http://localhost:4000/users/${editingUserId}`, user);
      setUsers((prev) => prev.map((u) => (u.id === editingUserId ? data : u)));
      setEditingUserId(null);
    } else {
      const { data } = await axios.post("http://localhost:4000/users", user);
      setUsers((prev) => [...prev, data]);
    }
    reset();
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setValue("name", user.name);
    setValue("email", user.email);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8 space-y-10">

      {/* 🧾 Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-md mx-auto p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          {editingUserId ? "Edit User" : "Add New User"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        />
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {editingUserId ? "Update User" : "Add User"}
        </button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              reset();
              setEditingUserId(null);
            }}
            className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* 👥 User List */}
      {!selectedUser && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-6 w-full transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Name: {item.name}</h2>
                <p className="text-sm text-gray-500">Email: {item.email}</p>
                <p className="text-sm text-gray-500">Age: {item.age}</p>
                <p className="text-sm text-gray-500">Country: {item.country}</p>
                <p className="text-sm text-gray-500">Role: {item.role}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteData(item.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
              <button
                
                 onClick={() => router.push(`/${item.id}`)}
                className="mt-3 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
