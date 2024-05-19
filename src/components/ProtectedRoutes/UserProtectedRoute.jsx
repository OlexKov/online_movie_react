import { Navigate } from "react-router-dom";
import { userMethods } from "../../helpers/methods";

export const UserProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    if (!userMethods.isUser(user)) {
      if(userMethods.isAuthenticated(user)){
        redirectPath = '/forbiden'
      }
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };