import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields ❌");
      return;
    }

    try {
      setLoading(true);

      // 🔐 LOGIN API CALL
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ SAFE RESPONSE HANDLING (WORKS FOR ALL BACKEND FORMATS)
      const data = res.data?.data || res.data;

      const token = data?.token;

      const userId =
        data?.user?._id ||
        data?.userId;

      // ❌ VALIDATION
      if (!token || !userId) {
        toast.error("Invalid login response ❌");
        return;
      }

      // 💾 SAVE TO LOCAL STORAGE
      localStorage.setItem("token", token);
      localStorage.setItem("patientId", userId);

      toast.success("Login Successful ✅");

      // ================= RELATIVES CHECK =================
      try {
        const rel = await API.get(`/relatives/${userId}`);

        const list =
          rel.data?.relatives ||
          rel.data?.data ||
          rel.data ||
          [];

        const hasRelatives =
          Array.isArray(list) && list.length > 0;

        if (!hasRelatives) {
          toast.info("Please add emergency contacts first");
          navigate("/relatives");
        } else {
          navigate("/dashboard");
        }

      } catch (err) {
        console.log("Relatives API error:", err);
        navigate("/relatives");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        "Invalid Email or Password ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <h1 className="text-3xl text-white font-bold text-center mb-6">
          🏥 HealthNet Login
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          className="w-full p-3 mb-3 rounded-xl bg-white/10 text-white border border-white/20"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full p-3 mb-5 rounded-xl bg-white/10 text-white border border-white/20"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER */}
        <p className="text-center text-white mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-bold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;