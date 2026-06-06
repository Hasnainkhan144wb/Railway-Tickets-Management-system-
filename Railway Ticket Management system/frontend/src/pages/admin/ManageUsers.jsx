import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ManageUsers = ({ isSubView }) => {
  const [users, setUsers] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser.id || currentUser._id;
    if (id === currentUserId) {
      alert("You cannot delete your own account. Use the profile update in the top-right corner to edit your profile details.");
      return;
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id || currentUser._id;

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-550 mt-2">View and manage all system users.</p>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Name</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Email</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Role</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-750">{user.name}</td>
                  <td className="p-3 font-medium text-gray-650">{user.email}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-105 text-blue-750 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {user._id === currentUserId ? (
                      <span className="text-xs font-bold text-gray-400 italic">Self (Active Session)</span>
                    ) : (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-650 text-white px-4 py-2 rounded-lg transition text-xs font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
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

export default ManageUsers;