import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ManageTrains = ({ isSubView }) => {
  const [trains, setTrains] = useState([]);
  const [editingTrain, setEditingTrain] = useState(null);

  const [formData, setFormData] = useState({
    trainName: "",
    source: "",
    destination: "",
    departureTime: "",
    travelDate: "",
    totalCoaches: "7",
    ticketPrice: "",
  });

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

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD TRAIN
  const addTrainHandler = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.ticketPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Ticket price must be a positive value.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/trains", formData);
      alert("Train Added Successfully");
      setFormData({
        trainName: "",
        source: "",
        destination: "",
        departureTime: "",
        travelDate: "",
        totalCoaches: "7",
        ticketPrice: "",
      });
      fetchTrains();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add train");
    }
  };

  // DELETE TRAIN
  const deleteHandler = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this train route?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/trains/${id}`);
      fetchTrains();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT TRAIN
  const editHandler = (train) => {
    setEditingTrain(train._id);
    setFormData({
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      departureTime: train.departureTime,
      travelDate: train.travelDate || "",
      totalCoaches: train.totalCoaches || "7",
      ticketPrice: train.ticketPrice,
    });
  };

  // UPDATE TRAIN
  const updateHandler = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.ticketPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Ticket price must be a positive value.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/trains/${editingTrain}`, formData);
      alert("Train Updated Successfully");
      setEditingTrain(null);
      setFormData({
        trainName: "",
        source: "",
        destination: "",
        departureTime: "",
        travelDate: "",
        totalCoaches: "7",
        ticketPrice: "",
      });
      fetchTrains();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update train");
    }
  };

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Train Routes</h1>
        <p className="text-gray-500 mt-2">Manage railway routes and ticket prices.</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow border mb-10">
        <form
          onSubmit={editingTrain ? updateHandler : addTrainHandler}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <input
            type="text"
            name="trainName"
            placeholder="Train Name"
            value={formData.trainName}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={formData.source}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="departureTime"
            placeholder="Departure Time"
            value={formData.departureTime}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <select
            name="totalCoaches"
            value={formData.totalCoaches}
            onChange={handleChange}
            className="border p-3 rounded-lg bg-white text-gray-700"
            required
          >
            <option value="" disabled>Select Number of Coaches</option>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                {num} Coach{num > 1 ? "es" : ""} ({num * 18} Seats + {num * 60} Berths)
              </option>
            ))}
          </select>
          <input
            type="number"
            name="ticketPrice"
            placeholder="Ticket Price"
            value={formData.ticketPrice}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            min="1"
            required
          />
          <button
            type="submit"
            className="bg-green-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
          >
            {editingTrain ? "Update Train" : "Add Train"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Route</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Date</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Time</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Coaches & Capacity</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Price</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{train.trainName}</td>
                  <td className="p-3">{train.source} → {train.destination}</td>
                  <td className="p-3">{train.travelDate ? new Date(train.travelDate).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="p-3">{train.departureTime}</td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">
                      {train.totalCoaches || 7} Coach{train.totalCoaches > 1 ? "es" : ""}
                    </div>
                    <div className="text-xs text-gray-550 mt-0.5">
                      {train.seats} / {train.totalSeats || (train.totalCoaches * 78)} Available
                    </div>
                  </td>
                  <td className="p-3">Rs. {train.ticketPrice}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => editHandler(train)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(train._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default ManageTrains;