import { useState, useEffect} from "react";
import { database } from "../firebase";
import { ref, get, set, remove, push } from "firebase/database";
import ProfileDropdown from "./ProfileDropdown";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerIssues, setCustomerIssues] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [paymentProviderEmail, setPaymentProviderEmail] = useState("");
  const [paymentProviderName, setPaymentProviderName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState("users");

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    fetchUsers();
    // fetchProviders(); 
    fetchCategories();
    fetchCustomerIssues();
    fetchCustomers();
    fetchNotifications();
  }); 

  const fetchUsers = async () => {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      setUsers(Object.values(snapshot.val()));
    }
  };

  // const fetchProviders = useCallback(async () => {
  //   try {
  //     const providersRef = ref(database, "providers");
  //     const snapshot = await get(providersRef);

  //     if (snapshot.exists()) {
  //       setProviders(Object.values(snapshot.val())); 
  //     } else {
  //       console.log("No providers found");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching providers:", error); 
  //   }
  // },[]);

  const fetchNotifications = async () => {
    const notificationsRef = ref(database, "serviceProviderReplies");
    const snapshot = await get(notificationsRef);
    if (snapshot.exists()) {
      setNotifications(Object.values(snapshot.val()));
    }
  };

  const fetchCategories = async () => {
    const categoryData = [
      {
        topic: "Household Services",
        services: [
          "House cleaning and organization",
          "Laundry and ironing",
          "Furniture assembly and installation",
          "Handyman services (e.g., minor repairs, maintenance)",
        ],
      },
      {
        topic: "Home Maintenance and Repair",
        services: [
          "Plumbing services (e.g., leak fixing, pipe installation)",
          "Electrical services (e.g., wiring, lighting installation)",
          "HVAC services (e.g., heating, ventilation, air conditioning)",
          "Carpentry and woodworking services",
        ],
      },
      {
        topic: "Yard and Outdoor Services",
        services: [
          "Lawn care and landscaping",
          "Gardening and plant care",
          "Pool maintenance and cleaning",
          "Pest control services",
        ],
      },
      {
        topic: "Appliance and Electronics Services",
        services: [
          "Appliance installation and repair (e.g., refrigerator, oven, dishwasher)",
          "Electronics installation and repair (e.g., TV, computer, smartphone)",
          "Home theater installation and setup",
        ],
      },
      {
        topic: "Moving and Storage Services",
        services: [
          "Local and long-distance moving",
          "Packing and unpacking services",
          "Storage solutions (e.g., container storage, warehouse storage)",
        ],
      },
    ];

    setCategories(categoryData);
  };

  const fetchCustomerIssues = async () => {
    const issuesRef = ref(database, "customerIssues");
    const snapshot = await get(issuesRef);
    if (snapshot.exists()) {
      setCustomerIssues(Object.values(snapshot.val()));
    }
  };

  const fetchCustomers = async () => {
    const customersRef = ref(database, "customers");
    const snapshot = await get(customersRef);
    if (snapshot.exists()) {
      setCustomers(Object.values(snapshot.val()));
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !selectedIssue || !selectedService || !message) {
      alert("Please fill in all fields to send a message.");
      return;
    }

    const messageData = {
      userId: selectedUser,
      issue: selectedIssue,
      service: selectedService,
      message: message,
      timestamp: Date.now(),
    };

    const messagesRef = push(ref(database, "adminMessages"));
    await set(messagesRef, messageData);

    setSelectedUser("");
    setSelectedIssue("");
    setSelectedService("");
    setMessage("");
  };

  const handleAddCustomer = async () => {
    if (!newCustomerName || !newCustomerEmail) {
      alert("Please provide both name and email for the new customer.");
      return;
    }

    const newCustomerRef = push(ref(database, "customers"));
    await set(newCustomerRef, {
      name: newCustomerName,
      email: newCustomerEmail,
    });
    fetchCustomers();
    setNewCustomerName("");
    setNewCustomerEmail("");
  };

  const handleRemoveCustomer = async (id) => {
    const customerRef = ref(database, "customers/" + id);
    await remove(customerRef);
    fetchCustomers();
  };

  const handlePayment = async () => {
    if (!paymentProviderName || !paymentProviderEmail || !paymentAmount || !upiId) {
      alert("Please fill in all fields to process the payment.");
      return;
    }

    const paymentData = {
      providerName: paymentProviderName,
      providerEmail: paymentProviderEmail,
      amount: paymentAmount,
      upiId: upiId,
      timestamp: Date.now(),
    };

    const paymentRef = push(ref(database, "payments"));
    await set(paymentRef, paymentData);

    setPaymentProviderName("");
    setPaymentProviderEmail("");
    setPaymentAmount("");
    setUpiId("");
  };

  return (
    <div className="back">
      <div className="admin-dashboard">
      <div className="main">
        <h2>Admin Dashboard</h2>
        <div className="profile-section">
          <div className="notification-icon" onClick={toggleNotifications}>
            <i className="icon-notification">🔔</i>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
          <ProfileDropdown />
        </div>
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index}>
                  <p>
                    <strong>{notification.name}</strong>
                    {notification.message}
                  </p>
                  <p>{new Date(notification.timestamp).toLocaleString()}</p>
                  <hr />
                </li>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </ul>
        </div>
      )}

      <nav className="navbar">
        <ul>
          <li onClick={() => setActiveSection("users")}>Users</li>
          <li onClick={() => setActiveSection("issues")}>Customer Issues</li>
          <li onClick={() => setActiveSection("customers")}>Customers</li>
          <li onClick={() => setActiveSection("sendMessage")}>Send Message</li>
          <li onClick={() => setActiveSection("payments")}>Payments</li>
        </ul>
      </nav>

      {activeSection === "users" && (
        <div className="admin-section">
        <h3>Users</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="li">
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <hr />
              </li>
            ))
          ) : (
            <p>No registered users found</p>
          )}
        </ul>
      </div>
      )}

      {activeSection === "issues" && (
        <div className="admin-section">
        <h3>Customer Issues</h3>
        <ul>
          {customerIssues.length > 0 ? (
            customerIssues.map((issue, index) => (
              <li key={index}>
                <p>Service: {issue.service}</p>
                <p>Message: {issue.message}</p>
                <p>User ID: {issue.userId}</p>
                <p>Timestamp: {new Date(issue.timestamp).toLocaleString()}</p>
                <hr />
              </li>
            ))
          ) : (
            <p>No customer issues found</p>
          )}
        </ul>
      </div>
      )}

      {activeSection === "customers" && (
        <div className="admin-section">
         <div className="ex1">
         <h3>Add Customer</h3>
          <input
            type="text" className="selectname1"
            placeholder="Customer Name"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
          />
          <input
            type="email" className="selectname1"
            placeholder="Customer Email"
            value={newCustomerEmail}
            onChange={(e) => setNewCustomerEmail(e.target.value)}
          />
          <button onClick={handleAddCustomer}>Add Customer</button>
         </div>
          <h4>Current Customers</h4>
          <ul>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <li key={index}>
                  <p>Name: {customer.name}</p>
                  <p>Email: {customer.email}</p>
                  <button className="na" onClick={() => handleRemoveCustomer(customer.id)}>Remove</button>
                </li>
              ))
            ) : (
              <p>No customers found</p>
            )}
          </ul>
        </div>
      )}

      {activeSection === "sendMessage" && (
         <div className="admin-section civ">
         <h3>Send Message to Service Provider</h3>
         <select
           value={selectedUser}
           onChange={(e) => setSelectedUser(e.target.value)}
          className="selectname">
           <option value="">Select a User</option>
           {users.map((user, index) => (
             <option key={index} value={user.id}>
               {user.firstName} {user.lastName}
             </option>
           ))}
         </select>
 
         <select
           value={selectedIssue}
           onChange={(e) => setSelectedIssue(e.target.value)}
           className="selectname">
           <option value="">Select an Issue</option>
           {customerIssues.map((issue, index) => (
             <option key={index} value={issue.id}>
               {issue.message}
             </option>
           ))}
         </select>
 
         <select
           value={selectedService}
           onChange={(e) => setSelectedService(e.target.value)}
           className="selectname">
           <option value="">Select a Service</option>
           {categories.map((category, index) => (
             <optgroup key={index} label={category.topic}>
               {category.services.map((service, serviceIndex) => (
                 <option key={serviceIndex} value={service}>
                   {service}
                 </option>
               ))}
             </optgroup>
           ))}
         </select>
 
         <textarea
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Enter your message"
           className="selectname" ></textarea>
         <button onClick={handleSendMessage}>Send Message</button>
       </div>
      )}

{activeSection === "payments" && (
        <div className="admin-section civ">
          <h3>Process Payments</h3>
          <input
            type="text" className="selectname"
            placeholder="Provider Name"
            value={paymentProviderName}
            onChange={(e) => setPaymentProviderName(e.target.value)}
          />
          <input
            type="text" className="selectname"
            placeholder="Provider Email"
            value={paymentProviderEmail}
            onChange={(e) => setPaymentProviderEmail(e.target.value)}
          />
          <input
            type="number" className="selectname"
            placeholder="Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
          <input
            type="text" className="selectname"
            placeholder="UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <button onClick={handlePayment}>Process Payment</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminDashboard;
