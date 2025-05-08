import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../../utils/useAuth";

type PasswordField = "password";
interface DecodedToken {
  id: string;
  email: string;
  role: string;
  org:string;
  name:string;
  permissions:string;
}
const Login = () => {
  const [user_email, setEmail] = useState<string>("");
  const [user_password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{ password: boolean }>({
    password: false,
  });

  
  const navigation = useNavigate();
  
  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      const emailLowercase=user_email.toLowerCase();
      const apiUrl = process.env.REACT_APP_URL;
   
      const response = await axios.post(`${apiUrl}/api/user/login`, { 

      user_email: emailLowercase,
        user_password,
      });
      // console.log(response)

      const decoded = jwtDecode<DecodedToken>(response.data.token); 

      // console.log(response.data.token)
      console.log("decoded token is ",decoded)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id",decoded.id)
      localStorage.setItem("role",decoded.role)
      localStorage.setItem("org",decoded.org)
      localStorage.setItem("name",decoded.name);
      localStorage.setItem("email",decoded.email);
      localStorage.setItem("permissions",decoded.permissions)
      
      const api=process.env.REACT_APP_FETCH_ROLE;
     
      // console.log("url is ",api)
      navigation("/index");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };
    useAuth()
  


  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
    
           <div className="col-lg-5">
        <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
          <div className="bg-overlay-img">
            <ImageWithBasePath src="assets/img/bg/bg-01.png" className="bg-1" alt="Img" />
            <ImageWithBasePath src="assets/img/bg/bg-02.png" className="bg-2" alt="Img" />
            <ImageWithBasePath src="assets/img/bg/bg-03.png" className="bg-3" alt="Img" />
          </div>
          <div className="authentication-card w-full min-h-[80vh] overflow-hidden">
            <div className="authen-overlay-item border w-full">
              <h1 className="text-white text-6xl">
                Empowering teams <br /> with effortless CRM <br />integration and <br /> management.
              </h1>
              <div className="my-4 mx-auto authen-overlay-img">
                <ImageWithBasePath src="assets/img/bg/authentication-bg-01.png" alt="Img" />
              </div>
              <div>
                <p className="text-white text-lg font-semibold text-center">
                  Efficiently manage your workforce, streamline <br /> operations effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100">
                <form onSubmit={handleLogin} className="vh-100">
                  <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                    <div className="mx-auto mb-4 text-center">
                      <ImageWithBasePath src="assets/img/logo2.svg" width={300}className="img-fluid" alt="Logo" />
                    </div>
                    <div>
                      <div className="text-center mb-3">
                        <h2 className="mb-2">Sign In</h2>
                        <p className="mb-0">Please enter your details to sign in</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                          <input
                            type="email"
                            value={user_email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control border-end-0"
                            />
                          <span className="input-group-text border-start-0">
                            <i className="ti ti-mail" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="pass-group">
                          <input
                            type={passwordVisibility.password ? "text" : "password"}
                            value={user_password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pass-input form-control"
                            />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"}`}
                            onClick={() => togglePasswordVisibility("password")}
                            ></span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="form-check form-check-md mb-0">
                          <input className="form-check-input" id="remember_me" type="checkbox" />
                          <label htmlFor="remember_me" className="form-check-label mt-0">
                            Remember Me
                          </label>
                        </div>
                        <div className="text-end">
                          <Link to={all_routes.forgotPassword} className="link-danger">
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary w-100">
                          Sign In
                        </button>
                      </div>
                      <div className="text-center">
                        <h6 className="fw-normal text-dark mb-0">
                          Don’t have an account?
                          <Link to={all_routes.register} className="hover-a"> Create Account</Link>
                        </h6>
                      </div>
                    </div>
                    <div className="mt-5 pb-4 text-center">
                      <p className="mb-0 text-gray-9">Copyright © 2025 - Quarkleads</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
