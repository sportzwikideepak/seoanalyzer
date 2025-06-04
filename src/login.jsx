// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [id, setId] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (id === "admin" && password === "SPORTZ@123") {
//       localStorage.setItem("auth", "true");
//       navigate("/");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="ID"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//         /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         /><br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === "admin" && password === "SPORTZ@123") {
      localStorage.setItem("auth", "true");
      navigate("/");
    } else {
      alert("❌ Invalid credentials. Try again.");
    }
  };

  return (
    <div style={{ background: '#f9fafb', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', marginBottom: '20px', color: '#4f46e5' }}>🔐 Admin Login</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px'
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px'
            }}
          />

          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

