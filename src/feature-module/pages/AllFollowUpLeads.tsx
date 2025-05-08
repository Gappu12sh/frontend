import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
  lead_date: Date;
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
const AllFollowUpLeads = () => {
  const routes = all_routes;
  const token = localStorage.getItem("token");
  const [followUpLeads, setfollowUpLeads] = useState<LeadStatusData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [showRemarksPopup, setShowRemarksPopup] = useState<boolean>(false);
  const [activeLeadId, setActiveLeadId] = useState<number | null>(null);
  const [activeLead, setActiveLead] = useState<Leads | null>(null);
  const [selectedResType, setSelectedResType] = useState<string | null>(null);

  const statusOptions = [
    { value: "SiteVisit", label: "Site Visit" },
    { value: "Pending", label: "Pending" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" },
  ];
  const resType = [
    { value: "Call", label: "Call" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Site Visit Plan", label: "Site Visit Plan" },
    { value: "Not Picked", label: "Not Picked" },
    { value: "Not Contactable", label: "Not Contactable" },
    { value: "Meeting Done", label: "Meeting Done" },
    { value: "Never Picked", label: "Never Picked" },
  ];
  const handleSelectChange = (selectedOption: status | null, leadId: number) => {
    setSelectedStatus(selectedOption ? selectedOption.value : null);
    setSelectedLeadId(leadId); // Set the selected lead ID
  };

  const updateLeadStatus = async () => {
    if (!selectedStatus || selectedLeadId === null || !selectedResType) return;

    try {
      const apiUrl = process.env.REACT_APP_URL;
      await axios.put(
        `${apiUrl}/api/lead/status/${selectedLeadId}`,
        {
          lead_status: selectedStatus,
          lead_remark: remarks,
          lead_response_type: selectedResType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Lead status, remark, and response type updated successfully!")
      fetchData();
      setShowRemarksPopup(false);
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
      setfollowUpLeads(data?.FollowUp);
      console.log(data?.FollowUp.leads, "followup leads");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  const handleAddRemarkClick = (leadId: number) => {
    const lead = followUpLeads?.leads?.find((lead) => lead.lead_id === leadId);
    if (lead) {
      setActiveLead(lead);
      setActiveLeadId(leadId);
      setRemarks(lead.lead_remark || "");
      setSelectedResType(lead.lead_campaign_type || null);
      setShowRemarksPopup(true);
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Follow Up Leads</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">CRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Follow Up Lead List
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

          <div className="card  overflow-x-auto">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Leads List</h5>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="me-3">

                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {/* Table here */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Created Date</th>
                    <th>Lead Type</th>
                    <th>Lead Created by</th>
                    <th>Budget</th>
                    <th>Assigned to</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {followUpLeads?.leads?.map((lead) => (
                    <tr key={lead.lead_id}>
                      <td>{lead.lead_name}</td>
                      <td>{lead.lead_mobile}</td>
                      <td>{lead.lead_email}</td>
                      <td>{new Date(lead.lead_date || Date.now()).toLocaleDateString()}</td>
                      <td>{lead.lead_type}</td>
                      <td>{lead.lead_created_by}</td>
                      <td>{lead.lead_budget}</td>
                      <td>{lead.lead_assign_to}</td>
                      <td>
                        <Select
                          name="leadStatus"
                          className="select"
                          options={statusOptions}
                          value={statusOptions.find((option) => option.value === lead.lead_status)}
                          onChange={(selectedOption: any) =>
                            handleSelectChange(selectedOption, lead.lead_id)
                          }
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleAddRemarkClick(lead.lead_id)}>
                          Add Remark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* <button onClick={updateLeadStatus} className="btn btn-primary">
            Update Data
          </button> */}
        </div>
        <Modal show={showRemarksPopup} onHide={() => setShowRemarksPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Remark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {activeLead && (
              <>
                <textarea
                  value={remarks}
                  rows={2}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={remarks ? "Add remark here..." : "Loading..."}
                  className="form-control"
                />
                <Select
                  name="resType"
                  className="select"
                  options={resType}
                  value={resType.find((option) => option.value === selectedResType)}
                  onChange={(selectedOption: any) => setSelectedResType(selectedOption?.value)}
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRemarksPopup(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={updateLeadStatus}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
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

export default AllFollowUpLeads;