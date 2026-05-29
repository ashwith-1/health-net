import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Relatives() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [relatives, setRelatives] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const patientId = localStorage.getItem("patientId");

  // ================= FETCH RELATIVES =================
  const fetchRelatives = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/relatives/${patientId}`);

      setRelatives(res.data?.relatives || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load relatives ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD RELATIVE =================
  const addRelative = async () => {
    if (!name || !phone || !relation) {
      toast.error("Please fill all fields ❌");
      return;
    }

    try {
      setLoading(true);

      await API.post("/relatives", {
        patientId,
        name,
        phone,
        relation,
      });

      toast.success("Relative added ✅");

      setName("");
      setPhone("");
      setRelation("");

      fetchRelatives();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add relative ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchRelatives();
    }
  }, [patientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 p-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-green-800">
          👨‍👩‍👧 Emergency Contacts
        </h1>
        <p className="text-green-700 mt-2">
          Add trusted contacts for emergency alerts
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-xl mx-auto bg-white/80 p-6 rounded-3xl shadow-xl mb-10">

        <input
          className="w-full p-3 mb-3 rounded-xl border"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 rounded-xl border"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded-xl border"
          placeholder="Relation"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />

        <button
          onClick={addRelative}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Processing..." : "Add Relative"}
        </button>

        {/* OPTIONAL INFO */}
        <p className="text-center text-gray-600 mt-3 text-sm">
          You can add 1 or more emergency contacts (user choice)
        </p>

        <p className="text-center text-green-700 mt-2 font-medium">
          Total Contacts: {relatives.length}
        </p>
      </div>

      {/* LIST */}
      <div className="max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-green-800 mb-5">
          Saved Contacts
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : relatives.length === 0 ? (
          <p className="text-center text-gray-600">
            No relatives added yet
          </p>
        ) : (
          <div className="grid gap-4">

            {relatives.map((r) => (
              <div
                key={r._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h3 className="text-lg font-bold">{r.name}</h3>
                <p>📞 {r.phone}</p>
                <p>🧬 {r.relation}</p>
              </div>
            ))}

          </div>
        )}

        {/* ================= DASHBOARD BUTTON ================= */}
        <button
          onClick={() => {
            if (relatives.length === 0) {
              toast.info("Please add at least 1 contact for safety");
            } else {
              navigate("/dashboard");
            }
          }}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg"
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Relatives;