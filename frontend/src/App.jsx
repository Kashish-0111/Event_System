import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: "", name: "", email: "", phone: "", department: "", designation: "", salary: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api/employees";

 const fetchEmployees = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployees(res.data);
    setLoading(false);
  };

useEffect(() => {
    if (isLoggedIn) fetchEmployees();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          setUsername(localStorage.getItem("username") || "");
          setIsLoggedIn(true);
        }}
      />
    );
  }



  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form, getAuthHeader());
      setEditId(null);
    } else {
      await axios.post(API, form , getAuthHeader());
    }
    setForm({ employeeId: "", name: "", email: "", phone: "", department: "", designation: "", salary: "" });
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditId(emp._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await axios.delete(`${API}/${id}`,getAuthHeader());
      fetchEmployees();
    }
  };
  

  

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
    <div className="max-w-6xl mx-auto">

      {/* NAVBAR: title + profile icon + logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Employee Management System
        </h1>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-700">{username}</span>
          <button
            onClick={handleLogout}
            className="ml-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <p className="text-slate-400 text-sm font-medium">Total Employees</p>
          <p className="text-3xl font-bold text-indigo-600">{employees.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <p className="text-slate-400 text-sm font-medium">Departments</p>
          <p className="text-3xl font-bold text-purple-600">{new Set(employees.map(e => e.department)).size}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-pink-500 hover:shadow-lg transition-shadow">
          <p className="text-slate-400 text-sm font-medium">Total Payroll</p>
          <p className="text-3xl font-bold text-pink-600">₹{employees.reduce((sum, e) => sum + Number(e.salary || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
          {editId ? "Update Employee" : "Add New Employee"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
          <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} required
            className="border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 md:col-span-2" />
          <button type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            {editId ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white uppercase text-xs tracking-wide">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-6 text-center text-slate-400">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="8" className="p-6 text-center text-slate-400">No employees yet. Add one above.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} className="border-b border-slate-50 hover:bg-indigo-50/50 transition-colors">
                  <td className="p-3 font-medium text-slate-700">{emp.employeeId}</td>
                  <td className="p-3 font-medium text-slate-800">{emp.name}</td>
                  <td className="p-3 text-slate-500">{emp.email}</td>
                  <td className="p-3 text-slate-500">{emp.phone}</td>
                  <td className="p-3">
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">{emp.department}</span>
                  </td>
                  <td className="p-3 text-slate-500">{emp.designation}</td>
                  <td className="p-3 font-semibold text-emerald-600">₹{Number(emp.salary).toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(emp)}
                      className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 rounded-md text-xs font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(emp._id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-semibold transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default App;