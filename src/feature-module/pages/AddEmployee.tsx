import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import axios from "axios";
import Select from "react-select";
type PasswordField = "password" | "confirmPassword";

interface IFormInput {
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_country: string;
  user_designation: string;
  user_createdby: string;
  user_zipcode: number;
  user_state: string;
  user_address: string;
  user_alt_mobile: number;
  user_lname: string;
  user_password: string;
  user_report_to: string;
  user_role: string;
  organization_name: string;
  dob: Date | null;
}
interface RoleOption {
  value: string;
  label: string;
}
const AddEmployee = () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id") ?? "";
  const org = localStorage.getItem("org") ?? "";
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportToOptions, setReportToOptions] = useState<RoleOption[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_URL;
  const permissions=localStorage.getItem("permissions")
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_mobile: "",
    user_country: "",
    user_designation: "",
    user_createdby: id,
    user_zipcode: "",
    user_state: "",
    user_address: "",
    user_alt_mobile: "",
    user_lname: "",
    user_password: "",
    user_report_to: "",
    user_role: "",
    organization_name: org,
    dob: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const routes = all_routes;
  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/user/reportTo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // const roleOptions: RoleOption[] = response.data.allRoles.map((role: { role_name: string; role_level: number }) => ({
        const roleOptions: RoleOption[] = response.data.allRoles.map(
          (role: { role_name: string }) => ({
            value: role.role_name,
            label:
              role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1), // Capitalize role name
          })
        );
        console.log("roleoptions are", roleOptions);

        const reportToRoleOptions: RoleOption[] = [];
        Object.keys(response.data.users).forEach((role) => {
          (
            response.data.users[role] as {
              user_id: number;
              user_name: string;
            }[]
          ).forEach((user) => {
            reportToRoleOptions.push({
              value: user.user_id.toString(),
              // value: user.user_id,

              label: `${role.charAt(0).toUpperCase() + role.slice(1)} - ${
                user.user_name
              }`, // Format: Role - UserName
            });
          });
        });

        setRoles(roleOptions);
        setReportToOptions(reportToRoleOptions);
        console.log("role", roles);
        console.log("report to", reportToOptions);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };

    fetchRoles();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log(formData);

    try {
      const response = await axios.post(`${apiUrl}/api/user/signup`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setSuccessMessage("Signup successful!");
      console.log("Response:", response.data);
      setFormData({
        user_name: "",
        user_email: "",
        user_mobile: "",
        user_country: "",
        user_designation: "",
        user_createdby: id,
        user_zipcode: "",
        user_state: "",
        user_address: "",
        user_alt_mobile: "",
        user_lname: "",
        user_password: "",
        user_report_to: "",
        user_role: "",
        organization_name: org,
        dob: "",
      });
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };
  const handleSelectChange = (
    selected: RoleOption | null,
    field: keyof IFormInput
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selected ? selected.value : "",
    }));
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto">
              <h2 className="mb-1">Add Employee </h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Employee</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Employee{" "}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2"></div>

              <div className="mb-2">
                <Link
                  to="/index"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Employee Grid
                </Link>
              </div>
              <div className="head-icons ms-2">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
         {
          permissions==="DEFAULT"? <form onSubmit={handleSubmit}>
          <div className="contact-grids-tab">
            <ul className="nav nav-underline" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="info-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#basic-info"
                  type="button"
                  role="tab"
                  aria-selected="true"
                >
                  Basic Information
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="basic-info"
              role="tabpanel"
              aria-labelledby="info-tab"
              tabIndex={0}
            >
              <div className="modal-body pb-0 ">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        First Name <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        placeholder="John"
                        value={formData.user_name}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="user_lname"
                        placeholder="Doe"
                        value={formData.user_lname}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Email <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="user_email"
                        placeholder= "john.doe@example.com"
                        value={formData.user_email}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="pass-group">
                        <input
                          type={
                            passwordVisibility.password ? "text" : "password"
                          }
                          placeholder="********"
                          name="user_password"
                          value={formData.user_password}
                          className="form-control"
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="ti toggle-password ti-eye-off"
                          onClick={() => togglePasswordVisibility("password")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Phone Number(whatsapp){" "}
                        <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        placeholder="+1 234 567 890"
                        name="user_mobile"
                        value={formData.user_mobile}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />{" "}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Alternate Phone Number
                      </label>
                      <input
                        type="number"
                        name="user_alt_mobile"
                        placeholder="+1 987 654 321"
                        value={formData.user_alt_mobile}
                        className="form-control"
                        onChange={handleChange}
                      />{" "}
                    </div>
                  </div>

                  <div className="col-md-4">
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
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <Select
                        name="user_role"
                        options={roles}
                        value={
                          roles.find(
                            (option) => option.value === formData.user_role
                          ) || null
                        }
                        onChange={(selected: any) =>
                          handleSelectChange(selected, "user_role")
                        }
                        className="select"
                        placeholder="Select Role"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Report to</label>

                      <Select
                        name="user_report_to"
                        options={reportToOptions}
                        value={
                          reportToOptions.find(
                            (option) =>
                              option.value === formData.user_report_to
                          ) || null
                        }
                        onChange={(selected: any) =>
                          handleSelectChange(selected, "user_report_to")
                        }
                        className="select"
                        placeholder="Reporting to"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        name="user_designation"
                        placeholder="Senior Developer"
                        value={formData.user_designation}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Country <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="user_country"
                        placeholder="United States"
                        value={formData.user_country}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />{" "}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        State <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="user_state"
                        placeholder="California"
                        value={formData.user_state}
                        className="form-control"
                        onChange={handleChange}
                        required
                      />{" "}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Zip Code <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        name="user_zipcode"
                        value={formData.user_zipcode}
                        className="form-control"
                        placeholder="90001"
                        onChange={handleChange}
                        required
                      />{" "}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Address <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        name="user_address"
                        placeholder="1234 Elm Street, Los Angeles, CA"
                        className="form-control"
                        rows={2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Created By <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="user_createdby"
                        value={id}
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={org}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-light border me-2"
                  style={{ marginBottom: 20 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginBottom: 20 }}
                >
                  Save{" "}
                </button>
              </div>
            </div>
          </div>
        </form>:<h1>You don't have permission to access this page </h1>
         }
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
