import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ManageTrainStatus = ({ isSubView }) => {
  const [trains, setTrains] = useState([]);
  const [editingTrain, setEditingTrain] = useState(null);
  const [departureTime, setDepartureTime] = useState("");
  const [trainStatus, setTrainStatus] = useState("On Time");
  const [seats, setSeats] = useState("");

  // FETCH TRAINS
  const fetchTrains = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trains");
      setTrains(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // EDIT TRAIN
  const editHandler = (train) => {
    setEditingTrain(train);
    setDepartureTime(train.departureTime);
    setTrainStatus(train.trainStatus || "On Time");
    setSeats(train.seats);
  };

  // UPDATE TRAIN
  const updateTrain = async () => {
    if (!editingTrain) return;
    try {
      await axios.put(`http://localhost:5000/api/trains/${editingTrain._id}`, {
        departureTime,
        trainStatus,
        seats,
      });
      alert("Train Updated Successfully");
      setEditingTrain(null);
      fetchTrains();
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Train Status & Schedule</h1>
        <p className="text-gray-500 mt-2 font-medium">Update departure schedules, delays, and routes status.</p>
      </div>

      {/* TRAIN TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Route</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Departure</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Seats</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Status</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train._id} className="border-b hover:bg-gray-55">
                  <td className="p-3 font-semibold text-gray-800">{train.trainName}</td>
                  <td className="p-3 text-sm">{train.source} → {train.destination}</td>
                  <td className="p-3 text-sm">{train.departureTime}</td>
                  <td className="p-3 text-sm">{train.seats}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        train.trainStatus === "On Time"
                          ? "bg-green-100 text-green-700"
                          : train.trainStatus === "Delayed"
                          ? "bg-yellow-100 text-yellow-750"
                          : "bg-red-105 text-red-700"
                      }`}
                    >
                      {train.trainStatus || "On Time"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => editHandler(train)}
                      className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE FORM */}
      {editingTrain && (
        <div className="bg-white shadow-md rounded-2xl p-6 border mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Update Train: {editingTrain.trainName}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">Departure Time</label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="border p-3 rounded-xl focus:outline-none"
                placeholder="Departure Time"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">Seats</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="border p-3 rounded-xl focus:outline-none"
                placeholder="Seats"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">Train Status</label>
              <select
                value={trainStatus}
                onChange={(e) => setTrainStatus(e.target.value)}
                className="border p-3 rounded-xl bg-white focus:outline-none text-sm text-gray-700"
              >
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={updateTrain}
              className="bg-green-900 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingTrain(null)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-650 font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default ManageTrainStatus;