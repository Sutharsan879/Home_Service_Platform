import { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, get, push, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./ServiceProviderDashboard.css";
import ProfileDropdown from "./ProfileDropdown";

const ServiceProviderDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeSection, setActiveSection] = useState("requests");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchRequests(user.uid);
        await fetchPaymentDetails(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRequests = async () => {
    const requestRef = ref(database, "adminMessages");
    const snapshot = await get(requestRef);
    if (snapshot.exists()) {
      const requests = Object.values(snapshot.val());
      setRequests(requests);
    } else {
      console.log("No requests found.");
    }
  };

  const fetchPaymentDetails = async () => {
    const paymentRef = ref(database, "payments");
    const snapshot = await get(paymentRef);
    if (snapshot.exists()) {
      setPaymentDetails(Object.values(snapshot.val()));
    } else {
      console.log("No payment details found.");
    }
  };

  const sendReplyMessage = async () => {
    if (!replyMessage) {
      alert("Please enter a message before sending.");
      return;
    }

    const replyData = {
      serviceProviderId: userId,
      message: replyMessage,
      timestamp: Date.now(),
    };

    const replyRef = push(ref(database, "serviceProviderReplies"));
    await set(replyRef, replyData);

    setReplyMessage("");
    alert("Message sent to admin.");
  };

  const downloadBill = (payments) => {
    const billContent = `
      Bill Details
      --------------------
      Amount: ₹${payments.amount}
      Received From: ${payments.providerName} (${payments.providerEmail})
      Received At: ${new Date(payments.timestamp).toLocaleString()}
      UPI ID : ${payments.upiId}
    `;

    const blob = new Blob([billContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bill_${payments.timestamp}.txt`;
    link.click();
  };

  return (
    <div className="service-provider-dashboard">
      <div className="main-content">
        <div className="main">
          <h2>Service Provider Dashboard</h2>
          <ProfileDropdown />
        </div>

        <div className="navbar">
        <ul>
          <li onClick={() => setActiveSection("requests")}>Your Request Messages</li>
          <li onClick={() => setActiveSection("reply")}>Reply to Admin</li>
          <li onClick={() => setActiveSection("payments")}>Payment Received</li>
        </ul>
      </div>

        {activeSection === "requests" && (
          <div className="requests-section">
            <h3>Your Request Messages</h3>
            <ul>
              {requests.length > 0 ? (
                requests.map((request, index) => (
                  <li key={index} className="request-item">
                    <p>
                      <strong>Service:</strong> {request.service}
                    </p>
                    <p>
                      <strong>Message:</strong> {request.message}
                    </p>
                    <p>
                      <strong>Sent At:</strong>{" "}
                      {new Date(request.timestamp).toLocaleString()}
                    </p>
                    <hr />
                  </li>
                ))
              ) : (
                <p>No requests from admin.</p>
              )}
            </ul>
          </div>
        )}

        {activeSection === "reply" && (
          <div className="reply-section">
            <h3>Reply to Admin</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="reply-box"
            ></textarea>
            <button className="send-btn" onClick={sendReplyMessage}>
              Send Message
            </button>
          </div>
        )}

        {activeSection === "payments" && (
          <div className="payment-section">
            <h3>Payment Received</h3>
            <ul>
              {paymentDetails.length > 0 ? (
                paymentDetails.map((payments, index) => (
                  <li key={index} className="payment-item">
                    <p>
                      <strong>Amount:</strong> ₹{payments.amount}
                    </p>
                    <p>
                      <strong>Received From:</strong> {payments.providerName} (
                      {payments.providerEmail})
                    </p>
                    <p>
                      <strong>UPI ID : </strong>
                      {payments.upiId}
                    </p>
                    <p>
                      <strong>Received At:</strong>{" "}
                      {new Date(payments.timestamp).toLocaleString()}
                    </p>
                    <button  className="send-btn" onClick={() => downloadBill(payments)}>
                      Download Bill
                    </button>
                    <hr />
                  </li>
                ))
              ) : (
                <p>No payments received yet.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
