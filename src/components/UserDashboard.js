import { useEffect, useState, useMemo } from "react";
import { database } from "../firebase";
import { ref,set, push } from "firebase/database";
import "./UserDashboard.css";
import ProfileDropdown from "./ProfileDropdown";

const UserDashboard = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const categoryData = useMemo(() => [
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
    {
      topic: "Specialized Services",
      services: [
        "Home inspection and appraisal",
        "Energy audit and efficiency services",
        "Home security system installation and monitoring",
        "Smart home automation services",
      ],
    },
  ], []);

  useEffect(() => {
    const allServices = categoryData.flatMap((category) => category.services);
    setServices(allServices);
  }, [categoryData]); 

  const handleSendMessage = async () => {
    if (!selectedService || !message) {
      alert("Please select a service and write a message.");
      return;
    }

    const messageData = {
      service: selectedService,
      message: message,
      userId: "userId1",
      timestamp: Date.now(),
    };

    try {
      const messagesRef = ref(database, "customerIssues");
      const newMessageRef = push(messagesRef); 
      await set(newMessageRef, messageData);

      setMessageSent(true);
      setMessage("");
      setSelectedService("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback) {
      alert("Please provide your feedback.");
      return;
    }

    const feedbackData = {
      userId: "userId1",  
      feedback: feedback,
      timestamp: Date.now(),
    };

    try {
      const feedbackRef = ref(database, "userFeedback");
      const newFeedbackRef = push(feedbackRef);
      await set(newFeedbackRef, feedbackData);

      setFeedbackSent(true);
      setFeedback("");
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="back">
      <div className="user-dashboard">
        <div className="main">
          <div>
            <h2>User Dashboard</h2>
          </div>
          <div>
            <ProfileDropdown />
          </div>
        </div>
        <div className="message-section">
          <h3>Send Message to Admin</h3>
          <label>Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Select a service</option>
            {services.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>

          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue or message"
          />

          <button onClick={handleSendMessage}>Send Message</button>
          {messageSent && <p>Message sent to admin successfully!</p>}
        </div>
        <div className="feedback-section">
          <h3>Provide Your Feedback</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback here..."
          />
          <button onClick={handleSendFeedback}>Submit Feedback</button>
          {feedbackSent && <p>Feedback submitted successfully!</p>}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
