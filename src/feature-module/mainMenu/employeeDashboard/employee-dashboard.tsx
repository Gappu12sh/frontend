import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const EmployeeDashboard = () => {
  const routes = all_routes;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>("");
  const [leads, setLeads] = useState<any>("");
  const [leavesChart, setLeavesChart] = useState<any>({
    chart: {
      height: 165,
      type: 'donut',
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      },
    },
    dataLabels: {
      enabled: false
    },

    series: [],
    colors: ['#F26522', '#FFC107', '#E70D0D', '#03C95A', '#0C4B5E'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          show: false
        }
      }
    }],
    legend: {
      show: false
    }
  })


  const token = localStorage.getItem("token");
  const fetchLeads = async () => {
    try {
      const apiUrl = process.env.REACT_APP_URL;
      const response = await fetch(`${apiUrl}/api/lead/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      // console.log("data is : ", data)
      setLeads(data)
      setLeavesChart((prevState: any) => ({
        ...prevState,
        series: [data?.FollowUp?.count || 0, data?.SiteVisit?.count || 0, data?.Pending?.count || 0, data?.New?.count || 0, data?.totalLeadsCount || 0],
      }));
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    const fetchUserDetails = async () => {
      const id = localStorage.getItem("id")
    
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
        // console.log(response)
        setUserInfo(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
    fetchLeads();
  }, []);

  if (loading) {
    return <p>Loading user information...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  // console.log(userInfo?.user_id)



  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Employee Dashboard</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Employee Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">

              </div>

            </div>
          </div>

          <div className="row">
            <div className="col-xl-4 d-flex">
              <div className="card position-relative flex-fill">
                <div className="card-header bg-dark">
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-lg avatar-rounded border border-white border-2 flex-shrink-0 me-2">
                      <ImageWithBasePath src="assets/img/users/user-01.jpg" alt="Img" />
                    </span>
                    <div>
                      <h5 className="text-white mb-1">{userInfo.user_name}</h5>
                      <div className="d-flex align-items-center">
                        <p className="text-white fs-12 mb-0">
                          {userInfo.user_designation}
                        </p>
                        <span className="mx-1">
                          <i className="ti ti-point-filled text-primary" />
                        </span>
                        <p className="fs-12">{userInfo.role_id}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/edit-employee/${userInfo.user_id}`}
                    className="btn btn-icon btn-sm text-white rounded-circle edit-top"
                  >
                    <i className="ti ti-edit" />
                  </Link>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span className="d-block mb-1 fs-13">Phone Number</span>
                    <p className="text-gray-9">{userInfo.user_mobile}</p>
                  </div>
                  <div className="mb-3">
                    <span className="d-block mb-1 fs-13">Email Address</span>
                    <p className="text-gray-9">{userInfo.user_email}</p>
                  </div>
                  <div className="mb-3">
                    <span className="d-block mb-1 fs-13">Report Office</span>
                    <p className="text-gray-9">{userInfo.organization_name}</p>
                  </div>
                  <div>
                    <span className="d-block mb-1 fs-13">Joined on</span>
                    <p className="text-gray-9">{new Date(userInfo.user_doe).toISOString().split('T')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <h5>Lead Details</h5>
                    <div className="dropdown">

                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                          >
                            2024
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                          >
                            2023
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                          >
                            2022
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-dark me-1" />
                            <span className="text-gray-9 fw-semibold me-1">
                              {/* { leads?.totalLeadsCount - leads?.Duplicate?.count?0:leads?.Duplicate?.count } */}
                              { leads?.totalLeadsCount }

                            </span>
                            Total Leads
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-success me-1" />
                            <span className="text-gray-9 fw-semibold me-1">{leads?.New?.count}</span>
                            New Leads
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-primary me-1" />
                            <span className="text-gray-9 fw-semibold me-1">
                              {leads?.FollowUp?.count}
                            </span>
                            Follow Up
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-danger me-1" />
                            <span className="text-gray-9 fw-semibold me-1">{leads?.Pending?.count}</span>
                            Pending Leads
                          </p>
                        </div>
                        <div className="mb-3">
                          {/* <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-muted me-1"></i>

                            <span className="text-gray-9 fw-semibold me-1">{leads?.Duplicate?.count}</span>
                            Duplicate Leads
                          </p> */}
                               <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-warning me-1" />
                            <span className="text-gray-9 fw-semibold me-1">{leads?.SiteVisit?.count}</span>
                            Site Visit
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            {/* <i className="ti ti-circle-filled fs-8 text-danger me-1" /> */}
                            <i className="ti ti-circle-filled fs-8 text-muted me-1"></i>

                            <span className="text-gray-9 fw-semibold me-1">{leads?.Won?.count}</span>
                            Won Leads
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            {/* <i className="ti ti-circle-filled fs-8 text-danger me-1" /> */}
                            <i className="ti ti-circle-filled fs-8 text-muted me-1"></i>

                            <span className="text-gray-9 fw-semibold me-1">{leads?.Lost?.count}</span>
                            Lost Leads
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="d-flex align-items-center">
                            {/* <i className="ti ti-circle-filled fs-8 text-danger me-1" /> */}
                            <i className="ti ti-circle-filled fs-8 text-muted me-1"></i>

                            <span className="text-gray-9 fw-semibold me-1">{leads?.Junk?.count}</span>
                            Junk Leads
                          </p>
                        </div>
                        <div>
                          <p className="d-flex align-items-center">
                            <i className="ti ti-circle-filled fs-8 text-muted me-1"></i>

                            <span className="text-gray-9 fw-semibold me-1">{leads?.Duplicate?.count}</span>
                            Duplicate Leads
                          </p>
                        </div>
                     
                      </div>
                      
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4 d-flex justify-content-md-end">
                        <ReactApexChart
                          id="leaves_chart"
                          options={leavesChart}
                          series={leavesChart.series}
                          type="donut"
                          height={165}
                        />
                      </div>
                    </div>

                  </div>
                </div>
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

export default EmployeeDashboard;



