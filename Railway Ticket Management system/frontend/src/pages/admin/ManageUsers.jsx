import { useEffect, useState } from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const ManageUsers = () => {

  const [users, setUsers] =
    useState([]);


  // FETCH USERS

  const fetchUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/users"
          );

        setUsers(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchUsers();

  }, []);


  // DELETE USER

  const deleteUser =
    async (id) => {

      try {

        await axios.delete(
          `http://localhost:5000/api/users/${id}`
        );

        alert(
          "User Deleted"
        );

        fetchUsers();

      } catch (error) {

        console.log(error);
      }
    };


  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Manage Users
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage all system users.
        </p>

      </div>


      {/* TABLE */}

      <div className="bg-white shadow-md rounded-xl p-6 border">

        <div className="overflow-auto max-h-[500px]">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Name
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Email
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Role
                </th>

                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">

                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">

                      {user.role}

                    </span>

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteUser(
                          user._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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

    </DashboardLayout>
  );
};

export default ManageUsers;