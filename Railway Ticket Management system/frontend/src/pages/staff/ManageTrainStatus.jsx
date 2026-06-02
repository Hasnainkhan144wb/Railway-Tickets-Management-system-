import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const ManageTrainStatus = () => {

  const [trains, setTrains] =
    useState([]);

  const [editingTrain,
    setEditingTrain] =
    useState(null);

  const [departureTime,
    setDepartureTime] =
    useState("");

  const [trainStatus,
    setTrainStatus] =
    useState("On Time");

  const [seats,
    setSeats] =
    useState("");


  // FETCH TRAINS

  const fetchTrains =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/trains"
          );

        setTrains(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchTrains();

  }, []);


  // EDIT TRAIN

  const editHandler =
    (train) => {

      setEditingTrain(train);

      setDepartureTime(
        train.departureTime
      );

      setTrainStatus(
        train.trainStatus
      );

      setSeats(
        train.seats
      );
    };


  // UPDATE TRAIN

  const updateTrain =
    async () => {

      try {

        await axios.put(
          `http://localhost:5000/api/trains/${editingTrain._id}`,
          {
            departureTime,
            trainStatus,
            seats,
          }
        );

        alert(
          "Train Updated Successfully"
        );

        setEditingTrain(null);

        fetchTrains();

      } catch (error) {

        console.log(error);
      }
    };


  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Manage Train Status & Schedule
        </h1>

        <p className="text-gray-500 mt-2">
          Staff can update train schedules,
          status, and seat availability.
        </p>

      </div>


      {/* TRAIN TABLE */}

      <div className="bg-white shadow-md rounded-xl p-6 border">

        <div className="overflow-auto max-h-[500px]">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Train
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Route
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Departure
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Seats
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Status
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {trains.map(
                (train) => (

                  <tr
                    key={train._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {train.trainName}
                    </td>

                    <td className="p-3">
                      {train.source}
                      {" → "}
                      {train.destination}
                    </td>

                    <td className="p-3">
                      {train.departureTime}
                    </td>

                    <td className="p-3">
                      {train.seats}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${train.trainStatus === "On Time"
                            ? "bg-green-100 text-green-700"
                            : train.trainStatus === "Delayed"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >

                        {train.trainStatus}

                      </span>

                    </td>

                    <td className="p-3">

                      <button
                        onClick={() =>
                          editHandler(train)
                        }
                        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                      >
                        Update
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* UPDATE FORM */}

      {editingTrain && (

        <div className="bg-white shadow-md rounded-xl p-6 border mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Update Train
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <input
              type="text"
              value={departureTime}
              onChange={(e) =>
                setDepartureTime(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              placeholder="Departure Time"
            />

            <input
              type="number"
              value={seats}
              onChange={(e) =>
                setSeats(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              placeholder="Seats"
            />

            <select
              value={trainStatus}
              onChange={(e) =>
                setTrainStatus(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
            >

              <option>
                On Time
              </option>

              <option>
                Delayed
              </option>

              <option>
                Cancelled
              </option>

            </select>

          </div>

          <button
            onClick={updateTrain}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>

        </div>

      )}

    </DashboardLayout>
  );
};

export default ManageTrainStatus;