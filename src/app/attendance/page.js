
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Attendance() {
  const [students, setStudents] = useState([]);

useEffect(() => {
  async function fetchAttendance() {
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("id, name");

    if (studentError) {
      alert("Students load nahi huay: " + studentError.message);
      return;
    }

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*");

    if (attendanceError) {
      alert("Attendance load nahi hui: " + attendanceError.message);
      return;
    }

    const existingIds = attendanceData.map((item) => item.student_id);
     console.log("Attendance records:", attendanceData);
    const missingStudents = studentData
      .filter((student) => !existingIds.includes(student.id))
      .map((student) => ({
        student_id: student.id,
        student_name: student.name,
        status: "Present",
      }));

    if (missingStudents.length > 0) {
      const { data: newRecords, error } = await supabase
  .from("attendance")
  .upsert(missingStudents, {
    onConflict: "student_id",
    ignoreDuplicates: true,
  })
  .select();

      if (error) {
        alert("Attendance save nahi hui: " + error.message);
        return;
      }

      setStudents([...attendanceData, ...newRecords]);
    } else {
      setStudents(attendanceData);
    }
  }

  fetchAttendance();
}, []);
 
 async function changeAttendance(id, status) {
  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert("Attendance update nahi hui: " + error.message);
    return;
  }

  setStudents((prev) =>
    prev.map((student) =>
      student.id === id ? data : student
    )
  );
}

  return (
    <div style={{
      padding: "35px",
      minHeight: "100vh",
      background: "#f4f6fb",
      fontFamily: "Arial"
    }}>
      <h1>Attendance Management</h1>
      <p>Mark student attendance</p>

      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "25px"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "15px" }}>Student Name</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ padding: "15px" }}>
                  {student.student_name}
                </td>

                <td style={{ padding: "15px" }}>
                  <span style={{
                    color: student.status === "Present" ? "green" : "red"
                  }}>
                    {student.status}
                  </span>
                </td>

                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() => changeAttendance(student.id, "Present")}
                  >
                    Present
                  </button>

                  {" "}

                  <button
                    onClick={() => changeAttendance(student.id, "Absent")}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
