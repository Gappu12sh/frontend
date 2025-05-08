import { all_routes } from "../../../feature-module/router/all_routes";
const routes = all_routes;

export const SidebarDataTest = [
  {
    tittle: 'Main Menu',
    link: '/index',
    icon: 'airplay',
    showAsTab: true,
    separateRoute: false,
    submenu: true,
    submenuItems: [
      {
        label: 'Dashboard',
        link: '/index',
        submenu: true,
        showSubRoute: false,
        icon: 'smart-home',
        base: 'dashboard',
        materialicons: '',
        dot: true,
        submenuItems: [
          { label: "Admin Dashboard", link:"/index" },
          { label: "Employee Dashboard", link:  "/employee-dashboard" },
          { label: "Add Employee", link: '/add-employee' },
          { label: "Add Role", link: '/addRole' },
          { label: "Edit Role", link: '/editRole' },


        ],
      },  
      {
        label: 'Leads Dashboard',
        // link: 'index',
        link: '/leads-dashboard',
        submenu: true,
        showSubRoute: false,
        icon: 'smart-home',
        base: 'Leads Dashboard',
        materialicons: '',
        submenuItems: [
          {
            label: 'All Leads',
            link: '/leads-dashboard',
            base: 'All Leads',
          },
          {
            label: 'All Leads List',
            link: '/allLeads',
            base: 'All Leads',
          },
          {
            label: 'Add Leads',
            link: "/add-leads",
            base: 'add leads',
          },
         
          {
            label: 'New Leads',
            link: "/AllNewLeads",
            base: 'new leads',
          },   
          {
            label: "Pending Leads",
            link: "/AllPendingLeads",
            base: 'pending leads',
          },
          {
            label: 'Follow Up',
            link: "/AllFollowUpLeads",
            base: 'Follow up leads',
          },
          {
            label: 'Site Visit',
            link: "/AllSiteVisit",
            base: 'site visit leads',
          },
          {
            label: 'Duplicate Leads',
            link: "/AllDuplicateLeads",
            base: 'All duplicate Leads',
          },
          {
            label: 'Won Leads',
            link: "/AllWon",
            base: 'WON leads',
          },
          {
            label: 'Junk',
            link: "/AllJunk",
            base: 'Junk leads',
          },
          {
            label: 'Lost',
            link: "/AllLost",
            base: 'Lost leads',
          },
        ],
      },
   
      {
        label: 'Super Admin',
        // link: 'index',
        link: routes.superAdminDashboard,
        submenu: true,
        showSubRoute: false,
        icon: 'user-star',
        base: 'super-admin',
        materialicons: '',
        submenuItems: [
          {
            label: 'Dashboard',
            link: routes.superAdminDashboard,
            base: 'super-admin-dashboard',
          },
          {
            label: 'Companies',
            link: routes.superAdminCompanies,
            base: 'companies',
          },
          {
            label: 'Subscriptions',
            link: routes.superAdminSubscriptions,
            base: 'subscriptions',
          },
          {
            label: 'Packages',
            link: routes.superAdminPackages,
            base: 'packages',
            base2: 'packages-grid',
          },
          {
            label: 'Domain',
            link: routes.superAdminDomain,
            base: 'domain',
          },
          {
            label: 'Purchase Transaction',
            link: routes.superAdminPurchaseTransaction,
            base: 'purchase-transaction',
          },
        ],
      },
    ],
  },
 
  {
    tittle: 'CRM',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Contacts',
        link: routes.contactGrid,
        submenu: false,
        showSubRoute: false,
        icon: 'user-shield',
        base: 'contact',
        materialicons: 'confirmation_number',
        submenuItems: [],
      },
      {
        label: 'Companies',
        link: routes.companiesGrid,
        submenu: false,
        showSubRoute: false,
        icon: 'building',
        base: 'company',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
    ],
  },
  // {
  //   tittle: 'HRM',
  //   icon: 'file',
  //   showAsTab: false,
  //   separateRoute: false,
  //   submenuItems: [
  //     {
  //       label: 'Employees',
  //       link: routes.employeeList,
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: 'users',
  //       base: 'employees',
  //       materialicons: 'people',
  //       submenuItems: [
  //         {
  //           label: 'Employees List',
  //           link: routes.employeeList,
  //           base: 'employees',
  //           base2: 'employee-list',
  //         },
  //         {
  //           label: 'Employees Grid',
  //           link: routes.employeeGrid,
  //           base: 'employees',
  //           base2: 'employee-grid',
  //         },
  //         {
  //           label: 'Employees Details',
  //           link: routes.employeedetails,
  //           base: 'employees',
  //           base2: 'employee-details',
  //         },
        
  //       ],
  //     },
  
  //   ],
  // },
  
];