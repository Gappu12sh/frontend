import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

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

interface ApiResponse {
  Won: LeadStatusData;
  New: LeadStatusData;
  SiteVisit: LeadStatusData;
  Duplicate: LeadStatusData;
  Junk: LeadStatusData;
  FollowUp: LeadStatusData;
  Lost: LeadStatusData;
}

const AllLeadsList = () => {
  const routes = all_routes;
  const token = localStorage.getItem("token");
  const [allLeads, setAllLeads] = useState<Leads[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  async function fetchData() {
    try {
      const apiUrl = process.env.REACT_APP_URL;
      const response = await axios.get(`${apiUrl}/api/lead/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response?.data;

      const allLeads = [
        ...(data?.Won?.leads || []),
        ...(data?.New?.leads || []),
        ...(data?.SiteVisit?.leads || []),
        ...(data?.Duplicate?.leads || []),
        ...(data?.Junk?.leads || []),
        ...(data?.FollowUp?.leads || []),
        ...(data?.Lost?.leads || []),
      ];
      setAllLeads(allLeads);
      console.log(allLeads)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeads = allLeads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (lead.lead_name && lead.lead_name.toLowerCase().includes(searchLower)) ||
      (lead.lead_email && lead.lead_email.toLowerCase().includes(searchLower)) ||
      (lead.lead_mobile && lead.lead_mobile.includes(searchLower)) ||
      (lead.lead_status && lead.lead_status.toLowerCase().includes(searchLower)) ||
      (lead.organization_name && lead.organization_name.toLowerCase().includes(searchLower)) ||
      (lead.lead_city && lead.lead_city.toLowerCase().includes(searchLower)) ||
      (lead.lead_source && lead.lead_source.toLowerCase().includes(searchLower)) ||
      (lead.lead_campaign_type && lead.lead_campaign_type.toLowerCase().includes(searchLower)) ||
      (lead.lead_type && lead.lead_type.toLowerCase().includes(searchLower))
    );
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Leads; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: keyof Leads) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";

    if (sortConfig.key === "lead_date") {
      return sortConfig.direction === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });


  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  // const currentLeads = filteredLeads.slice(startIndex, endIndex);
  const currentLeads = sortedLeads.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const exportToExcel = () => {
    alert("export to excel")
    const ws = XLSX.utils.json_to_sheet(filteredLeads.map((lead) => ({
      "Lead Name": lead.lead_name,
      "Phone": lead.lead_mobile,
      "Email": lead.lead_email,
      "Created Date": new Date(lead.lead_date || Date.now()).toLocaleDateString(),
      "Lead Type": lead.lead_type,
      "Budget": lead.lead_budget,
      "Campaign Type": lead.lead_campaign_type,
      "Lead Source": lead.lead_source,
      "Lead Status": lead.lead_status,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    XLSX.writeFile(wb, "Leads_Data.xlsx");
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">

          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Leads</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">CRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leads List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
                  <Link to="/allLeads" className="btn btn-icon btn-sm me-1">
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to="/leads-dashboard"
                    className="btn btn-icon btn-sm active bg-primary text-white"
                  >
                    <i className="ti ti-layout-grid" />
                  </Link>
                </div>
              </div>
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-file-export me-1" />
                    Export
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    {/* <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          <i className="ti ti-file-type-pdf me-1" />
                          Export as PDF
                        </Link>
                      </li> */}
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={exportToExcel}
                      >
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
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
          {/* /Breadcrumb */}

          {/* Leads List */}
          <div className="card overflow-x-auto">

            <div className="card-body p-0">
              <div className="custom-datatable-filter table-responsive mb-4">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="dataTables_length px-3" id="DataTables_Table_0_length">
                      <label>
                        Row Per Page{" "}
                        <select
                          name="DataTables_Table_0_length"
                          aria-controls="DataTables_Table_0"
                          className="form-select form-select-sm"
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>{" "}
                        Entries
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div
                      id="DataTables_Table_0_filter px-3"
                      className="dataTables_filter text-end"
                    >
                      <label>
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-controls="DataTables_Table_0"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>


              <table className="table table-striped">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("lead_name")}>
                      Lead Name {sortConfig?.key === "lead_name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_mobile")}>
                      Phone {sortConfig?.key === "lead_mobile" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_email")}>
                      Email {sortConfig?.key === "lead_email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_date")}>
                      Created Date {sortConfig?.key === "lead_date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_type")}>
                      Lead Type {sortConfig?.key === "lead_type" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_budget")}>
                      Budget {sortConfig?.key === "lead_budget" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_campaign_type")}>
                      Campaign Type {sortConfig?.key === "lead_campaign_type" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_source")}>
                      Lead Source {sortConfig?.key === "lead_source" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                    <th onClick={() => handleSort("lead_status")}>
                      Lead Status {sortConfig?.key === "lead_status" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                    </th>
                  </tr>
                </thead>

                {/* <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Created Date</th>
                    <th>Lead Type</th>
                    <th>Budget</th>
                    <th>Campaign Type</th>
                    <th>Lead Source</th>
                    <th>Lead Status</th>
                  </tr>
                </thead> */}
                <tbody>
                  {currentLeads?.map((lead) => (
                    <tr key={lead.lead_id}>
                      <td>{lead.lead_name}</td>
                      <td>{lead.lead_mobile}</td>
                      <td>{lead.lead_email}</td>
                      <td>{new Date(lead.lead_date || Date.now()).toLocaleDateString()}</td>
                      <td>{lead.lead_type}</td>
                      <td>{lead.lead_budget}</td>
                      <td>{lead.lead_campaign_type}</td>
                      <td>{lead.lead_source}</td>
                      <td>{lead.lead_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination" style={{margin:"10px",justifyContent:"flex-end"}}>
                <button
                  className="btn btn-primary btn-md d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{margin:"10px"}}
                >
                  Previous
                </button>
                <span style={{marginTop:"17px"}}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-primary btn-md d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{margin:"10px"}}
                >
                  Next
                </button>
              </div>
            </div>
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
    </>
  );
};

export default AllLeadsList;