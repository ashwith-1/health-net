import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: ""

  });

  const [loading, setLoading] =
    useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });
  };

  // ================= REGISTER =================

  const handleRegister = async () => {

    try {

      setLoading(true);

      await API.post(
        "/register",
        formData
      );

      toast.success(
        "Registration Successful ✅"
      );

      navigate("/login");

    } catch (err) {

      toast.error(
        "Registration Failed ❌"
      );

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">

      {/* ================= CARD ================= */}

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white mb-2">
            🏥 HealthNet
          </h1>

          <p className="text-gray-300">
            Create Your Account
          </p>

        </div>

        {/* ================= NAME ================= */}

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="
            w-full
            p-4
            mb-4
            rounded-2xl
            bg-white/10
            border
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
          "
        />

        {/* ================= EMAIL ================= */}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="
            w-full
            p-4
            mb-4
            rounded-2xl
            bg-white/10
            border
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
          "
        />

        {/* ================= PASSWORD ================= */}

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="
            w-full
            p-4
            mb-6
            rounded-2xl
            bg-white/10
            border
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
          "
        />

        {/* ================= BUTTON ================= */}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="
            w-full
            bg-cyan-500
            hover:bg-cyan-600
            transition
            duration-300
            text-white
            font-bold
            py-4
            rounded-2xl
            shadow-lg
          "
        >

          {loading
            ? "Creating Account..."
            : "Register"}

        </button>

        {/* ================= LOGIN ================= */}

        <p className="text-center text-gray-300 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-bold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;