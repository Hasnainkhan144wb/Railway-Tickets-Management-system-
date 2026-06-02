import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaTicketAlt,
  FaUsers,
  FaTrain,
  FaCheckCircle,
} from "react-icons/fa";


const StaffDashboardContent = () => {

  const [bookings, setBookings] =
    useState([]);

  const [trains, setTrains] =
    useState([]);


  // FETCH DATA

  const fetchData =
    async () => {

      try {

        // BOOKINGS

        const bookingRes =
          await axios.get(
            "http://localhost:5000/api/bookings"
          );

        setBookings(
          bookingRes.data
        );


        // TRAINS

        const trainRes =
          await axios.get(
            "http://localhost:5000/api/trains"
          );

        setTrains(
          trainRes.data
        );

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchData();

  }, []);


  // ONLY VERIFIED BOOKINGS

  const verifiedBookings =
    bookings.filter(
      (booking) =>
        booking.verified === true
    );


  // TOTAL PASSENGERS

  const totalPassengers =
    new Set(
      verifiedBookings.map(
        (booking) =>
          booking.user?._id
      )
    ).size;


  return (
    <>
      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Staff Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage railway bookings and passengers efficiently.
        </p>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* TOTAL BOOKINGS */}

        <div className="bg-white shadow-md rounded-xl p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Total Bookings
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  verifiedBookings.length
                }
              </h2>

            </div>

            <FaTicketAlt className="text-4xl text-blue-500" />

          </div>

        </div>


        {/* PASSENGERS */}

        <div className="bg-white shadow-md rounded-xl p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Passengers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  totalPassengers
                }
              </h2>

            </div>

            <FaUsers className="text-4xl text-green-500" />

          </div>

        </div>


        {/* TRAINS */}

        <div className="bg-white shadow-md rounded-xl p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Trains
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  trains.length
                }
              </h2>

            </div>

            <FaTrain className="text-4xl text-purple-500" />

          </div>

        </div>


        {/* VERIFIED TICKETS */}

        <div className="bg-white shadow-md rounded-xl p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Verified Tickets
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  verifiedBookings.length
                }
              </h2>

            </div>

            <FaCheckCircle className="text-4xl text-green-600" />

          </div>

        </div>

      </div>


      {/* RECENT VERIFIED BOOKINGS */}

      <div className="bg-white shadow-md rounded-xl p-6 border">

        <h2 className="text-2xl font-bold mb-6">
          Recent Bookings
        </h2>

        <div className="overflow-auto max-h-[400px]">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Passenger
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Train
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Route
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Seats
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {verifiedBookings
                .slice(0, 5)
                .map((booking) => (

                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">

                      {
                        booking.passengerName
                      }

                    </td>

                    <td className="p-3">

                      {
                        booking.train
                          ?.trainName
                      }

                    </td>

                    <td className="p-3">

                      {
                        booking.train
                          ?.source
                      }

                      {" → "}

                      {
                        booking.train
                          ?.destination
                      }

                    </td>

                    <td className="p-3">

                      {
                        booking.seatsBooked
                      }

                    </td>

                    <td className="p-3">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                        Verified

                      </span>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

export default StaffDashboardContent;
