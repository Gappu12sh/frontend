import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import dragula, { Drake } from "dragula";
import "dragula/dist/dragula.css";
// import CrmsModal from '../../../core/modals/crms_modal'

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
}
interface LeadStatusData {
  count: number;
  leads: Leads[];
  percentageDifference: number;
}
interface PercentageDifference {
  Pending: number;
  New: number;
  Won: number;
  Lost: number;
  Junk: number;
  SiteVisit: number;
  FollowUp: number;
  Duplicate:number;
}
interface LeadCount {
  totalUsers: number;
  totalInactiveUsers: number;
  totalActiveUsers: number;
}

const LeadsGrid = () => {
  const routes = all_routes
  const [newLeads, setNewLeads] = useState<LeadStatusData | null>(null);
  const [pendingLeads, setPendingLeads] = useState<LeadStatusData | null>(null);
  const [followUp, setFollowUp] = useState<LeadStatusData | null>(null);
  const [won, setWon] = useState<LeadStatusData | null>(null);
  const [lost, setLost] = useState<LeadStatusData | null>(null);
  const [junk, setJunk] = useState<LeadStatusData | null>(null)
  const [siteVisit, setSiteVisit] = useState<LeadStatusData | null>(null)
  const [duplicate, setDuplicate] = useState<LeadStatusData | null>(null)
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [totalLeadsDiff, setTotalLeadsDiff] = useState<number>(0);
  const [percentage, setPercentage] = useState<PercentageDifference | null>(null)
  const [count, setCount] = useState<LeadCount>({
    totalUsers: 0,
    totalInactiveUsers: 0,
    totalActiveUsers: 0,
  });
  const token = localStorage.getItem("token")
  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const container3Ref = useRef<HTMLDivElement>(null);
  const container4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containers = [
      container1Ref.current as HTMLDivElement,
      container2Ref.current as HTMLDivElement,
      container3Ref.current as HTMLDivElement,
      container4Ref.current as HTMLDivElement,
    ].filter((container) => container !== null);

    const drake: Drake = dragula(containers);
    return () => {
      drake.destroy();
    };
  }, []);

  const fetchLeads = async () => {
    try {
      const apiUrl = process.env.REACT_APP_URL;
      const response = await fetch(`${apiUrl}/api/lead/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("data is : ", data)
      // Set New and Pending Leads data
      setNewLeads(data?.New);
      setFollowUp(data?.FollowUp)
      setPendingLeads(data?.Pending);
      setTotalLeads(data?.totalLeadsCount);
      setTotalLeadsDiff(data?.totalLeadDifference);
      setWon(data?.Won);
      setLost(data?.Lost);
      setSiteVisit(data?.SiteVisit)
      setPercentage(data?.percentageDifference)
      setJunk(data?.Junk)
      setDuplicate(data?.Duplicate)
      console.log("new leads are :", newLeads)
      console.log("Pending leads are :", pendingLeads)
      console.log("total leads are ", totalLeads)
      // Example of how you might set counts (update as per your logic)
      setCount({
        totalUsers: data.New.count + data.Pending.count,
        totalInactiveUsers: 0, // Replace with actual logic
        totalActiveUsers: 0, // Replace with actual logic
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchLeads()
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}

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
                    Leads Grid
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
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
                <Link to="/allLeads">
                <div className="card-body">

                  <div className="d-flex align-items-center mb-3">
               
                    <div className="avatar avatar-md br-10 icon-rotate bg-purple flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-users-group text-white fs-16" />
                      </span>
                    </div>
                  <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Total No of Leads
                      </p>
                      <h5>{totalLeads}</h5>
                    </div>
                  </div>
             
          
                    <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${totalLeadsDiff > 0
                          ? 'text-success'
                          : totalLeadsDiff < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {totalLeadsDiff || 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>

              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
                  <Link to="/AllNewLeads">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-secondary flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-currency text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                       New Leads
                      </p>
                      <h5>{newLeads?.count}</h5>
                    </div>
                  </div>
           

                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.New > 0
                          ? 'text-success'
                          : percentage && percentage.New < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage.New : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>


                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
                <Link to='/AllPendingLeads' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-danger flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-stairs-up text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Pending
                      </p>
                      <h5>{pendingLeads?.count}</h5>
                    </div>
                  </div>
                  {/* <div className="progress progress-xs mb-2">
                    <div
                      className="progress-bar bg-pink"
                      role="progressbar"
                      style={{ width: "40%" }}
                    />
                  </div> */}
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.Pending > 0
                          ? 'text-success'
                          : percentage && percentage?.Pending < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.Pending : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
              <Link to='/AllWon' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-primary flex-shrink-0">
                      <span className="d-flex align-items-center">
                        {/* <i className="ti ti-currency text-white fs-16" /> */}
                        <i className="ti ti-delta text-white fs-16" />

                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Won
                      </p>
                      <h5>{won?.count}</h5>
                    </div>
                  </div>
            
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.Won > 0
                          ? 'text-success'
                          : percentage && percentage?.Won < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.Won : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
              <Link to='/AllLost' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-secondary flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-currency text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Lost
                      </p>
                      <h5>{lost?.count}</h5>
                    </div>
                  </div>
          
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.Lost > 0
                          ? 'text-success'
                          : percentage && percentage?.Lost < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.Lost : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>       <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
              <Link to='/AllJunk' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-secondary flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-currency text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Junk
                      </p>
                      <h5>{junk?.count}</h5>
                    </div>
                  </div>
        
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.Junk > 0
                          ? 'text-success'
                          : percentage && percentage?.Junk < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.Junk : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
                <Link to='/AllFollowUpLeads' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-secondary flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-currency text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Follow Up
                      </p>
                      <h5>{followUp?.count}</h5>
                    </div>
                  </div>
    
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.FollowUp > 0
                          ? 'text-success'
                          : percentage && percentage?.FollowUp < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.FollowUp : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link> 
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
              <Link to='/AllSiteVisit' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-danger flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-stairs-up text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Site visit
                      </p>
                      <h5>{siteVisit?.count}</h5>
                    </div>
                  </div>
        
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.SiteVisit > 0
                          ? 'text-success'
                          : percentage && percentage?.SiteVisit < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.SiteVisit : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card position-relative">
              <Link to='/AllDuplicateLeads' >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md br-10 icon-rotate bg-danger flex-shrink-0">
                      <span className="d-flex align-items-center">
                        <i className="ti ti-stairs-up text-white fs-16" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="fw-medium text-truncate mb-1">
                        Duplicate Leads
                      </p>
                      <h5>{duplicate?.count}</h5>
                    </div>
                  </div>
        
                  <p className="fw-medium fs-13 mb-0">
                    <span
                      className={`fs-12 ${percentage && percentage.Duplicate > 0
                          ? 'text-success'
                          : percentage && percentage?.SiteVisit < 0
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                    >
                      <i className="ti ti-arrow-wave-right-up me-1" />
                      {percentage ? percentage?.SiteVisit : 'N/A'}%
                    </span>{" "}
                    from last week
                  </p>
                  <span className="position-absolute top-0 end-0">
                    <ImageWithBasePath src="assets/img/bg/card-bg-04.png" alt="Img" />
                  </span>
                </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Leads Grid */}

          <div className="d-flex overflow-x-auto align-items-start mb-4">
            <div className="kanban-list-items bg-white">
              <div className="card mb-0">
              <Link to='/AllNewLeads' >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-semibold d-flex align-items-center mb-1">
                        <i className="ti ti-circle-filled fs-8 text-warning me-2" />
                        New Leads
                      </h4>
                      <span className="fw-medium text-default">
                        {newLeads?.count} Leads
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="action-icon d-inline-flex">
                        <Link to="#">
                          <i className="ti ti-circle-plus" />
                        </Link>
                        <Link
                          to="#"
                          className=""
                          data-bs-toggle="modal"
                          data-bs-target="#edit_leads"
                        >
                          <i className="ti ti-edit" />
                        </Link>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
              <div className="kanban-drag-wrap pt-4" ref={container2Ref}>
                <div>

                  {

                    newLeads?.leads?.map((event) => (
                      <div className="card kanban-card" key={event?.lead_id}>
                        <div className="card-body">
                          <div className="d-block">
                            <div className="border-warning border border-2 mb-3" />

                            <div className="d-flex align-items-center mb-3">
                        
                              <h6 className="fw-medium">
                                <Link to={routes.leadsDetails}>{event?.lead_name}</Link>
                              </h6>
                            </div>
                          </div>

                          <div className="mb-3 d-flex flex-column">
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-report-money text-dark me-1" />
                              ₹ {event.lead_budget}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-mail text-dark me-1" />
                              {event.lead_email}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-phone text-dark me-1" />
                              {event?.lead_mobile}
                            </p>
                            <p className="text-default d-inline-flex align-items-center">
                              <i className="ti ti-map-pin-pin text-dark me-1" />
                              {event.lead_city}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                            <Link
                              to="#"
                              className="avatar avatar-sm  avatar-rounded flex-shrink-0 me-2"
                            >
                              <ImageWithBasePath
                                src="assets/img/company/company-04.svg"
                                alt="image"
                              />
                            </Link>
                            <div className="icons-social d-flex align-items-center">
                              <Link
                                // to="#"
                                to={`tel:${event?.lead_mobile}`}
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-phone-call" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-brand-hipchat" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <i className="ti ti-color-swatch" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))

                  }

                </div>
                <div>

                </div>
              </div>
            </div>
            <div className="kanban-list-items bg-white">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-semibold d-flex align-items-center mb-1">
                        <i className="ti ti-circle-filled fs-8 text-purple me-2" />
                        Pending Leads
                      </h4>
                      <span className="fw-medium text-default">
                        {pendingLeads?.count} Leads
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="action-icon d-inline-flex">
                        <Link to="#">
                          <i className="ti ti-circle-plus" />
                        </Link>
                        <Link
                          to="#"
                          className=""
                          data-bs-toggle="modal"
                          data-bs-target="#edit_leads"
                        >
                          <i className="ti ti-edit" />
                        </Link>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kanban-drag-wrap pt-4" ref={container3Ref}>
                <div>
                  {
                    pendingLeads?.leads?.map((event) => (
                      <div className="card kanban-card" key={event.lead_id}>
                        <div className="card-body">
                          <div className="d-block">
                            <div className="border-purple border border-2 mb-3" />
                            <div className="d-flex align-items-center mb-3">

                              <h6 className="fw-medium">
                                <Link to={routes.leadsDetails}>{event.lead_name}</Link>
                              </h6>
                            </div>
                          </div>
                          <div className="mb-3 d-flex flex-column">
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-report-money text-dark me-1" />
                              {event.lead_budget}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-mail text-dark me-1" />
                              {event.lead_email}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-phone text-dark me-1" />
                              {event.lead_mobile}
                            </p>
                            <p className="text-default d-inline-flex align-items-center">
                              <i className="ti ti-map-pin-pin text-dark me-1" />
                              {event.lead_city}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                            <Link
                              to="#"
                              className="avatar avatar-sm  avatar-rounded flex-shrink-0 me-2"
                            >
                              <ImageWithBasePath
                                src="assets/img/company/company-06.svg"
                                alt="image"
                              />
                            </Link>
                            {/* <div className="icons-social d-flex align-items-center"> */}
                            <div className="icons-social d-flex align-items-center">
                              <Link
                                // to="#"
                                to={`tel:${event?.lead_mobile}`}
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-phone-call" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-brand-hipchat" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <i className="ti ti-color-swatch" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div>

                </div>
              </div>
            </div>
            <div className="kanban-list-items bg-white">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-semibold d-flex align-items-center mb-1">
                        <i className="ti ti-circle-filled fs-8 text-success me-2" />
                        Follow Up
                      </h4>
                      <span className="fw-medium text-default">
                        {followUp?.count} Leads
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="action-icon d-inline-flex">
                        <Link to="#">
                          <i className="ti ti-circle-plus" />
                        </Link>
                        <Link
                          to="#"
                          className=""
                          data-bs-toggle="modal"
                          data-bs-target="#edit_leads"
                        >
                          <i className="ti ti-edit" />
                        </Link>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kanban-drag-wrap pt-4" ref={container1Ref}>
                <div>
                  {
                    followUp?.leads?.map((event) => (
                      <div className="card kanban-card" key={event.lead_id}>
                        <div className="card-body" >
                          <div className="d-block">
                            <div className="border-purple border border-2 mb-3" />
                            <div className="d-flex align-items-center mb-3">

                              <h6 className="fw-medium">
                                <Link to={routes.leadsDetails}>{event.lead_name}</Link>
                              </h6>
                            </div>
                          </div>
                          <div className="mb-3 d-flex flex-column">
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-report-money text-dark me-1" />
                              {event.lead_budget}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-mail text-dark me-1" />
                              {event.lead_email}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-phone text-dark me-1" />
                              {event.lead_mobile}
                            </p>
                            <p className="text-default d-inline-flex align-items-center">
                              <i className="ti ti-map-pin-pin text-dark me-1" />
                              {event.lead_city}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                            <Link
                              to="#"
                              className="avatar avatar-sm  avatar-rounded flex-shrink-0 me-2"
                            >
                              <ImageWithBasePath
                                src="assets/img/company/company-06.svg"
                                alt="image"
                              />
                            </Link>
                            {/* <div className="icons-social d-flex align-items-center"> */}
                            <div className="icons-social d-flex align-items-center">
                              <Link
                                // to="#"
                                to={`tel:${event?.lead_mobile}`}
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-phone-call" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-brand-hipchat" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <i className="ti ti-color-swatch" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div>

                </div>
            
              </div>
            </div>
            <div className="kanban-list-items bg-white me-0">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-semibold d-flex align-items-center mb-1">
                        <i className="ti ti-circle-filled fs-8 text-danger me-2" />
                        Won
                      </h4>
                      <span className="fw-medium text-default">
                        {won?.count} Leads
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="action-icon d-inline-flex">
                        <Link to="#">
                          <i className="ti ti-circle-plus" />
                        </Link>
                        <Link
                          to="#"
                          className=""
                          data-bs-toggle="modal"
                          data-bs-target="#edit_leads"
                        >
                          <i className="ti ti-edit" />
                        </Link>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kanban-drag-wrap pt-4" ref={container1Ref}>
              <div>
                  {
                    won?.leads?.map((event) => (
                      <div className="card kanban-card" key={event.lead_id}>
                      <div className="card-body" >
                        <div className="d-block">
                          <div className="border-danger border border-2 mb-3" />
                          <div className="d-flex align-items-center mb-3">

                              <h6 className="fw-medium">
                                <Link to={routes.leadsDetails}>{event.lead_name}</Link>
                              </h6>
                            </div>
                          </div>
                          <div className="mb-3 d-flex flex-column">
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-report-money text-dark me-1" />
                              {event.lead_budget}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-mail text-dark me-1" />
                              {event.lead_email}
                            </p>
                            <p className="text-default d-inline-flex align-items-center mb-2">
                              <i className="ti ti-phone text-dark me-1" />
                              {event.lead_mobile}
                            </p>
                            <p className="text-default d-inline-flex align-items-center">
                              <i className="ti ti-map-pin-pin text-dark me-1" />
                              {event.lead_city}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                            <Link
                              to="#"
                              className="avatar avatar-sm  avatar-rounded flex-shrink-0 me-2"
                            >
                              <ImageWithBasePath
                                src="assets/img/company/company-06.svg"
                                alt="image"
                              />
                            </Link>
                            {/* <div className="icons-social d-flex align-items-center"> */}
                            <div className="icons-social d-flex align-items-center">
                              <Link
                                // to="#"
                                to={`tel:${event?.lead_mobile}`}
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-phone-call" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center me-2"
                              >
                                <i className="ti ti-brand-hipchat" />
                              </Link>
                              <Link
                                to="#"
                                className="d-flex align-items-center justify-content-center"
                              >
                                <i className="ti ti-color-swatch" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              
                <div>
                 
                </div>
              </div>
            </div>
          </div>
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
      {/* /Page Wrapper */}
      {/* <CrmsModal /> */}
    </>

  )
}

export default LeadsGrid