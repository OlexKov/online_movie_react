import { Navigate } from "react-router-dom";

export const AuthProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };