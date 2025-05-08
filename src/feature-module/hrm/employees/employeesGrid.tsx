import { useEffect, useState } from 'react'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import axios from 'axios';
import Header from '../../../core/common/header';
import Sidebar from '../../../core/common/sidebar';


interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    user_mobile: string;
    user_country: string;
    location: string;
    role_id: string;
    rating: number;
    user_designation: string;
    role_level: number;
    user_isactive: boolean;
}

interface UserCount {
    totalUsers: number;
    totalInactiveUsers: number;
    totalActiveUsers: number;
}

const EmployeesGrid = () => {
    const routes = all_routes

    const [user, setUser] = useState<User[]>([]);

    const [myProfile, setMyProfile] = useState<User | null>(null);
    const [count, setCount] = useState<UserCount>({ totalUsers: 0, totalInactiveUsers: 0, totalActiveUsers: 0 });
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.REACT_APP_URL;
    const token = localStorage.getItem("token");

    const fetchUserDetails = async () => {
        const id = localStorage.getItem("id")
        console.log("id is", id)
        // console.log("token is", token)
        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/api/user/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCount(response.data)
            // console.log("response from contact-grid", response?.data.subordinates)
            // console.log("response from contact-grid id is ", response?.data?.subordinates?.user_id)

            setUser(response?.data?.subordinates);
            setMyProfile(response?.data)

        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch user details.");
        }
    };
    useEffect(() => {
        fetchUserDetails(); // Fetch user details on component mount
    }, []);

    const handleDeactivate = async (userId: number) => {

        console.log(userId)
        try {
            const response = await axios.put(
                `${apiUrl}/api/user/activeStatus/${userId}`, "sandeep",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchUserDetails();
            console.log('Response after delete:', response.data);
            // alert("status changed")

        } catch (err: any) {
            setError(err.response?.data?.message);
        }
    };
 

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
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
                                        Employee Grid
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
                    <div className="row">
                        {/* Total Plans */}
                        <div className="col-lg-3 col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center overflow-hidden">
                                        <div>
                                            <span className="avatar avatar-lg bg-dark rounded-circle">
                                                <i className="ti ti-users" />
                                            </span>
                                        </div>
                                        <div className="ms-2 overflow-hidden">
                                            <p className="fs-12 fw-medium mb-1 text-truncate">
                                                Total Employee
                                            </p>
                                            <h4>{count.totalUsers}</h4>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Total Plans */}
                        {/* Total Plans */}
                        <div className="col-lg-3 col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center overflow-hidden">
                                        <div>
                                            <span className="avatar avatar-lg bg-success rounded-circle">
                                                <i className="ti ti-user-share" />
                                            </span>
                                        </div>
                                        <div className="ms-2 overflow-hidden">
                                            <p className="fs-12 fw-medium mb-1 text-truncate">Active</p>
                                            <h4>{count.totalActiveUsers}</h4>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center overflow-hidden">
                                        <div>
                                            <span className="avatar avatar-lg bg-danger rounded-circle">
                                                <i className="ti ti-user-pause" />
                                            </span>
                                        </div>
                                        <div className="ms-2 overflow-hidden">
                                            <p className="fs-12 fw-medium mb-1 text-truncate">InActive</p>
                                            <h4>{count.totalInactiveUsers}</h4>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-xl-3 col-lg-4 col-md-6" >
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="form-check form-check-md">
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
                                            <Link to={routes.contactDetails}>{myProfile?.user_name}</Link>

                                        </h6>
                                        <span className="badge bg-pink-transparent fs-10 fw-medium">
                                            {myProfile?.user_designation}

                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <p className="text-dark d-inline-flex align-items-center mb-2">
                                            <i className="ti ti-mail-forward text-gray-5 me-2" />
                                            {myProfile?.user_email}
                                        </p>
                                        <p className="text-dark d-inline-flex align-items-center mb-2">
                                            <i className="ti ti-phone text-gray-5 me-2" />
                                            {/* (163) 2459 315 */}
                                            {myProfile?.user_mobile}
                                        </p>
                                        <p className="text-dark d-inline-flex align-items-center">
                                            <i className="ti ti-map-pin text-gray-5 me-2" />
                                            {myProfile?.user_country}
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                                        <div className="icons-social d-flex align-items-center">
                                            <Link to={`mailto:${myProfile?.user_email}`} className="avatar avatar-rounded avatar-sm me-1">
                                                <i className="ti ti-mail" />
                                            </Link>
                                            <Link to={`tel:+91${myProfile?.user_mobile}`} className="avatar avatar-rounded avatar-sm me-1">
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
                                            {/* 4.2 */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            user.map((users) => (
                                <div className="col-xl-3 col-lg-4 col-md-6" key={users?.user_id}>
                                    {/* <div className="card"> */}
                                    <div
                                        className="card"
                                        style={{
                                            backgroundColor: users?.user_isactive ? 'background' : '#A9A9A9', // Change color here
                                        }}
                                    >

                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="form-check form-check-md">
                                                    {/* <input className="form-check-input" type="checkbox" /> */}
                                                </div>
                                                <div>
                                                    <Link
                                                        to='#'
                                                        // className="avatar avatar-xl avatar-rounded online border p-1 border-primary rounded-circle"
                                                        className={`avatar avatar-xl avatar-rounded border p-1 border-primary rounded-circle ${users?.user_isactive ? 'online' : ''}`}

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
                                                                to={`/edit-employee/${users?.user_id}`}

                                                            >
                                                                <i className="ti ti-edit me-1" />
                                                                Edit
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                className="dropdown-item rounded-1"
                                                                to="#"

                                                                onClick={() => handleDeactivate(users?.user_id)}
                                                            >
                                                                <i className="ti ti-trash me-1" />
                                                                {users?.user_isactive ? "Deactivate" : "Activate"}

                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="text-center mb-3">
                                                <h6 className="mb-1">
                                                    <Link to={routes.contactDetails}>{users?.user_name}</Link>

                                                </h6>
                                                <span className="badge bg-pink-transparent fs-10 fw-medium">
                                                    {users?.user_designation}

                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <p className="text-dark d-inline-flex align-items-center mb-2">
                                                    <i className="ti ti-mail-forward text-gray-5 me-2" />
                                                    {users?.user_email}
                                                </p>
                                                <p className="text-dark d-inline-flex align-items-center mb-2">
                                                    <i className="ti ti-phone text-gray-5 me-2" />
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
                                                    {/* 4.2 */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
                    <p className="mb-0">2025 © Quarkleads.</p>
                    <p>
                        Designed &amp; Developed By{" "}
                        <Link to="#" className="text-primary">
                            Shulyn
                        </Link>
                    </p>
                </div>
            </div>
        </>

    )
}

export default EmployeesGrid
