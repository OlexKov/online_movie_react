import { Navigate } from "react-router-dom";

export const UserProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
  }) => {

    if(user){
      if(!user.isUser){
        redirectPath = '/forbiden'
      }
      else{
        return children;
      } 
    }
    return <Navigate to={redirectPath} replace />
    
  };