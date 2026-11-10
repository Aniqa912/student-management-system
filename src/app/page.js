
"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
   const [students, setStudents] = useState([]);
  


useEffect(() => {
  async function fetchStudents() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error.message);
      alert("Students load nahi ho sake: " + error.message);
    } else {
      setStudents(data || []);
      console.log("Students from Supabase:", data);
    }

  }

  fetchStudents();
}, []);



  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
const [editName, setEditName] = useState("");
const [editCourse, setEditCourse] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editPhone, setEditPhone] = useState("");
async function addStudent(e) {
  e.preventDefault();

  if (!name.trim() || !course.trim() || !email.trim() || !phone.trim()) {
    alert("Please fill all fields!");
    return;
  }

  if (name.trim().length < 3) {
    alert("Student name must be at least 3 characters!");
    return;
  }

  if (course.trim().length < 3) {
    alert("Course name must be at least 3 characters!");
    return;
  }

  if (!/^\d{10,15}$/.test(phone.trim())) {
    alert("Please enter a valid phone number (10-15 digits)!");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    alert("Please enter a valid email address!");
    return;
  }

  const emailExists = students.some(
    (student) =>
      student.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (emailExists) {
    alert("This email is already registered!");
    return;
  }

  const { data, error } = await supabase
    .from("students")
    .insert([
      {
        name: name.trim(),
        course: course.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        status: "Active",
      },
    ])
    .select()
    .single();

  if (error) {
    alert("Student save nahi hua: " + error.message);
    return;
  }

  setStudents((prev) => [
  ...prev.filter((student) => student.id !== data.id),
  data,
]);

  setName("");
  setCourse("");
  setEmail("");
  setPhone("");
  setShowForm(false);

  alert("Student successfully added!");
}
async function deleteStudent(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (confirmDelete) {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Student delete nahi hua: " + error.message);
      return;
    }

    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );

    alert("Student successfully deleted!");
  }
}
function editStudent(student) {
  setEditingStudent(student);
  setEditName(student.name);
  setEditCourse(student.course);
  setEditEmail(student.email);
  setEditPhone(student.phone || "");
}
         function viewStudent(student) { 
               alert(
           "Student Details\n\n" +
           "Name: " + student.name + "\n" +
          "Course: " + student.course + "\n" +
           "Email: " + student.email + "\n" +
           "Phone: " + student.phone + "\n" +
         "Status: " + student.status
      );
}
 async function toggleStatus(id) {
  const student = students.find((s) => s.id === id);

  if (!student) return;

  const newStatus =
    student.status === "Active" ? "Inactive" : "Active";

  const { data, error } = await supabase
    .from("students")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert("Status update nahi hua: " + error.message);
    return;
  }

  setStudents((prev) =>
    prev.map((s) => (s.id === id ? data : s))
  );
}
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", color: "#263248", fontFamily: "Arial, sans-serif" }}>
      <aside style={{ width: "230px", background: "#172554", color: "white", padding: "30px 20px" }}>
        <h2 style={{ marginBottom: "40px" }}>🎓 EduManage</h2>
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
         <p style={{ background: "#334580", padding: "12px", borderRadius: "8px" }}>
          ▣ Dashboard
            </p>
            </Link>
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            <p style={{ padding: "12px" }}>👨‍🎓 Students</p>
             </Link>
             <Link href="/attendance" style={{ color: "white", textDecoration: "none" }}>
  <p style={{ padding: "12px" }}>📅 Attendance</p>
</Link>
        <Link href="/results" style={{ color: "white", textDecoration: "none" }}>
  <p style={{ padding: "12px" }}>📊 Results</p>
</Link>
        <Link href="/fees" style={{ color: "white", textDecoration: "none" }}>
  <p style={{ padding: "12px" }}>💰 Fees</p>
</Link>
<Link href="/notices" style={{ color: "white", textDecoration: "none" }}>
  <p style={{ padding: "12px" }}>📢 Notices</p>
</Link>
      </aside>

      <main style={{ flex: 1, padding: "35px" }}>
        <h1>Dashboard</h1>
        <button
  onClick={() => router.push("/login")}
  style={{
    background: "#dc2626",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px"
  }}
>
  Logout
</button>
        <p style={{ color: "#64748b", marginBottom: "30px" }}>Welcome to Student Management System</p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "35px" }}>
          
  {[
    ["Total Students", students.length, "👨‍🎓", "#2563eb"],
    ["Total Teachers", 12, "👩‍🏫", "#7c3aed"],
    ["Total Courses", 8, "📚", "#0891b2"],
  ].map(([title, value, icon, color]) => (
    <div
      key={title}
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        flex: "1 1 180px",
        boxShadow: "0 4px 15px #00000010",
        borderLeft: `5px solid ${color}`,
       }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
        {icon} {value}
      </h2>
      <p style={{ color: "#64748b", fontWeight: "600" }}>{title}</p>
    </div>
  ))}
    </div>

        <div style={{ background: "white", padding: "25px", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <h2>Recent Students</h2>
            <input
  type="text"
  placeholder="Search student..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "12px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    margin: "15px 0",
    width: "100%",
    maxWidth: "350px",
    outline: "none",
    fontSize: "14px"
  }}
/>
            <button onClick={() => setShowForm(!showForm)} style={{ background: "#2563eb", color: "white", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer" }}>
              + Add Student
            </button>

          </div>
           {editingStudent && (
  <div style={{ background: "white", padding: "20px", borderRadius: "10px", margin: "20px 0" }}>
    <h3>Edit Student</h3>

    <input
      placeholder="Student Name"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
    />

    <input
      placeholder="Course"
      value={editCourse}
      onChange={(e) => setEditCourse(e.target.value)}
    />

    <input
      placeholder="Email"
      value={editEmail}
      onChange={(e) => setEditEmail(e.target.value)}
       />

    <input
      placeholder="Phone"
      value={editPhone}
      onChange={(e) => setEditPhone(e.target.value)}
      />
      <button
  onClick={async () => {
    if (!editName.trim() || editName.trim().length < 3) {
      alert("Student name must be at least 3 characters!");
      return;
    }

    if (!editCourse.trim() || editCourse.trim().length < 3) {
      alert("Course name must be at least 3 characters!");
      return;
    }

    if (!/^\d{10,15}$/.test(editPhone.trim())) {
      alert("Please enter a valid phone number (10-15 digits)!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      alert("Please enter a valid email!");
      return;
    }

    if (
      students.some(
        (s) =>
          s.email.toLowerCase() === editEmail.trim().toLowerCase() &&
          s.id !== editingStudent.id
      )
    ) {
      alert("This email is already registered!");
      return;
    }

    const { data, error } = await supabase
      .from("students")
      .update({
        name: editName.trim(),
        course: editCourse.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim(),
      })
     .eq("id", editingStudent.id)
.select()
.single();

    if (error) {
      alert("Student update nahi hua: " + error.message);
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingStudent.id ? data : s
      )
    );

    setEditingStudent(null);
    alert("Student successfully updated!");
  }}
>
  Save Changes
</button>

    <button onClick={() => setEditingStudent(null)}>
      Cancel
    </button>
  
  </div>
           )}
          {showForm && (
            <form onSubmit={addStudent} style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "25px 0" }}>
<input
  placeholder="Student Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  style={{
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px"
  }}
/>
              <input
  placeholder="Course"
  value={course}
  onChange={(e) => setCourse(e.target.value)}
  required
  style={{
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px"
  }}
/>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px"
  }}
/>

<input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  style={{
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px"
  }}
  />
              <button
  type="submit"
  style={{
    background: "#2563eb",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  Save Student
</button>
            </form>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "25px", textAlign: "left" }}>
              
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                <th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Name</th>

<th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Course</th>

<th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Email</th>

<th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Phone</th>

<th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Status</th>

<th style={{
  padding: "15px",
  background: "#1e293b",
  color: "white",
  textAlign: "left",
  fontSize: "14px"
}}>Actions</th>
                 </tr>
                </thead>
              <tbody>
                {students
  .filter((student, index, arr) =>
    index === arr.findIndex((s) => s.id === student.id)
  )        
                    .filter((student) =>
  (student.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
  (student.email || "").toLowerCase().includes((search || "").toLowerCase()) ||
  (student.phone || "").toLowerCase().includes((search || "").toLowerCase()) ||
  (student.course || "").toLowerCase().includes((search || "").toLowerCase())
)
 
                     .map((student) => (
                  <tr
  key={student.id ?? student.email}
  style={{
    background: "white",
    transition: "0.3s" 
  }}
>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{student.name}</td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{student.course}</td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{student.email}</td>
                   <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{student.phone}</td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                    <span
  style={{
    background: student.status === "Active" ? "#dcfce7" : "#fee2e2",
    color: student.status === "Active" ? "#15803d" : "#dc2626",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600"
  }}
>
  {student.status}
</span>
                         <button
  onClick={() => toggleStatus(student.id)}
  style={{
    background: "#7c3aed",
    color: "white",
    padding: "7px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Change Status
</button>
                               </td>
                     <td style={{ padding: "15px" }}>
                     
                     <button
  onClick={() => editStudent(student)}
  style={{
    background: "#2563eb",
    color: "white",
    padding: "7px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Edit
</button>
                     {" "}
                      <button
  onClick={() => viewStudent(student)}
  style={{
    background: "#0891b2",
    color: "white",
    padding: "7px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Details
</button>
                      {" "}
                      <button
  onClick={() => deleteStudent(student.id)}
  style={{
    background: "#dc2626",
    color: "white",
    padding: "7px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Delete
</button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
