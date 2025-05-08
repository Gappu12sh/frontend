import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Select from 'react-select';
import axios from "axios";
type PasswordField = "password" | "confirmPassword";

interface employee_plan {
  value: string;
  label: string;
}
interface designation{
  value: string;
  label: string;
}
const Register = () => {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    user_name: "",
    user_lname: "",
    user_mobile: "",
    user_alt_mobile: "",
    user_email: "",
    user_designation: "",
    dob: "",
    user_address: "",
    user_state: "",
    user_country: "",
    user_zipcode: "",
    user_password: "",
    organization_name: "",
    organization_website: "",
    employee_plan_size: 0,
    subscription_plan: 1,
  })
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_URL;
  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const UserDesignation = [
    { value: "CEO", label: "Chief Executive Officer" },
    { value: "CTO", label: "Chief Technology Officer" },
    { value: "CFO", label: "Chief Financial Officer" },
    { value: "COO", label: "Chief Operating Officer" },
    { value: "Manager", label: "Manager" },
    { value: "Marketing", label: "Marketing Lead" },
    { value: "HR", label: "Human Resources" },
  ];

  const userPlan=[
    { value:10, label:"0-10"},
    { value:20, label:"0-20"},
    { value:30, label:"0-30"},
    { value:40, label:"0-40"},
    { value:50, label:"Under 50"},
    { value:100, label:"Under 100"},
  ]
  // const handleSubmit = async (e: React.FormEvent) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData)

    try {
      const response = await axios.post(
        `${apiUrl}/api/organization/adminSignup`,
        formData
      );
      console.log('Response:', response.data);
      setFormData({
        user_name: "",
        user_lname: "",
        user_mobile: "",
        user_alt_mobile: "",
        user_email: "",
        user_designation: "",
        dob: "",
        user_address: "",
        user_state: "",
        user_country: "",
        user_zipcode: "",
        user_password: "",
        organization_name: "",
        organization_website: "",
        employee_plan_size: 0,
        subscription_plan: 1,
      }
    );
    navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      console.log("error is",error)
    }
  };
  const handleSelectChange = (selected: designation | null) => {
    setFormData((prevState) => ({
      ...prevState,
      user_designation: selected ? selected.value : '',
    }));
  };
  const employeePlan = (selected: employee_plan | null) => {
    setFormData((prevState) => ({
      ...prevState,
      user_designation: selected ? selected.value : '',
    }));
  };

  return (
    <div className="container-fuild">

      {/* <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100"> */}
      <div className="w-auto ">

        <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
          <div className="col-md-4 mx-auto vh-100">
            <form className="vh-100" onSubmit={handleSubmit} >
              <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                <div className=" mx-auto mb-2 text-center">
                  <ImageWithBasePath src="assets/img/logo2.svg" width={270} className="img-fluid" alt="Logo" />
                </div>
                <div className="">
                  <div className="text-center mb-2">
                    <h2 className="mb-2">Sign Up</h2>
                    <p className="mb-0">Please enter your details to sign up</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        required
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-user" />
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="user_lname"
                        value={formData.user_lname}
                        className="form-control border-end-0"
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-user" />
                      </span>
                    </div>
                    </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        className="form-control border-end-0"
                        onChange={handleChange}
                        required
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
                        type={
                          passwordVisibility.password
                            ? "text"
                            : "password"
                        }
                        name="user_password"
                        value={formData.user_password}
                        className="pass-input form-control"
                        onChange={handleChange}
                      />
                      <span
                        className={`ti toggle-passwords ${passwordVisibility.password
                          ? "ti-eye"
                          : "ti-eye-off"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility("password")
                        }
                      ></span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                        Date of Birth <span className="text-danger"> *</span>
                    </label>
                    <div className="input-icon-end position-relative">


                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            className="form-control datetimepicker"
                            placeholder="DD-MM-YYYY"
                            onChange={handleChange}
                            required
                        />

                        <span className="input-icon-addon">
                            <i className="ti ti-calendar text-gray-7" />
                        </span>
                    </div>
                </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="user_mobile"
                        value={formData.user_mobile}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-mobile" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Alternate Mobile</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="user_alt_mobile"
                        value={formData.user_alt_mobile}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                      <i className="ti ti-mobile" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      User Designation<span className="text-danger"> *</span>
                    </label>
                    <Select
                      name="user_designation"
                      className="select"
                      options={UserDesignation}
                      value={UserDesignation.find(option => option.value === formData.user_designation)}
                      onChange={handleSelectChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Employee Plan size<span className="text-danger"> *</span>
                    </label>
                    <Select
                      name="employee_plan_size"
                      className="select"
                      options={userPlan}
                      value={userPlan.find(option => option.value === formData.employee_plan_size)}
                      onChange={employeePlan}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="user_country"
                        value={formData.user_country}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-location-pin" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="user_address"
                        value={formData.user_address}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-location-pin" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="user_state"
                        value={formData.user_state}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti-location-arrow" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zip Code</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="user_zipcode"
                        value={formData.user_zipcode}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti-location-pin" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Organization Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="organization_name"
                        value={formData.organization_name}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-dropbox" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Organization Website</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="organization_website"
                        value={formData.organization_website}
                        className="form-control border-end-0"
                        onChange={handleChange}
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-world" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
        
                    </div>
                  </div>
                  {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Sign In
                    </button>
                  </div>
                  <div className="text-center">
                    <h6 className="fw-normal text-dark mb-0">
                      Already have an account?
                      <Link to='/' className="hover-a">
                        {" "}
                        Sign In{" "}
                      </Link>
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

  );
};

export default Register;
