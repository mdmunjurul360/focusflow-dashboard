import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { supabase } from "../services/supabase";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Email signup (magic link)
  const handleEmailSignup = async () => {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email 🔥");
    }

    setLoading(false);
  };

  // Google signup
  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <section className="signup p-6">
      <h2 className="text-2xl text-white flex items-center gap-2 mb-6">
        <UserPlus /> Signup
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

        {/* Email Button */}
        <button
          onClick={handleEmailSignup}
          disabled={loading}
          className="w-full bg-blue-600 p-3 rounded text-white"
        >
          {loading ? "Loading..." : "Begin Authentication"}
        </button>

        {/* Google */}
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-white text-black p-3 rounded"
        >
          Continue with Google
        </button>
      </div>
    </section>
  );
};

export default Signup;
