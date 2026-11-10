"use client";
import { client } from "../../sanity/lib/client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [sanityNotices, setSanityNotices] = useState([]);
  useEffect(() => {
  async function fetchSanityNotices() {
    try {
      const data = await client.fetch(
        `*[_type == "notice"] | order(date desc) {
          _id,
          title,
          message,
          date
        }`
      );

      setSanityNotices(data || []);
    } catch (error) {
      console.error("Sanity notices load error:", error);
    }
  }

  fetchSanityNotices();
}, []);
useEffect(() => {
  async function fetchNotices() {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert("Notices load nahi huay: " + error.message);
      return;
    }

    setNotices(data || []);
  }

  fetchNotices();
}, []);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
async function addNotice(e) {
  e.preventDefault();

  if (title.trim().length < 3 || message.trim().length < 5) {
    alert("Please enter a valid title and message!");
    return;
  }

  const { data, error } = await supabase
    .from("notices")
    .insert([
      {
        title: title.trim(),
        message: message.trim(),
        date: new Date().toISOString().split("T")[0],
      },
    ])
    .select()
    .single();

  if (error) {
    alert("Notice publish nahi hua: " + error.message);
    return;
  }

  setNotices((prev) => [...prev, data]);
  setTitle("");
  setMessage("");
}
async function deleteNotice(id) {
  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Notice delete nahi hua: " + error.message);
    return;
  }

  setNotices((prev) =>
    prev.filter((notice) => notice.id !== id)
  );
}

  

  return (
    <div style={{
      padding: "35px",
      minHeight: "100vh",
      background: "#f4f6fb",
      fontFamily: "Arial"
    }}>
      <h1>Announcements & Notices</h1>
      <p>Manage student announcements</p>

      <form onSubmit={addNotice} style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "25px"
      }}>
        <h2>Create New Notice</h2>

        <input
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "12px", width: "100%", margin: "10px 0" }}
        />

        <textarea
          placeholder="Write notice message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ padding: "12px", width: "100%", minHeight: "100px", margin: "10px 0" }}
        />

        <button type="submit" style={{
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}>
          Publish Notice
        </button>
      </form>

      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "25px"
      }}>
        <h2>All Notices</h2>
         <h3>Sanity Notices</h3>

{sanityNotices.map((notice) => (
  <div key={notice._id} style={{
    padding: "15px",
    borderBottom: "1px solid #eee"
  }}>
    <h3>{notice.title}</h3>
    <p>{notice.message}</p>
    <small>{notice.date || ""}</small>
  </div>
))}
        {notices.map((notice) => (
          <div key={notice.id} style={{
            padding: "15px",
            borderBottom: "1px solid #eee"
          }}>
            <h3>{notice.title}</h3>
            <p>{notice.message}</p>
            <small>{notice.date ? new Date(notice.date).toLocaleDateString() : ""}</small>
            <br />
            <button
              onClick={() => deleteNotice(notice.id)}
              style={{ marginTop: "10px" }}
            >
              Delete Notice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}