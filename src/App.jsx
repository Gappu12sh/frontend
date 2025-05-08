import Login from "./feature-module/auth/login/login";
import Register from "./feature-module/auth/register/register";
import Sidebar from "./core/common/sidebar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import EmployeeDashboard from "./feature-module/mainMenu/employeeDashboard/employee-dashboard";
import Header from "./core/common/header";
import ContactGrid from "./feature-module/crm/contacts/contactGrid";
import EmployeesGrid from "./feature-module/hrm/employees/employeesGrid";
import EmployeeList from "./feature-module/hrm/employees/employeesList";
import LeadsDasboard from "./feature-module/mainMenu/leadsDashboard";
import LeadsGrid from "./feature-module/crm/leads/leadsGrid";
import EmployeeDashboard from "./feature-module/mainMenu/employeeDashboard/employee-dashboard";
import AddEmployee from "./feature-module/pages/AddEmployee";
import AddLeads from "./core/modals/add_leads";
import AddNewLeads from "./feature-module/pages/AddNewLeads";
import AllNewLeads from "./feature-module/pages/AllNewLeads";
import AllPendingLeads from "./feature-module/pages/AllPendingLeads";
import AllDuplicateLeads from "./feature-module/pages/AllDuplicateLeads";
import AllFollowUpLeads from "./feature-module/pages/AllFollowUpLeads";
import AllWon from "./feature-module/pages/AllWon";
import AllJunk from "./feature-module/pages/AllJunk";
import AllSiteVisit from "./feature-module/pages/AllSiteVisit";
import AllLost from "./feature-module/pages/AllLost";
import UnderConstruction from "./feature-module/pages/underConstruction";
import AddRole from "./feature-module/pages/AddRole";
import EditEmployee from "./feature-module/pages/EditEmployee";
import EditRole from "./feature-module/pages/EditRoleHierarchy";
import AllLeadsList from "./feature-module/pages/AllLeadsList";
import AllEmployeeList from "./feature-module/pages/AllEmployeeList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "/index",
      element: (
        <>
          <Header />
          <Sidebar />
          <EmployeesGrid />
        </>
      ),
    },
    {
      path: "/leads-dashboard",
      element: (
        <>
          <Header />
          <Sidebar />
          <LeadsGrid />
        </>
      ),
    },
    {
      path: "/add-leads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AddNewLeads />
        </>
      ),
    },
    {
      path: "/contact-grid",
      element: (
        <>
          <Header />
          <Sidebar />
          <ContactGrid />
        </>
      ),
    },
    {
      path: "/allLeads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllLeadsList />
        </>
      ),
    },
    {
      path: "/editRole",
      element: (
        <>
          <Header />
          <Sidebar />
          <EditRole />
        </>
      ),
    },
    {
      path: "/employee-dashboard",
      element: (
        <>
          <Header />
          <Sidebar />
          <EmployeeDashboard />
        </>
      ),
    },
    {
      path: "/employeeList",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllEmployeeList />
        </>
      ),
    },
    {
      path: "/add-employee",
      element: (
        <>
          <Header />
          <Sidebar />
          <AddEmployee />
        </>
      ),
    },
    {
      path: "/edit-employee/:userid",
      element: (
        <>
          <Header />
          <Sidebar />
          <EditEmployee />
        </>
      ),
    },
    {
      path: "/AllNewLeads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllNewLeads />
        </>
      ),
    },
    {
      path: "/AllPendingLeads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllPendingLeads />
        </>
      ),
    },
    {
      path: "/AllDuplicateLeads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllDuplicateLeads />
        </>
      ),
    },
    {
      path: "/AllWon",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllWon />
        </>
      ),
    },
    {
      path: "/AllJunk",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllJunk />
        </>
      ),
    },
    {
      path: "/AllSiteVisit",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllSiteVisit />
        </>
      ),
    },
    {
      path: "/AllFollowUpLeads",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllFollowUpLeads />
        </>
      ),
    },
    {
      path: "/AllLost",
      element: (
        <>
          <Header />
          <Sidebar />
          <AllLost />
        </>
      ),
    },
    {
      path: "addRole",
      element: (
        <>
          <Header />
          <Sidebar />
          <AddRole />
        </>
      ),
    },
    {
      path: "*",
      element: (
        <>
          <UnderConstruction />
        </>
      ),
    },
  ]);
 
  return <RouterProvider router={router} />;
}

export default App;

// const Layout = () => {
//   return (
//     <>
//       <Header />
//       <Sidebar />
//       <Outlet /> {/* Outlet for rendering nested routes */}
//     </>
//   );
// };

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Login />,
//     },
//     {
//       path: "/register",
//       element: <Register />,
//     },
//     {
//       path: "/",
//       element: <Layout />, // Parent layout for all the following routes
//       children: [
//         {
//           path: "/index",
//           element: <EmployeesGrid />,
//         },
//         {
//           path: "/leads-dashboard",
//           element: <LeadsGrid />,
//         },
//         {
//           path: "/add-leads",
//           element: <AddNewLeads />,
//         },
//         {
//           path: "/contact-grid",
//           element: <ContactGrid />,
//         },
//         {
//           path: "/allLeads",
//           element: <AllLeadsList />,
//         },
//         {
//           path: "/editRole",
//           element: <EditRole />,
//         },
//         {
//           path: "/employee-dashboard",
//           element: <EmployeeDashboard />,
//         },
//         {
//           path: "/employeeList",
//           element: <AllEmployeeList />,
//         },
//         {
//           path: "/add-employee",
//           element: <AddEmployee />,
//         },
//         {
//           path: "/edit-employee/:userid",
//           element: <EditEmployee />,
//         },
//         {
//           path: "/AllNewLeads",
//           element: <AllNewLeads />,
//         },
//         {
//           path: "/AllPendingLeads",
//           element: <AllPendingLeads />,
//         },
//         {
//           path: "/AllDuplicateLeads",
//           element: <AllDuplicateLeads />,
//         },
//         {
//           path: "/AllWon",
//           element: <AllWon />,
//         },
//         {
//           path: "/AllJunk",
//           element: <AllJunk />,
//         },
//         {
//           path: "/AllSiteVisit",
//           element: <AllSiteVisit />,
//         },
//         {
//           path: "/AllFollowUpLeads",
//           element: <AllFollowUpLeads />,
//         },
//         {
//           path: "/AllLost",
//           element: <AllLost />,
//         },
//         {
//           path: "/addRole",
//           element: <AddRole />,
//         },
//       ],
//     },
//     {
//       path: "*",
//       element: <UnderConstruction />,
//     },
//   ]);

//   return <RouterProvider router={router} />;
// }

