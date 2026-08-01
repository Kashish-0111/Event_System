import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", designation: "", salary: "" });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/api/employees";

  const fetchEmployees = async () => {
    const res = await axios.get(API);
    setEmployees(res.data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: "", email: "", phone: "", department: "", designation: "", salary: "" });
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditId(emp._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Employee Management</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} required />
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} required />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Dept</th><th>Designation</th><th>Salary</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;