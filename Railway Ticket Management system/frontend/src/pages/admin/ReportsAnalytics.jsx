import { useEffect, useState } from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const ReportsAnalytics = () => {

  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalBookings: 0,
      totalTrains: 0,
      totalRevenue: 0,
    });


  // FETCH ANALYTICS

  const fetchAnalytics =
    async () => {

      try {

        // USERS

        const usersRes =
          await axios.get(
            "http://localhost:5000/api/users"
          );

        // BOOKINGS

        const bookingsRes =
          await axios.get(
            "http://localhost:5000/api/bookings"
          );

        // TRAINS

        const trainsRes =
          await axios.get(
            "http://localhost:5000/api/trains"
          );

        // REVENUE CALCULATION

        const revenue =
          bookingsRes.data.length * 2500;

        // SET STATS

        setStats({
          totalUsers:
            usersRes.data.length,

          totalBookings:
            bookingsRes.data.length,

          totalTrains:
            trainsRes.data.length,

          totalRevenue: revenue,
        });

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchAnalytics();

  }, []);


  // BAR CHART DATA

  const barData = [

    {
      name: "Users",
      value: stats.totalUsers,
    },

    {
      name: "Bookings",
      value: stats.totalBookings,
    },

    {
      name: "Trains",
      value: stats.totalTrains,
    },

  ];


  // PIE CHART DATA

  const pieData = [

    {
      name: "Revenue",
      value: stats.totalRevenue,
    },

    {
      name: "Bookings",
      value: stats.totalBookings,
    },

  ];


  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Reports & Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          View railway system analytics and reports.
        </p>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* USERS */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-gray-500">
            Total Users
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.totalUsers}
          </p>

        </div>


        {/* BOOKINGS */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-gray-500">
            Total Bookings
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.totalBookings}
          </p>

        </div>


        {/* TRAINS */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-gray-500">
            Total Trains
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.totalTrains}
          </p>

        </div>


        {/* REVENUE */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-gray-500">
            Total Revenue
          </h2>

          <p className="text-4xl font-bold mt-3">
            Rs. {stats.totalRevenue}
          </p>

        </div>

      </div>


      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* BAR CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-2xl font-bold mb-6">
            System Statistics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={barData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* PIE CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">

          <h2 className="text-2xl font-bold mb-6">
            Revenue Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {pieData.map(
                  (entry, index) => (

                    <Cell key={index} />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ReportsAnalytics;