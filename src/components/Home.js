import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import serviceImage1 from "../assets/images/images.jpeg";
import serviceImage2 from "../assets/images/images"; 
import serviceImage3 from "../assets/images/plumber.jpg"; 
import serviceImage4 from "../assets/images/electrical.jpeg";
import serviceImage5 from "../assets/images/main.png";
import serviceImage6 from "../assets/images/remold.jpeg";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header">
        <div>
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate("/login")}>Login / Register</button>
        </div>
      </header>
      <section className="hoempage">
        <div className="content">
          <h1>Welcome to Our Service Platform</h1>
          <p>Your trusted platform for booking top-quality home services, from repairs to renovations, all at your convenience.</p>
          <a className="anger" href="#service">Explore Our Services..</a>
        </div>
      </section>
      <section className="services-section" id="service">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <img className="img" src={serviceImage1} alt="Service 1" />
            <h3>Painting</h3>
            <p>Our home service platform offers professional painting services to refresh and revitalize your living spaces.</p>
          </div>
          <div className="service-card">
            <img src={serviceImage2} alt="Service 2" />
            <h3>Flooring</h3>
            <p>Upgrade your home with expert flooring services, offering installation and repair for a variety of materials including hardwood, tile, and laminate.</p>
          </div>
          <div className="service-card">
            <img src={serviceImage3} alt="Service 3" />
            <h3>Plumbing</h3>
            <p>Get reliable plumbing services for leak repairs, pipe installations, and maintenance to keep your home running smoothly.</p>
          </div>
          <div className="service-card">
            <img src={serviceImage4} alt="Service 4" />
            <h3>Electrical Work</h3>
            <p>Expert electrical services for safe wiring, lighting installations, and electrical repairs in your home.</p>
          </div>
          <div className="service-card">
            <img src={serviceImage5} alt="Service 5" />
            <h3>Maintenance & Repairs</h3>
            <p>Reliable maintenance and repair services to keep your home in top condition, from minor fixes to major repairs.</p>
          </div>
          <div className="service-card">
            <img src={serviceImage6} alt="Service 6" />
            <h3>Remodeling</h3>
            <p>Expert remodeling services to transform your space, bringing your vision to life with quality craftsmanship.</p>
          </div>
        </div>
      </section>  
      <section className="work">
        <h1>Ready to Transform Your Home ..</h1>
        <p>Book a service appointment with Service Master and let our experts take care of your home renovation needs.</p><br></br>
      </section>
      <footer className="footer">
        <p>&copy; 2024 Our Service Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
