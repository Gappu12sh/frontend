import React, { useState } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import axios from "axios";
import Select from "react-select";
interface level {
  value: number;
  label: number;
}

const AddRole: React.FC = () => {
  const [formData, setFormData] = useState<{ role_name: string; role_level: number; role_permission: string[] }>({
    role_name: "",
    role_level: 0,
    role_permission: [],
  });
  const level = [
    { value: 1, level: 1 },
    { value: 2, level: 2 },
    { value: 3, level: 3 },
    { value: 4, level: 4 },
    { value: 5, level: 5 },
    { value: 6, level: 6 },
    { value: 7, level: 7 },
    { value: 8, level: 8 },
    { value: 9, level: 9 },
    { value: 10, level: 10 },
  ]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => {
      let updatedPermissions = [...prevData.role_permission];

      if (checked) {
        updatedPermissions.push(name);
      } else {
        // If unchecked, remove permission from array
        updatedPermissions = updatedPermissions.filter(
          (permission) => permission !== name
        );
      }

      return {
        ...prevData,
        role_permission: updatedPermissions,
      };
    });
  };
  const handleSelectChange = (selected: level | null) => {
    setFormData((prevState) => ({
      ...prevState,
      role_level: selected ? selected.value : 0,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const apiUrl = process.env.REACT_APP_URL;
    const token = localStorage.getItem("token")
    const response=await axios.post(`${apiUrl}/api/role/add`,formData,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    console.log('Response:', response.data);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper  d-flex flex-column justify-content-between min-vh-100">
        <div className="content flex-fill h-100">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Add Role</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/index">
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Add Role</li>
                </ol>
              </nav>
            </div>
            <div className="head-icons ms-2">
              <CollapseHeader />
            </div>
          </div>
          {/* /Breadcrumb */}

          {/* Add Role Form */}
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      name="roleName"
                      className="form-control"
                      value={formData.role_name}
                      onChange={(e) =>
                        setFormData({ ...formData, role_name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Role Level</label>
                    <Select
                      name="role_level"
                      className="select"
                      options={level.map(item => ({ value: item.value, label: item.level }))}
                      value={level.find(option => option.value === formData.role_level)}
                      onChange={handleSelectChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="form-label">Permissions</label>
              <div className="mb-3" style={{ display: "flex", gap: 100 }}>
                <div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="USER-VIEW"
                      className="form-check-input"
                      checked={formData.role_permission.includes("USER-VIEW")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">User View</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="USER-UPDATE"
                      className="form-check-input"
                      checked={formData.role_permission.includes("USER-UPDATE")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">User Update</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="USER-DELETE"
                      className="form-check-input"
                      checked={formData.role_permission.includes("USER-DELETE")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">User Delete</label>
                  </div>
                </div>
                <div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="LEAD-CREATE"
                      className="form-check-input"
                      checked={formData.role_permission.includes("LEAD-CREATE")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Lead Create</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="LEAD-ASSIGN"
                      className="form-check-input"
                      checked={formData.role_permission.includes("LEAD-ASSIGN")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Lead Assign</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="LEAD-DELETE"
                      className="form-check-input"
                      checked={formData.role_permission.includes("LEAD-DELETE")}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Lead Delete</label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <Link to="/index" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
          {/* /Add Role Form */}
        </div>

        {/* Footer */}

        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2025 © Quarkleads.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Shulyn Technology
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default AddRole;