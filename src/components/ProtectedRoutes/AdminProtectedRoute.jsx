import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    
    if (!user?.isAdmin) {
      if(user){
        redirectPath = '/forbiden'
      }
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };