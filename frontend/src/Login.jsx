import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username); 
      onLogin();
   } catch (err) {
  console.log("ERROR HAI:", err);
  setError(err.response?.data?.message || "Login failed");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required
          className="border border-slate-200 rounded-lg p-2.5 text-sm w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
          className="border border-slate-200 rounded-lg p-2.5 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <button type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;