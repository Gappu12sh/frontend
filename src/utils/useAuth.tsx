import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const expiryTime = decoded.exp ? decoded.exp * 1000 : 0; 
        const currentTime = Date.now();

        if (currentTime < expiryTime) {
          if (window.location.pathname === "/") {
            navigate("/index");
          }
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    } 
    else {
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate]);
};

export default useAuth;


// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const useAuth = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token && !isTokenExpired(token)) {
//       return;
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const isTokenExpired = (token: string): boolean => {
//     try {
//       const decodedToken: any = jwtDecode(token);
//       const expirationTime = decodedToken.exp * 1000;
//       const currentTime = Date.now();

//       return currentTime >= expirationTime;
//     } catch (error) {
//       return true; 
//     }
//   };
// };

// export default useAuth;
