
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin123") {
      router.push("/");
    } else {
      alert("Invalid Email or Password!");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "white",
        padding: "35px",
        borderRadius: "12px",
        width: "320px"
      }}>
        <h1 style={{ textAlign: "center" }}>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", margin: "12px 0" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", margin: "12px 0" }}
        />

        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Login
        </button>
      </form>
    </div>
  );
}
