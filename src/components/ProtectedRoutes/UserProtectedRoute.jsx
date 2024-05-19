import { Navigate } from "react-router-dom";

export const UserProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    if (!user?.isUser) {
      if(user){
        redirectPath = '/forbiden'
      }
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };