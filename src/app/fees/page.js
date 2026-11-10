
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
export default function Fees() {
  const [students, setStudents] = useState([]);
useEffect(() => {
  async function fetchFees() {
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("id, name, course");

    if (studentError) {
      alert("Students load nahi huay: " + studentError.message);
      return;
    }

    const { data: feeData, error: feeError } = await supabase
      .from("fees")
      .select("*");

    if (feeError) {
      alert("Fees load nahi huin: " + feeError.message);
      return;
    }

    const existingIds = feeData.map((item) => item.student_id);

    const missingStudents = studentData
      .filter((student) => !existingIds.includes(student.id))
      .map((student) => ({
        student_id: student.id,
        student_name: student.name,
        course: student.course,
        status: "Unpaid",
      }));

    if (missingStudents.length > 0) {
      const { error } = await supabase
        .from("fees")
        .upsert(missingStudents, {
          onConflict: "student_id",
          ignoreDuplicates: true,
        });

      if (error) {
        alert("Fees save nahi huin: " + error.message);
        return;
      }
    }

    const { data: finalData, error: finalError } = await supabase
      .from("fees")
      .select("*")
      .order("id", { ascending: true });

    if (finalError) {
      alert("Fees load nahi huin: " + finalError.message);
      return;
    }

    setStudents(finalData || []);
  }

  fetchFees();
}, []);

  async function changeFeeStatus(id, status) {
  const { data, error } = await supabase
    .from("fees")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert("Fee status update nahi hua: " + error.message);
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
      <h1>Fee Records Management</h1>
      <p>Manage student fee records</p>

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
              <th style={{ padding: "15px" }}>Fee Amount</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ padding: "15px" }}>{student.student_name}</td>
                <td style={{ padding: "15px" }}>{student.course}</td>
                <td style={{ padding: "15px" }}>Rs. {student.amount}</td>
                <td style={{
                  padding: "15px",
                  color: student.status === "Paid" ? "green" : "red"
                }}>
                  {student.status}
                </td>
                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() =>
                      changeFeeStatus(
                        student.id,
                        student.status === "Paid" ? "Unpaid" : "Paid"
                      )
                    }
                  >
                    Change Status
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
