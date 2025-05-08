import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

interface Leads {
  lead_id: number;
  lead_name: string;
  lead_email: string;
  lead_mobile: string;
  lead_status: string;
  lead_assign_to: number | string;
  organization_name: string;
  lead_city: string;
  lead_source: string;
  lead_campaign_type: string;
  lead_type: string;
  lead_budget: number;
  lead_remark: string | null;
  lead_created_by: number | null;
  lead_date:Date;
}

interface LeadStatusData {
  count: number;
  leads: Leads[];
  percentageDifference: number;
}

interface RoleOption {
  value: string;
  label: string;
}

const AllNewLeads = () => {
  const routes = all_routes;
  const token = localStorage.getItem("token");
  const [newLeads, setNewLeads] = useState<LeadStatusData | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]); // To track selected leads
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [reportToOptions, setReportToOptions] = useState<RoleOption[]>([]);
  const [leadAssignTo, setLeadAssignTo] = useState<string | number>(""); 
  const apiUrl = process.env.REACT_APP_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lead/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response?.data;
      setNewLeads(data?.New); // Update state with new lead data
      console.log(data?.New.leads, "new leads");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/'; // Redirect if no token is found
    } else {
      fetchData(); // Fetch leads data when token exists
    }
  }, [token]);

  const handleCheckboxChange = (leadId: number) => {
    setSelectedLeads((prevSelectedLeads) =>
      prevSelectedLeads.includes(leadId)
        ? prevSelectedLeads.filter((id) => id !== leadId) // Deselect
        : [...prevSelectedLeads, leadId] // Select
    );
  };

  const handleSelectChange = (selected: any) => {
    setLeadAssignTo(selected?.value || ""); // Set the assignee value
  };

  const handleAssignLeads = async () => {
    if (selectedLeads.length === 0 || !leadAssignTo) {
      alert("Please select leads and an assignee.");
      return;
    }

    const data = {
      lead_ids: selectedLeads,
      lead_assign_to: leadAssignTo,
    };
    console.log("Data to send:", data);
    try {
      const response = await axios.put(`${apiUrl}/api/lead/assign`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Leads assigned successfully:", response.data);
      alert("Leads assigned successfully!");
      fetchData();
    } catch (error) {
      console.error("Error assigning leads:", error);
      alert("Failed to assign leads.");
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/user/reportTo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const roleOptions: RoleOption[] = response.data.allRoles.map((role: { role_name: string }) => ({
          value: role.role_name,
          label: role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1), // Capitalize role name
        }));

        const reportToRoleOptions: RoleOption[] = [];
        Object.keys(response.data.users).forEach((role) => {
          (response.data.users[role] as { user_id: number, user_name: string }[]).forEach((user) => {
            reportToRoleOptions.push({
              value: user.user_id.toString(),
              label: `${role.charAt(0).toUpperCase() + role.slice(1)} - ${user.user_name}`, // Format: Role - UserName
            });
          });
        });

        setRoles(roleOptions);
        setReportToOptions(reportToRoleOptions);
        console.log("Roles:", roles);
        console.log("Report to:", reportToOptions);

      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };

    fetchRoles();
  }, [token]);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Breadcrumb */}
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">New Leads</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>
                    <i className="ti ti-smart-home" />
                  </Link>
                </li>
                <li className="breadcrumb-item">CRM</li>
                <li className="breadcrumb-item active" aria-current="page">
                  New Lead List
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
            <div className="me-2 mb-2"></div>
            <div className="mb-2">
              <Link
                to="/add-leads"
               
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-circle-plus me-2" />
                Add Lead
              </Link>
            </div>
            <div className="head-icons ms-2">
              <CollapseHeader />
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h5>Leads List</h5>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Lead Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Created Date</th>
                  <th>Lead Type</th>
                  <th>Lead Created by</th>
                  <th>Budget</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {newLeads?.leads?.map((lead) => (
                  <tr key={lead.lead_id}>
                    <th>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(lead.lead_id)}
                      />
                    </th>
                    <td>{lead.lead_name}</td>
                    <td>{lead.lead_mobile}</td>
                    <td>{lead.lead_email}</td>
                    {/* <td>{new Date(lead.lead_created_by || Date.now()).toLocaleDateString()}</td> */}
                    <td>{new Date(lead.lead_date || Date.now()).toLocaleDateString()}</td>
                    <td>{lead.lead_type}</td>
                    <td>{lead.lead_created_by}</td>
                    <td>{lead.lead_budget}</td>
               
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="col-md-6" >
              {/* <div className="mb-4" > */}
                <label  className="form-label">Assign to</label>
                <Select
                  name="lead_assign_to"
                  options={reportToOptions}
                  value={reportToOptions.find(option => option.value === leadAssignTo) || null}
                  onChange={handleSelectChange}
                  className="select"
                  placeholder="Assign to"
                />
              {/* </div> */}
            </div>
          </div>
              <button style={{width:"10vw"}} className="btn btn-primary" onClick={handleAssignLeads}>
                Assign Leads
              </button>
        </div>
      </div>
      <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p className="mb-0">2025 © Quarkleads.</p>
        <p>
          Designed &amp; Developed By{" "}
          <Link to="#" className="text-primary">
            Shulyn Technologies
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AllNewLeads;
