import {
  Navigate,
} from "react-router-dom";


const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // NOT LOGGED IN

  if (!user) {

    return <Navigate to="/login" />;
  }


  // ROLE CHECK

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate to="/" />
    );
  }


  return children;
};

export default ProtectedRoute;