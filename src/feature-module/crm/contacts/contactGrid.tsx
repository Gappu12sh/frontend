import React, { useContext, useEffect, useState } from 'react'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import CrmsModal from '../../../core/modals/crms_modal'
import axios from 'axios'
// import { UserContext } from '../../../Context/UserContext/UserContext'

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_country:string;
  location: string;
  role_id: string;
  avatar: string;  // Assuming avatar field exists for image
  rating: number;
  user_designation:string;

}

const ContactGrid = () => {
  const routes = all_routes
  const [user, setUser] = useState<User[]>([]); // Specify the type as 'User[]'
  const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const context=useContext(UserContext)
    // if(!context){
    //   throw new Error("user context is not available")
    // }
    // const {userToken}=context;
    useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const id=localStorage.getItem("id")
      console.log("id is",id)

      console.log("token is",token)

      if (!token) {
        window.location.href = "/"; // Redirect if no token is available
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_URL;
        const response = await axios.get(`${apiUrl}/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        });
        console.log("response from contact-grid",response)
        setUser(response.data); // Set user data from the response
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails(); // Fetch user details on component mount
  }, []);
  

  return (
  <>
    <div className="page-wrapper">
  <div className="content">
    {/* Breadcrumb */}
    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
      <div className="my-auto mb-2">
        <h2 className="mb-1">Contacts</h2>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={routes.adminDashboard}>
                <i className="ti ti-smart-home" />
              </Link>
            </li>
            <li className="breadcrumb-item">CRM</li>
            <li className="breadcrumb-item active" aria-current="page">
              Contacts Grid
            </li>
          </ol>
        </nav>
      </div>
      <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
        <div className="me-2 mb-2">
          <div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
            <Link to={routes.contactList} className="btn btn-icon btn-sm me-1">
              <i className="ti ti-list-tree" />
            </Link>
            <Link
              to={routes.contactGrid}
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
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  <i className="ti ti-file-type-pdf me-1" />
                  Export as PDF
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
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
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#add_contact"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-circle-plus me-2" />
            Add Contact
          </Link>
        </div>
        <div className="head-icons ms-2">
        <CollapseHeader />
        </div>
      </div>
    </div>
    {/* /Breadcrumb */}
    {/* Contact Grid */}
    <div className="card">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between">
          <h5>Contact Grid</h5>
          <div className="dropdown">
            <Link
              to="#"
              className="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              Sort By : Last 7 Days
            </Link>
            <ul className="dropdown-menu  dropdown-menu-end p-3">
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  Recently Added
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  Ascending
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  Desending
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  Last Month
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                >
                  Last 7 Days
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      {
        user.map((users)=>(
          <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="form-check form-check-md">
                <input className="form-check-input" type="checkbox" />
              </div>
              <div>
                <Link
                  to={routes.contactDetails}
                  className="avatar avatar-xl avatar-rounded online border p-1 border-primary rounded-circle"
                >
                  <ImageWithBasePath
                    src="assets/img/users/user-49.jpg"
                    className="img-fluid h-auto w-auto"
                    alt="img"
                  />
                </Link>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-icon btn-sm rounded-circle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-dots-vertical" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <Link
                      className="dropdown-item rounded-1"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_contact"
                    >
                      <i className="ti ti-edit me-1" />
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item rounded-1"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="ti ti-trash me-1" />
                      Delete
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center mb-3">
              <h6 className="mb-1">
                {/* <Link to={routes.contactDetails}>Darlee Robertson</Link> */}
                <Link to={routes.contactDetails}>{users?.user_name}</Link>

              </h6>
              <span className="badge bg-pink-transparent fs-10 fw-medium">
                {/* Facility Manager */}
                {users?.user_designation}

              </span>
            </div>
            <div className="d-flex flex-column">
              <p className="text-dark d-inline-flex align-items-center mb-2">
                <i className="ti ti-mail-forward text-gray-5 me-2" />
                {/* darlee@example.com */}
                {users?.user_email}
              </p>
              <p className="text-dark d-inline-flex align-items-center mb-2">
                <i className="ti ti-phone text-gray-5 me-2" />
                {/* (163) 2459 315 */}
                {users?.user_mobile}
              </p>
              <p className="text-dark d-inline-flex align-items-center">
                <i className="ti ti-map-pin text-gray-5 me-2" />
                {users?.user_country}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
              <div className="icons-social d-flex align-items-center">
                <Link to={`mailto:${users?.user_email}`} className="avatar avatar-rounded avatar-sm me-1">
                  <i className="ti ti-mail" />
                </Link>
                <Link to={`tel:+91${users?.user_mobile}`} className="avatar avatar-rounded avatar-sm me-1">
                  <i className="ti ti-phone-call" />
                </Link>
                <Link to="#" className="avatar avatar-rounded avatar-sm me-1">
                  <i className="ti ti-message-2" />
                </Link>
                <Link to="#" className="avatar avatar-rounded avatar-sm me-1">
                  <i className="ti ti-brand-skype" />
                </Link>
                <Link to="#" className="avatar avatar-rounded avatar-sm">
                  <i className="ti ti-brand-facebook" />
                </Link>
              </div>
              <span className="d-inline-flex align-items-center">
                <i className="ti ti-star-filled text-warning me-1" />
                4.2
              </span>
            </div>
          </div>
        </div>
      </div>
        ))
      }
  
    </div>
    {/* /Contact Grid */}
  </div>
  <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
    <p className="mb-0">2014 - 2025 © SmartHR.</p>
    <p>
      Designed &amp; Developed By{" "}
      <Link to="#" className="text-primary">
        Dreams
      </Link>
    </p>
  </div>
</div>
<CrmsModal/>
  </>

  )
}

export default ContactGrid