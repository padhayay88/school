import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/homepage.css";

const Homepage = () => {
  const [notices, setNotices] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [noticesRes, studentsRes] = await Promise.all([
          api.get("/notices"),
          api.get("/students"),
        ]);
        setNotices(noticesRes.data?.slice(0, 3) || []);
        setStudents(studentsRes.data?.slice(0, 4) || []);
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      }
    };
    load();
  }, []);

  return (
    <div className="homepage">
      {/* Navigation Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <strong>📚 Unique English Boarding School</strong>
          </div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#news">News</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="login-nav-button">Owner Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to</h1>
          <h2>Unique English Boarding School</h2>
          <p className="tagline">Excellence in Education</p>
          <button className="cta-button">Learn More</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">📚</div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="quick-info">
        <div className="container">
          <div className="info-card">
            <div className="icon">📝</div>
            <h3>Admissions</h3>
            <p>Enroll your child in our world-class institution with modern facilities and experienced faculty.</p>
            <a href="#admissions" className="link">Learn More →</a>
          </div>
          <div className="info-card">
            <div className="icon">📢</div>
            <h3>Notice Board</h3>
            <p>Stay updated with latest announcements, events, and important school notices.</p>
            <a href="#notices" className="link">View Notices →</a>
          </div>
          <div className="info-card">
            <div className="icon">🏆</div>
            <h3>Our Results</h3>
            <p>Consistent excellence in academics with outstanding student performance and achievements.</p>
            <a href="#results" className="link">View Results →</a>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome">
        <div className="container">
          <div className="welcome-grid">
            <div className="welcome-text">
              <h2>Welcome to Unique English Boarding School</h2>
              <p>
                We are committed to providing quality education and fostering an environment where every student can thrive. Our experienced faculty and modern facilities ensure comprehensive development of our students.
              </p>
              <button className="read-more-btn">Read More</button>
            </div>
            <div className="principal-message">
              <div className="message-box">
                <h3>Message from the Principal</h3>
                <div className="principal-photo">👨‍🎓</div>
                <p>
                  "Education is not just about academic excellence; it's about building character and developing responsible citizens who can contribute to society."
                </p>
                <p className="principal-name">— Principal, Kumkum Upadhyay</p>
                <button className="read-message-btn">Read Full Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section className="news" id="news">
        <div className="container">
          <h2>Latest News & Announcements</h2>
          <div className="news-grid">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice._id} className="news-card">
                  <div className="news-icon">📰</div>
                  <h4>{notice.title || "School Announcement"}</h4>
                  <p>{notice.description || "Important notice for all students and parents."}</p>
                  <a href="#notice" className="news-link">Read More →</a>
                </div>
              ))
            ) : (
              <>
                <div className="news-card">
                  <div className="news-icon">🎉</div>
                  <h4>Holiday Announcement</h4>
                  <p>School will remain closed on national holidays. Check notice board for details.</p>
                  <a href="#notice" className="news-link">Read More →</a>
                </div>
                <div className="news-card">
                  <div className="news-icon">📅</div>
                  <h4>Upcoming Exam Schedule</h4>
                  <p>Annual exams scheduled for March. Detailed timetable will be shared soon.</p>
                  <a href="#notice" className="news-link">Read More →</a>
                </div>
                <div className="news-card">
                  <div className="news-icon">⚽</div>
                  <h4>Annual Sports Festival</h4>
                  <p>Join us for our annual sports day with various athletic competitions and prizes.</p>
                  <a href="#notice" className="news-link">Read More →</a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery" id="gallery">
        <div className="container">
          <h2>School Gallery</h2>
          <div className="gallery-grid">
            <div className="gallery-item">📸</div>
            <div className="gallery-item">🏫</div>
            <div className="gallery-item">👥</div>
            <div className="gallery-item">🎓</div>
          </div>
          <div className="gallery-action">
            <button className="view-gallery-btn">View Gallery</button>
          </div>
        </div>
      </section>

      {/* Why Choose Our School */}
      <section className="why-choose">
        <div className="container">
          <h2>Why Choose Our School?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Qualified Teachers</h4>
              <p>Experienced and dedicated faculty</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Modern Facilities</h4>
              <p>State-of-the-art infrastructure</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Cool Activities</h4>
              <p>Diverse co-curricular programs</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Safe Environment</h4>
              <p>Secure and nurturing campus</p>
            </div>
          </div>
          <div className="brochure-action">
            <button className="brochure-btn">View Brochure</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>About Us</h4>
              <p>Unique English Boarding School - Excellence in Education</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#admissions">Admissions</a></li>
                <li><a href="#notices">Notices</a></li>
                <li><a href="#results">Results</a></li>
                <li><a href="#gallery">Gallery</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@school.edu</p>
              <p>Phone: (+91) XXXXXXXXXX</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Unique English Boarding School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
