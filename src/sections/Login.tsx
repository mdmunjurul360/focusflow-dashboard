import React, { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { supabase } from "../services/supabase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 User detect (important)
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        alert("Already logged in ");
      }
    };
    checkUser();
  }, []);

  // Email + Password Login
  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful ");
    }

    setLoading(false);
  };

  // Magic link (email login)
  const handleMagicLink = async () => {
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) alert(error.message);
    else alert("Check your email ");
  };

  // Google login
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) alert(error.message);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl text-white flex items-center gap-2 mb-6">
        <LogIn /> Login
      </h2>

      <div className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 p-3 rounded text-white"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Magic Link */}
        <button
          onClick={handleMagicLink}
          className="w-full bg-slate-700 p-3 rounded text-white"
        >
          Login with Email Link
        </button>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white text-black p-3 rounded"
        >
          Continue with Google
        </button>
      </div>
    </section>
  );
};

export default Login;