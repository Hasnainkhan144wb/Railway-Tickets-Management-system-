import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ManageSeats = ({ isSubView }) => {
  const [trains, setTrains] = useState([]);
  const [updatedSeats, setUpdatedSeats] = useState({});

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

  // UPDATE SEATS
  const updateSeats = async (id) => {
    if (updatedSeats[id] === undefined || updatedSeats[id] === "") {
      alert("Please enter a seat count.");
      return;
    }
    const count = Number(updatedSeats[id]);
    if (isNaN(count) || count < 0) {
      alert("Seat count cannot be negative.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/trains/${id}`, {
        seats: count,
      });
      alert("Seats Updated Successfully");
      fetchTrains();
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Seat Availability</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage and override available seats for scheduled routes.</p>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Route</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Departure</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Current Seats</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Update Seats</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train._id} className="border-b hover:bg-gray-55">
                  <td className="p-3 font-semibold text-gray-850">{train.trainName}</td>
                  <td className="p-3 text-sm">{train.source} → {train.destination}</td>
                  <td className="p-3 text-sm">{train.departureTime}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${
                        train.seats <= 5 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {train.seats}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter seats"
                      className="border p-2 rounded-lg w-32 focus:outline-none focus:border-green-900 transition text-sm"
                      onChange={(e) =>
                        setUpdatedSeats({
                          ...updatedSeats,
                          [train._id]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateSeats(train._id)}
                      className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition text-xs font-bold"
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
    </>
  );

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default ManageSeats;