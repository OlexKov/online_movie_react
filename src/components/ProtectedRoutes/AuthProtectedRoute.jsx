import { Navigate } from "react-router-dom";
import { userMethods } from "../../helpers/methods";

export const AuthProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    if (!userMethods.isAuthenticated(user)) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };