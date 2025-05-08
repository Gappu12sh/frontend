import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_country: string;
  user_address: string;
  role_id: string;
  rating: number;
  user_designation: string;
  user_role: string;
  user_isactive: boolean;
  user_createdby: string;
}

const AllEmployeeList = () => {
  const routes = all_routes;
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchUserDetails = async () => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_URL;
      const response = await axios.get(`${apiUrl}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response?.data?.subordinates);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch user details.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

const filteredUsers = user.filter((users) => {
  const searchLower = searchQuery.toLowerCase();

  return (
    users.user_name.toLowerCase().includes(searchLower) ||
    users.user_email.toLowerCase().includes(searchLower) ||
    users.user_mobile.includes(searchLower) ||
    users.user_country.toLowerCase().includes(searchLower) ||
    users.user_address.toLowerCase().includes(searchLower) ||
    users.role_id.toString().toLowerCase().includes(searchLower) ||
    users.user_designation.toLowerCase().includes(searchLower) ||
    (searchLower.includes("active") && users.user_isactive === true) ||
    (searchLower.includes("inactive") && users.user_isactive === false)
  );
});


  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentLeads = filteredUsers.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          {/* <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Total Leads</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">CRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Total Leads
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
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
          </div> */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Employee</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Employee</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Employee List
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                            <div className="me-2 mb-2">
                                <div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
                                    <Link to="/employeeList" className="btn btn-icon btn-sm me-1">
                                        <i className="ti ti-list-tree" />
                                    </Link>
                                    <Link
                                        to='/index'
                                        className="btn btn-icon btn-sm active bg-primary text-white"
                                    >
                                        <i className="ti ti-layout-grid" />
                                    </Link>
                                </div>
                            </div>
                            <div className="me-2 mb-2">
                             
                            </div>
                            <div className="mb-2">
                                <Link
                                    to="/add-employee"

                                    className="btn btn-primary d-flex align-items-center"
                                >
                                    <i className="ti ti-circle-plus me-2" />
                                    Add Employee
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
            {/* <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Total Leads</h5>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="me-3"></div>
              </div>
            </div> */}
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
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Role level</th>
                    <th>Active</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeads?.map((users) => (
                    <tr key={users.user_id}>
                      <td>{users.user_id}</td>
                      <td>{users.user_name}</td>
                      <td>{users.user_email}</td>
                      <td>{users.user_mobile}</td>
                      <td>{users.user_designation}</td>
                      <td>{users.user_role}</td>
                      <td>{users.user_isactive ? 'Active' : 'Inactive'}</td>
                      <td>{users.user_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          {/* /Leads List */}
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

export default AllEmployeeList;
