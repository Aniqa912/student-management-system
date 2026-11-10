
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Results() {
  const [students, setStudents] = useState([]);
 useEffect(() => {
  async function fetchResults() {
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("id, name, course");

    if (studentError) {
      alert("Students load nahi huay: " + studentError.message);
      return;
    }

    const { data: resultData, error: resultError } = await supabase
      .from("results")
      .select("*");

    if (resultError) {
      alert("Results load nahi huay: " + resultError.message);
      return;
    }

    const existingIds = resultData.map((item) => item.student_id);

    const missingStudents = studentData
      .filter((student) => !existingIds.includes(student.id))
      .map((student) => ({
        student_id: student.id,
        student_name: student.name,
        course: student.course,
        marks: 0,
      }));

    if (missingStudents.length > 0) {
      const { error } = await supabase
        .from("results")
        .upsert(missingStudents, {
          onConflict: "student_id",
          ignoreDuplicates: true,
        });

      if (error) {
        alert("Results save nahi huay: " + error.message);
        return;
      }
    }

    const { data: finalData, error: finalError } = await supabase
      .from("results")
      .select("*")
      .order("id", { ascending: true });

    if (finalError) {
      alert("Results load nahi huay: " + finalError.message);
      return;
    }

    setStudents(finalData || []);
  }

  fetchResults();
}, []);

 async function updateMarks(id) {
  const newMarks = prompt("Enter marks (0-100):");

  if (newMarks === null) return;

  if (
    newMarks.trim() === "" ||
    !/^\d+$/.test(newMarks.trim()) ||
    Number(newMarks) > 100
  ) {
    alert("Please enter marks between 0 and 100!");
    return;
  }

  const { data, error } = await supabase
    .from("results")
    .update({ marks: Number(newMarks) })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert("Marks update nahi huay: " + error.message);
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
      <h1>Marks & Results Management</h1>
      <p>Manage student examination results</p>

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
              <th style={{ padding: "15px" }}>Course</th>
              <th style={{ padding: "15px" }}>Marks</th>
              <th style={{ padding: "15px" }}>Grade</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ padding: "15px" }}>{student.student_name}</td>
                <td style={{ padding: "15px" }}>{student.course}</td>
                <td style={{ padding: "15px" }}>{student.marks}/100</td>
                <td style={{ padding: "15px" }}>
                  {student.marks >= 80
                    ? "A"
                    : student.marks >= 60
                    ? "B"
                    : student.marks >= 50
                    ? "C"
                    : "Fail"}
                </td>
                <td style={{ padding: "15px" }}>
                  <button onClick={() => updateMarks(student.id)}>
                    Update Marks
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
