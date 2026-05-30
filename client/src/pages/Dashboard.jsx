import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const socket = io("https://health-net-bona.onrender.com");

export default function Dashboard() {

  const patientId = localStorage.getItem("patientId");

  const [health, setHealth] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [relatives, setRelatives] = useState([]);

  const [tab, setTab] = useState("dashboard");
  const [dark, setDark] = useState(true);

  // ================= MAP LOCATION =================
  const [location, setLocation] = useState({
    lat: 17.385,
    lng: 78.4867,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  // ================= FETCH =================
  const fetchAll = async () => {
    try {
      const [h, a, r] = await Promise.all([
        API.get(`/health/${patientId}`),
        API.get(`/alerts/${patientId}`),
        API.get(`/relatives/${patientId}`)
      ]);

      setHealth(h.data?.data || []);
      setAlerts(a.data?.alerts || []);
      setRelatives(r.data?.relatives || []);

      generateInsurance(h.data?.data || []);
    } catch (e) {
      console.log("FETCH ERROR:", e);
    }
  };

  // ================= HEALTH PUSH =================
  const pushHealth = async () => {
    try {
      await API.post("/health", {
        patientId,
        heartbeat: 60 + Math.random() * 60,
        spo2: 85 + Math.random() * 15,
        sugar: 90 + Math.random() * 120,
        bp: "120/80"
      });
    } catch (e) {
      console.log(e);
    }
  };

  // ================= INSURANCE =================
  const generateInsurance = (data) => {
    let list = [];

    data.forEach(d => {
      if (d.heartbeat > 110)
        list.push({ plan: "❤️ Heart Shield Plus", reason: "High heartbeat detected 🚨" });

      if (d.spo2 < 92)
        list.push({ plan: "🫁 Oxygen Care Elite", reason: "Low oxygen level ⚠️" });

      if (d.sugar > 160)
        list.push({ plan: "🍬 Diabetes Protect", reason: "Sugar spike detected ⚠️" });
    });

    setInsurance(list);
  };

  // ================= INIT =================
  useEffect(() => {
    fetchAll();

    const t1 = setInterval(pushHealth, 5000);
    const t2 = setInterval(fetchAll, 5000);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  // ================= SOCKET =================
  useEffect(() => {
    socket.on("new-alert", (data) => {
      toast.error("🚨 Emergency Alert Received!");
      setAlerts(prev => [data, ...prev]);
    });

    return () => socket.off("new-alert");
  }, []);

  // ================= CHART =================
  const chart = health.map(h => ({
    time: new Date(h.createdAt).toLocaleTimeString(),
    heartbeat: h.heartbeat,
    spo2: h.spo2,
    sugar: h.sugar
  }));

  // ================= ADD RELATIVE (FIXED) =================
  const addRelative = async () => {
    const name = prompt("👤 Name:");
    const phone = prompt("📞 Phone:");
    const email = prompt("📧 Email:");

    if (!name || !phone || !email) {
      toast.error("All fields required!");
      return;
    }

    try {
      const res = await API.post(`/relatives/${patientId}`, {
        name,
        phone,
        email
      });

      console.log("SAVED:", res.data);

      toast.success("👨‍👩‍👧 Relative Added Successfully 💚");
      fetchAll();
    } catch (err) {
      console.log(err);
      toast.error("Failed to save relative ❌");
    }
  };

  // ================= SEND EMAIL MESSAGE =================
  const sendMessage = async (email) => {
    const message = prompt("💬 Message:");

    if (!message) return;

    try {
      await API.post("/send-message", {
        email,
        message
      });

      toast.success("📩 Message Sent!");
    } catch (e) {
      toast.error("Email send failed ❌");
    }
  };

  // ================= MAPBOX SECTION =================
  const MapSection = () => (
    <div className="p-6 bg-black/40 rounded-2xl border border-emerald-500/20">

      <h2 className="text-emerald-300 font-bold mb-4">
        🗺️ Nearby Hospitals (Mapbox Live)
      </h2>

      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          latitude: location.lat,
          longitude: location.lng,
          zoom: 12
        }}
        style={{ width: "100%", height: 420 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >

        <Marker latitude={location.lat} longitude={location.lng}>
          <div className="text-2xl">🧍</div>
        </Marker>

      </Map>

    </div>
  );

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-[#020617] via-[#052e2b] to-black text-white">

      {/* SIDEBAR */}
      <div className="w-72 bg-black/40 p-6 border-r border-emerald-500/20">

        <h1 className="text-2xl font-bold text-emerald-400 mb-8">
          🏥 HealthNet 
        </h1>

        {["dashboard", "alerts", "insurance", "relatives", "map", "notifications"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`w-full mb-2 px-4 py-3 rounded-xl ${
              tab === item ? "bg-emerald-500 text-black font-bold" : "hover:bg-emerald-900/40"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}

      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">

        {/* TOP */}
        <div className="flex justify-between items-center bg-black/30 p-5 rounded-2xl border border-emerald-500/20">

          <h2 className="text-xl font-bold text-emerald-300">
            💚 Live ICU Monitoring 💚
          </h2>

          <div className="flex gap-3">

            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 bg-emerald-500 text-black rounded-xl"
            >
              Theme
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-red-500 rounded-xl"
            >
              Logout
            </button>

          </div>

        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="space-y-6">

            <div className="grid md:grid-cols-3 gap-5">
              <div className="p-6 bg-black/40 rounded-xl border border-red-500/30">
                ❤️ Heart: {health[0]?.heartbeat || "--"}
              </div>
              <div className="p-6 bg-black/40 rounded-xl border border-blue-500/30">
                🫁 SPO2: {health[0]?.spo2 || "--"}
              </div>
              <div className="p-6 bg-black/40 rounded-xl border border-green-500/30">
                🍬 Sugar: {health[0]?.sugar || "--"}
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chart}>
                  <CartesianGrid stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Legend />

                  <Line type="monotone" dataKey="heartbeat" stroke="#ef4444" strokeWidth={3} />
                  <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="sugar" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* RELATIVES */}
        {tab === "relatives" && (
          <div>

            <button
              onClick={addRelative}
              className="mb-4 px-4 py-2 bg-emerald-500 text-black rounded-xl"
            >
              + Add Relative
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              {relatives.map((r, i) => (
                <div key={i} className="p-5 bg-blue-500/10 rounded-xl border border-blue-500/20">

                  <h3>👤 {r.name}</h3>
                  <p>📞 {r.phone}</p>
                  <p>📧 {r.email}</p>

                  <button
                    onClick={() => sendMessage(r.email)}
                    className="mt-3 px-3 py-1 bg-yellow-500 text-black rounded"
                  >
                    Send Message 📩
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* MAP */}
        {tab === "map" && <MapSection />}

        {/* ALERTS */}
        {tab === "alerts" && (
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                🚨 {a.message}
              </div>
            ))}
          </div>
        )}

        {/* INSURANCE */}
        {tab === "insurance" && (
          <div className="grid md:grid-cols-2 gap-4">
            {insurance.map((i, idx) => (
              <div key={idx} className="p-5 bg-green-500/10 rounded-xl border border-green-500/20">
                🏥 {i.plan} <br />
                {i.reason}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}