import React, { useState, useEffect } from "react";

const EditRole = () => {
  const [rolesData, setRolesData] = useState([]);
  const apiUrl = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/reportTo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        // Transform the data into the structure needed for hierarchy
        const transformedData = transformDataToHierarchical(data);
        setRolesData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Transform the data to hierarchical format
  const transformDataToHierarchical = (data) => {
    const roles = data.roles;
    const users = data.users;

    // Create a map for all roles
    const roleMap = roles.reduce((acc, role) => {
      acc[role.role_name] = {
        id: role.role_name,
        name: role.role_name,
        parentId: null, // Initially set as null, will set dynamically
        users: users[role.role_name] || [],
        children: [], // Will add child roles later
      };
      return acc;
    }, {});

    // Build hierarchy by associating child roles under parent roles based on level
    roles.forEach((role) => {
      const parentRole = roleMap[role.role_name];
      const childRoles = roles.filter((r) => r.role_level === role.role_level + 1);

      // Link the child roles to the parent role
      childRoles.forEach((child) => {
        roleMap[child.role_name].parentId = role.role_name;
        parentRole.children.push(roleMap[child.role_name]);
      });
    });

    // Start with top-level roles (admin, etc.)
    return Object.values(roleMap).filter((role) => role.parentId === null);
  };

  // Render each role and its users
  const renderRole = (role) => {
    return (
      <div style={{ marginLeft: "20px" }} key={role.id}>
        <div>
          <strong>{role.name}</strong>
        </div>
        {role.users.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            <strong>Users:</strong>
            <ul>
              {role.users.map((user) => (
                <li key={user.user_id}>{user.user_name}</li>
              ))}
            </ul>
          </div>
        )}
        {role.children && role.children.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            <strong>Sub-Roles:</strong>
            {role.children.map((childRole) => renderRole(childRole))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
      <div style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
        <h2 style={{ textAlign: "center", color: "#007bff", fontSize: "24px", marginBottom: "20px" }}>
          Role Hierarchy
        </h2>
        {rolesData.length > 0 ? (
          rolesData.map((role) => renderRole(role))
        ) : (
          <div>No roles found</div>
        )}
      </div>
    </div>
  );
};

export default EditRole;


// import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const EditRole = () => {
//   const [items, setItems] = useState([]);
//   const apiUrl = process.env.REACT_APP_URL;
//   const token = localStorage.getItem("token");

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/user/reportTo`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
        
//         // Transform the data into the structure needed for DnD
//         const transformedData = transformDataToHierarchical(data);
//         setItems(transformedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Transform the API data into a hierarchical structure
//   const transformDataToHierarchical = (data) => {
//     const roles = data.roles;
//     const users = data.users;

//     // Create a map of all roles by their role_name for easy lookup
//     const roleMap = roles.reduce((acc, role) => {
//       acc[role.role_name] = {
//         id: role.role_name,
//         name: role.role_name,
//         parentId: null, // Initially set as null, later we'll set this dynamically
//         children: [],
//         users: users[role.role_name] || [],
//       };
//       return acc;
//     }, {});

//     // Now, build the hierarchy by adding child roles to their parent
//     roles.forEach((role) => {
//       const parentRole = roleMap[role.role_name];
//       const childRoles = roles.filter((r) => r.role_level === role.role_level + 1);

//       // Link the child roles to the parent role
//       childRoles.forEach((child) => {
//         roleMap[child.role_name].parentId = role.role_name;
//         parentRole.children.push(roleMap[child.role_name]);
//       });
//     });

//     // Filter out roles that are at the top level (level 1)
//     return Object.values(roleMap).filter((role) => role.parentId === null);
//   };

//   // Handle drag and drop event
//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === draggableId ? { ...item, parentId: destination.droppableId === "root" ? null : destination.droppableId } : item
//       )
//     );
//   };

//   // Render roles and users dynamically
//   const renderItems = (parentId) => {
//     const filteredItems = items.filter((item) => item.parentId === parentId);
//     return (
//       <Droppable droppableId={parentId || "root"} type="TASK">
//         {(provided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             style={{
//               paddingLeft: parentId ? 20 : 0,
//               borderLeft: parentId ? "3px solid #007bff" : "none",
//               marginLeft: parentId ? "15px" : "0",
//             }}
//           >
//             {filteredItems.map((item, index) => (
//               <Draggable key={item.id} draggableId={item.id} index={index}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     style={{
//                       padding: "14px",
//                       backgroundColor: "#ffffff",
//                       border: "1px solid #f27031",
//                       borderRadius: "8px",
//                       cursor: "grab",
//                       textAlign: "left",
//                       minWidth: "250px",
//                       margin: "10px 0",
//                       boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.1)",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       transition: "all 0.2s ease-in-out",
//                       ...provided.draggableProps.style,
//                     }}
//                   >
//                     <span>{item.name}</span>
//                     {item.users.length > 0 && (
//                       <div>
//                         <strong>Users:</strong>
//                         {item.users.map((user) => (
//                           <div key={user.user_id}>{user.user_name}</div>
//                         ))}
//                       </div>
//                     )}
//                     {item.children.length > 0 && renderItems(item.id)} {/* Render sub-roles */}
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     );
//   };

//   return (
//     <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
//       <div style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
//         <h2 style={{ textAlign: "center", color: "#007bff", fontSize: "24px", marginBottom: "20px" }}>
//           Role Hierarchy
//         </h2>
//         <DragDropContext onDragEnd={onDragEnd}>
//           {renderItems(null)} {/* Render the top-level roles */}
//         </DragDropContext>
//       </div>
//     </div>
//   );
// };

// export default EditRole;


// import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


// const EditRole = () => {
//   const [items, setItems] = useState([]);
//   const apiUrl = process.env.REACT_APP_URL;
//   const token =localStorage.getItem("token")
//   // Fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/user/reportTo`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const data = await response.json();
        
//         // Transform the data into the structure needed for DnD
//         const transformedData = transformDataToHierarchical(data);
//         setItems(transformedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const transformDataToHierarchical = (data) => {
//     const roles = data.roles;
//     const users = data.users;

//     // Helper function to create the hierarchical structure
//     const createHierarchy = (roleName, parentId = null) => {
//       const usersForRole = users[roleName] || [];
//       const childrenRoles = roles.filter(role => role.role_level === (roles.find(r => r.role_name === roleName)?.role_level + 1));

//       // Build the node for the current role
//       const roleNode = {
//         id: roleName,
//         name: roleName,
//         parentId: parentId,
//         children: [],
//         users: usersForRole.map(user => ({ id: user.user_id, name: user.user_name }))
//       };

//       // Recursively add sub-roles (children roles)
//       childrenRoles.forEach(role => {
//         roleNode.children.push(createHierarchy(role.role_name, roleName));
//       });

//       return roleNode;
//     };

//     // Start from the root (roles with level 1)
//     const hierarchicalData = roles.filter(role => role.role_level === 1).map(role => createHierarchy(role.role_name));
//     return hierarchicalData;
//   };

//   // Drag and Drop handler
//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === draggableId ? { ...item, parentId: destination.droppableId === "root" ? null : destination.droppableId } : item
//       )
//     );
//   };

//   // Render roles and users dynamically
//   const renderItems = (parentId) => {
//     const filteredItems = items.filter((item) => item.parentId === parentId);
//     return (
//       <Droppable droppableId={parentId || "root"} type="TASK">
//         {(provided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             style={{
//               paddingLeft: parentId ? 20 : 0,
//               borderLeft: parentId ? "3px solid #007bff" : "none",
//               marginLeft: parentId ? "15px" : "0",
//             }}
//           >
//             {filteredItems.map((item, index) => (
//               <Draggable key={item.id} draggableId={item.id} index={index}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     style={{
//                       padding: "14px",
//                       backgroundColor: "#ffffff",
//                       border: "1px solid #f27031",
//                       borderRadius: "8px",
//                       cursor: "grab",
//                       textAlign: "left",
//                       minWidth: "250px",
//                       margin: "10px 0",
//                       boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.1)",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       transition: "all 0.2s ease-in-out",
//                       ...provided.draggableProps.style
//                     }}
//                   >
//                     <span>{item.name}</span>
//                     {item.users.length > 0 && (
//                       <div>
//                         {item.users.map(user => (
//                           <div key={user.id}>{user.name}</div>
//                         ))}
//                       </div>
//                     )}
//                     {renderItems(item.id)} {/* Render sub-roles */}
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     );
//   };
//   return (
//     <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
//       <div style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
//         <h2 style={{ textAlign: "center", color: "#007bff", fontSize: "24px", marginBottom: "20px" }}>Role Hierarchy</h2>
//         <DragDropContext onDragEnd={onDragEnd}>
//           {renderItems(null)}
//         </DragDropContext>
//       </div>
//     </div>
//   );
// };

// export default EditRole;
// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const initialData = [
//   { id: "1", name: "CEO", parentId: null },
//   { id: "2", name: "Deputy Director", parentId: "1" },
//   { id: "3", name: "Office of Workplace Solutions", parentId: "1" },
//   { id: "4", name: "Analysis Division", parentId: "3"},
//   { id: "5", name: "IT Division", parentId: "3" },
//   { id: "6", name: "Management Programs Division", parentId: "1" },
//   { id: "7", name: "Regulatory and Enforcement Division", parentId: "1" },
//   { id: "8", name: "Office of Financial Management", parentId: "6" }
// ];

// const EditRole = () => {
//   const [items, setItems] = useState(initialData);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === draggableId ? { ...item, parentId: destination.droppableId === "root" ? null : destination.droppableId } : item
//       )
//     );
//   };

//   const renderItems = (parentId) => {
//     const filteredItems = items.filter((item) => item.parentId === parentId);
//     return (
//       <Droppable droppableId={parentId || "root"} type="TASK">
//         {(provided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             style={{
//               paddingLeft: parentId ? 20 : 0,
//               borderLeft: parentId ? "3px solid #007bff" : "none",
//               marginLeft: parentId ? "15px" : "0",
//             }}
//           >
//             {filteredItems.map((item, index) => (
//               <Draggable key={item.id} draggableId={item.id} index={index}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     style={{
//                       padding: "14px",
//                       backgroundColor: "#ffffff",
//                       border: "1px solid #f27031",
//                       borderRadius: "8px",
//                       cursor: "grab",
//                       textAlign: "left",
//                       minWidth: "250px",
//                       margin: "10px 0",
//                       boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.1)",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       transition: "all 0.2s ease-in-out",
//                       ...provided.draggableProps.style
//                     }}
//                   >
//                     <span>{item.name}</span>
//                     {renderItems(item.id)}
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     );
//   };

//   return (
//     <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">

//     <div style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
//       <h2 style={{ textAlign: "center", color: "#007bff", fontSize: "24px", marginBottom: "20px" }}>Role Hierarchy</h2>
//       <DragDropContext onDragEnd={onDragEnd}>{renderItems(null)}</DragDropContext>
//       </div>
//       </div>
//     );
// };

// export default EditRole;
