import { Navigate } from "react-router-dom";
import { userMethods } from "../../helpers/methods";


export const AdminProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    
    if (!userMethods.isAdmin(user)) {
      if(userMethods.isAuthenticated(user)){
         redirectPath = '/forbiden'
      }
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };