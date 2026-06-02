import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ManageTrains from "./pages/admin/ManageTrains";

import ManageUsers from "./pages/admin/ManageUsers";

import Bookings from "./pages/admin/Bookings";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";

import StaffDashboard from "./pages/staff/StaffDashboard";

import PassengerDashboard from "./pages/passenger/PassengerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import BookTicket from "./pages/passenger/BookTicket";

import MyBookings from "./pages/passenger/MyBookings";

import StaffBookings from "./pages/staff/StaffBookings";

import BookingRecords from "./pages/staff/BookingRecords";

import ReportsAnalytics from "./pages/admin/ReportsAnalytics";

import BookingHistory from "./pages/passenger/BookingHistory";

import VerifyTickets from "./pages/staff/VerifyTickets";

import Support from "./pages/passenger/Support";

import SupportRequests from "./pages/staff/SupportRequests";

import About from "./pages/About";

import ManageSeats from "./pages/staff/ManageSeats";

import ManageTrainStatus from "./pages/staff/ManageTrainStatus";
import Notifications from "./pages/passenger/Notifications";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/reports-analytics"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <ReportsAnalytics />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/booking-records"
          element={
            <ProtectedRoute
              allowedRoles={["staff"]}
            >
              <BookingRecords />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-history"
          element={
            <ProtectedRoute
              allowedRoles={["passenger"]}
            >
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        {/* STAFF ROUTE */}

        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["staff"]}
            >
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-trains"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageTrains />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-seats"
          element={
            <ProtectedRoute role="staff">
              <ManageSeats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-ticket"
          element={
            <ProtectedRoute
              allowedRoles={["passenger"]}
            >
              <BookTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute
              allowedRoles={["passenger"]}
            >
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-train-status"
          element={
            <ProtectedRoute role="staff">
              <ManageTrainStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-bookings"
          element={
            <ProtectedRoute
              allowedRoles={["staff"]}
            >
              <StaffBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute
              allowedRoles={["passenger"]}
            >
              <Support />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["passenger"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support-requests"
          element={
            <ProtectedRoute
              allowedRoles={["staff"]}
            >
              <SupportRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-tickets"
          element={
            <ProtectedRoute
              allowedRoles={["staff"]}
            >
              <VerifyTickets />
            </ProtectedRoute>
          }
        />


        {/* PASSENGER ROUTE */}

        <Route
          path="/passenger-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "passenger",
              ]}
            >
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;