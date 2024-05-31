import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {
    
    if(user){
      if(!user.isAdmin){
        redirectPath = '/forbiden'
      }
      else{
        return children;
      } 
    }
    return <Navigate to={redirectPath} replace />
  };