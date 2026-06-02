import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const ManageSeats = () => {

    const [trains, setTrains] =
        useState([]);

    const [updatedSeats, setUpdatedSeats] =
        useState({});


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


    // UPDATE SEATS

    const updateSeats =
        async (id) => {

            try {

                await axios.put(
                    `http://localhost:5000/api/trains/${id}`,
                    {
                        seats:
                            updatedSeats[id],
                    }
                );

                alert(
                    "Seats Updated Successfully"
                );

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
                    Manage Seat Availability
                </h1>

                <p className="text-gray-500 mt-2">
                    Staff can manage available train seats.
                </p>

            </div>


            {/* TABLE */}

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
                                    Current Seats
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Update Seats
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

                                        {/* TRAIN */}

                                        <td className="p-3 font-semibold">

                                            {
                                                train.trainName
                                            }

                                        </td>


                                        {/* ROUTE */}

                                        <td className="p-3">

                                            {
                                                train.source
                                            }
                                            {" → "}
                                            {
                                                train.destination
                                            }

                                        </td>


                                        {/* DEPARTURE */}

                                        <td className="p-3">

                                            {
                                                train.departureTime
                                            }

                                        </td>


                                        {/* CURRENT SEATS */}

                                        <td className="p-3">

                                            <span
                                                className={`font-bold
                                                ${
                                                    train.seats <= 5
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >

                                                {
                                                    train.seats
                                                }

                                            </span>

                                        </td>


                                        {/* INPUT */}

                                        <td className="p-3">

                                            <input
                                                type="number"
                                                placeholder="Enter seats"
                                                className="border p-2 rounded-lg w-32"
                                                onChange={(e) =>
                                                    setUpdatedSeats({
                                                        ...updatedSeats,
                                                        [train._id]:
                                                            e.target.value,
                                                    })
                                                }
                                            />

                                        </td>


                                        {/* BUTTON */}

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    updateSeats(
                                                        train._id
                                                    )
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

        </DashboardLayout>
    );
};

export default ManageSeats;