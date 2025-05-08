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
interface status {
  value: string;
  label: string;
}
const AllDuplicateLeads = () => {
  const routes = all_routes;
  const token = localStorage.getItem("token");
  const [duplicateLeads, setDuplicateLeads] = useState<LeadStatusData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null); // Track selected lead ID

  const status = [
    { value: "Junk", label: "Junk" },
  ];
  const handleSelectChange = (selectedOption: status | null, leadId: number) => {
    setSelectedStatus(selectedOption ? selectedOption.value : null);
    setSelectedLeadId(leadId); 
  };
  const updateLeadStatus = async () => {
    if (!selectedStatus || selectedLeadId === null) return;

    try {
      const apiUrl = process.env.REACT_APP_URL;
      await axios.put(
        `${apiUrl}/api/lead/status/${selectedLeadId}`,
        { lead_status: selectedStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("lead status changed")
      fetchData();

    } catch (error) {
      console.error("Error updating lead status", error);
    }
  };

  async function fetchData() {
    try {
      const apiUrl = process.env.REACT_APP_URL;
      const response = await axios.get(`${apiUrl}/api/lead/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response?.data;
      setDuplicateLeads(data?.Duplicate);
      console.log(data?.Duplicate.leads, "duplicate leads");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Duplicate Leads</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">CRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Duplicate Lead List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2"></div>
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_leads"
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
          {/* /Breadcrumb */}

          {/* Leads List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Leads List</h5>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="me-3">
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Created Date</th>
                    <th>Lead Type</th>
                    <th>Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateLeads?.leads?.map((lead) => (
                    <tr key={lead.lead_id}>
                      <td>
                        {lead.lead_name}
                      </td>
                      <td>{lead.lead_mobile}</td>
                      <td>{lead.lead_email}</td>
                      <td>{new Date(lead.lead_date || Date.now()).toLocaleDateString()}</td>
                      <td>{lead.lead_type}</td>
                      <td>{lead.lead_budget}</td>
                      <td>
                        <Select
                          name="leadStatus"
                          className="select"
                          options={status}
                          value={status.find((option) => option.value === lead.lead_status)}
                          onChange={(selectedOption:any) =>
                            handleSelectChange(selectedOption, lead.lead_id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={updateLeadStatus} className="btn btn-primary">
            Update Data
          </button>
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
    </>
  );
};

export default AllDuplicateLeads;