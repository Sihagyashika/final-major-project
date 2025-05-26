import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import './style.css'
import { User } from "lucide-react";
import { Navigate } from 'react-router-dom';
import Login from "./Login";
import axios from "axios";




// Main App Component with Router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="/bmi"
            element={
              <ProtectedRoute>
                <BMICalculator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <ClinicAppointment />
              </ProtectedRoute>
            }
          />

          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="clinic-name">ClinicEase</h1>
            <nav>
              <ul className="nav-links">
                <li className="user-dropdown" ref={dropdownRef}>
                  <button
                    className="user-icon-button"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User />
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {isLoggedIn ? (
                        <>
                          <Link to="/appointments" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            Appointments
                          </Link>
                          <Link to="/bmi" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            BMI
                          </Link>
                          <Link to="/aboutus" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            About Us
                          </Link>
                          <Link  className="dropdown-item" onClick={() => handleLogout()}>
                            Logout
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            Login / Signup
                          </Link>
                           <Link to="/bmi" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            BMI
                          </Link>
                          <Link to="/aboutus" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                            About Us
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container footer-content">
          <div className="footer-section">
            <h4>Location</h4>
            <p>123 Main Street, Cityville, Country</p>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@clinicease.com</p>
          </div>
          <div className="footer-section">
            <h4>Timings</h4>
            <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
            <p>Sat - Sun: Closed</p>
          </div>
        </div>

        <div className="container copyright">
          <p>© {new Date().getFullYear()} Clinic Ease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}




// Home Page Component
function Home() {
  const navigate = useNavigate();


  return (
    <div className="home-container">
      {/* Banner Image */}
      <div className="banner">
        <img
          src="https://as1.ftcdn.net/v2/jpg/06/28/64/22/1000_F_628642261_3RKwxs2KwWytPDJGkFFtMvGxJ1iyGvcU.jpg"
          alt="Clinic Banner"
          className="banner-image"
        />
        <div className="banner-overlay"></div> {/* 👈 this is the dark overlay */}
        <div className="banner-text">
          <h1>Welcome to ClinicEase</h1>
          <p>Care at your convenience!</p>
        </div>
      </div>


      <p className="center-text heading">We provide quality healthcare services with easy appointment booking.</p>

      <section className="cta-section">
        <h2>Need to see a doctor?</h2>
        <p>Book your appointment online and save time. We offer convenient morning and evening slots.</p>
        <button onClick={() => navigate('/appointments')} className="cta-button">
          Book an Appointment
        </button>
      </section>

      <section className="features-section">
        <div className="feature">
          <h3>Qualified Doctors</h3>
          <p>Our team consists of experienced healthcare professionals.</p>
        </div>
        <div className="feature">
          <h3>Modern Facilities</h3>
          <p>We use the latest technology for diagnosis and treatment.</p>
        </div>
        <div className="feature">
          <h3>Patient Care</h3>
          <p>Your health and comfort are our top priorities.</p>
        </div>
      </section>
    </div>
  );
}

// Clinic Appointment Component
function ClinicAppointment() {
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      const res = await axios.get('http://localhost:8080/api/appointments/availability');
      setAvailability(res.data);
    };
    fetchAvailability();
  }, [selectedDay]);

  const getDayKey = () => {
    const today = new Date();
    const date = new Date(today);
    if (selectedDay === "tomorrow") date.setDate(today.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const formatTime = (timeDecimal) => {
    const hours = Math.floor(timeDecimal);
    const minutes = Math.round((timeDecimal - hours) * 60);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const generateTimeSlots = (startHour, endHour, period) => {
    const slots = [];
    const today = new Date();
    const target = new Date(today);
    if (selectedDay === 'tomorrow') target.setDate(today.getDate() + 1);
    const dateKey = target.toISOString().split('T')[0];

    for (let hour = startHour; hour < endHour; hour += 1) {
      const slotDecimal = hour;
      const timeRange = `${formatTime(slotDecimal)} - ${formatTime(slotDecimal + 0.75)}`;
      const slotId = `${period}-${slotDecimal}`;
      const seatStatus = availability[dateKey]?.[slotId] || [true, true];

      slots.push({
        id: slotId,
        time: timeRange,
        seats: [
          { id: 1, available: seatStatus[0] },
          { id: 2, available: seatStatus[1] }
        ]
      });
    }

    return slots;
  };



  const morningSlots = generateTimeSlots(9, 12, "morning");
  const eveningSlots = generateTimeSlots(17, 20, "evening");

  const handleSelectSlot = (slotId, seatId) => {
    setSelectedSlot({ slotId, seatId });
  };

  const getDayText = () => (selectedDay === "today" ? "Today" : "Tomorrow");

  const confirmBooking = async () => {
    if (!selectedSlot) return;
    const name = prompt("Please enter your name");

    const today = new Date();
    const dateObj = new Date(today);
    if (selectedDay === "tomorrow") dateObj.setDate(today.getDate() + 1);
    const formattedDate = selectedDay;

    try {
      const res = await axios.post('http://localhost:8080/api/appointments', {
        date: formattedDate,
        slot: selectedSlot.slotId,
        seat: selectedSlot.seatId,
        name
      });
      setMessage("✅ Appointment booked successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Booking failed.");
    }
  };



  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1 className="appointment-title">Appointment</h1>
        <div className="welcome-header">
          <h2 className="welcome-text">Welcome!</h2>
          <div className="rate-info">
            <p>Rate (Mon-Fri)</p>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="day-selector">
        <button
          className={`day-button ${selectedDay === "today" ? "selected" : ""}`}
          onClick={() => setSelectedDay("today")}
        >
          Today
        </button>
        <button
          className={`day-button ${selectedDay === "tomorrow" ? "selected" : ""}`}
          onClick={() => setSelectedDay("tomorrow")}
        >
          Tomorrow
        </button>
      </div>

      {/* Morning Slots */}
      {[
        { label: "Morning", slots: morningSlots },
        { label: "Evening", slots: eveningSlots }
      ].map(({ label, slots }) => (
        <div className="slot-section" key={label}>
          <h3 className="slot-heading">{label} Slots ({getDayText()})</h3>
          <div className="slots-grid">
            {slots.map((slot) => (
              <div key={slot.id} className="time-slot">
                <div className="slot-time">{slot.time}</div>
                <div className="seat-container">
                  {slot.seats.map((seat) => (
                    <button
                      key={`${slot.id}-${seat.id}`}
                      className={`seat-button ${seat.available ? "available" : "unavailable"}`}
                      disabled={!seat.available}
                      onClick={() => handleSelectSlot(slot.id, seat.id)}
                    >
                      Seat {seat.id}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Confirmation */}
      {selectedSlot && (
        <div className="selected-slot">
          <h3>Selected Appointment</h3>
          <p>Slot: {selectedSlot.slotId}, Seat: {selectedSlot.seatId}</p>
          <button className="confirm-button" onClick={confirmBooking}>
            Confirm Booking
          </button>
          {message && <p className="booking-message">{message}</p>}
        </div>
      )}

      <div className="payment-info">
        <h3>Payment Information</h3>
        <p>Payment will be handled in-person.</p>
      </div>
    </div>
  );
}

// Not Found Page
function NotFound() {
  return (
    <div className="not-found">
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="return-link">
        Return to Home
      </Link>
    </div>
  );
}


const BMICalculator = () => {
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightInch, setHeightInch] = useState("");
  const [result, setResult] = useState("");

  // Validation helpers
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  // ✨ New: Block invalid characters while typing
  const handleNameKeyPress = (e) => {
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleMobileKeyPress = (e) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !mobile || !age || !weight || !heightFt || !heightInch) {
      setResult("Please fill all the fields.");
      return;
    }

    if (!validateName(name)) {
      setResult("Name should contain only alphabets (no numbers or special characters).");
      return;
    }

    if (!validateMobile(mobile)) {
      setResult("Mobile number must be exactly 10 digits (no letters or special characters).");
      return;
    }

    const totalHeightInInches = parseInt(heightFt) * 12 + parseInt(heightInch);

    let idealWeight;
    if (gender === "male") {
      idealWeight = 50 + 2.3 * (totalHeightInInches - 60);
    } else {
      idealWeight = 45.5 + 2.3 * (totalHeightInInches - 60);
    }

    const weightNum = parseFloat(weight);
    let healthStatus;

    if (weightNum < idealWeight - 5) {
      healthStatus = "You are underweight.";
    } else if (weightNum > idealWeight + 5) {
      healthStatus = "You are overweight.";
    } else {
      healthStatus = "You are healthy.";
    }

    setResult(`Ideal Weight: ${idealWeight.toFixed(2)} Kg. ${healthStatus}`);
  };

  return (
    <div className="bmi-container">
    <div className="ibw-container">
      <h2>Calculate Your Ideal Body Weight</h2>

      <div className="gender-selection">
        <div
          className={`gender-option ${gender === "male" ? "active" : ""}`}
          onClick={() => setGender("male")}
        >
          <img
            src="https://previews.123rf.com/images/jemastock/jemastock1812/jemastock181207905/126986371-fit-man-doing-exercise-cartoon-vector-illustration-graphic-design.jpg"
            alt="Male"
          />
          <p>Male</p>
        </div>
        <div
          className={`gender-option ${gender === "female" ? "active" : ""}`}
          onClick={() => setGender("female")}
        >
          <img
            src="https://cbx-prod.b-cdn.net/COLOURBOX36504161.jpg?width=800&height=800&quality=70"
            alt="Female"
          />
          <p>Female</p>
        </div>
      </div>

      <form className="ibw-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleNameKeyPress}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          required
          onChange={(e) => setMobile(e.target.value)}
          onKeyPress={handleMobileKeyPress}
        />

        <div className="row">
          <input
            type="number"
            placeholder="Age"
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
          />
          <div className="weight-input">
            <input
              type="number"
              placeholder="Weight"
              value={weight}
              required
              onChange={(e) => setWeight(e.target.value)}
            />
            <span className="unit-button">Kg</span>
          </div>
        </div>

        <div className="row">
          <div className="height-input">
            <input
              type="number"
              placeholder="Ht-Ft"
              value={heightFt}
              required
              onChange={(e) => setHeightFt(e.target.value)}
            />
            <span className="unit-button active">Ft</span>
          </div>
          <div className="height-input">
            <input
              type="number"
              placeholder="Ht-Inch"
              value={heightInch}
              required
              onChange={(e) => setHeightInch(e.target.value)}
            />
            <span className="unit-button active">Inch</span>
          </div>
        </div>

        <button type="submit" className="calculate-button">
          Calculate
        </button>
      </form>

      {result && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>{result}</p>
      )}
      </div>
      </div>
  );
};









function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}



const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Clinic Ease</h1>
        <p>Your trusted healthcare partner</p>
      </header>

      <main className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Clinic Ease has been providing exceptional healthcare
            services to our community. We started with a single clinic and have
            grown to become a network of healthcare professionals dedicated to
            your wellbeing.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To provide accessible, affordable, and high-quality healthcare
            services to all our patients. We believe in treating the whole person,
            not just the symptoms.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team consists of board-certified physicians, experienced nurses,
            and compassionate support staff who work together to ensure you receive
            the best possible care.
          </p>
        </section>

        <div className="back-home">
          <Link to="/" className="home-link">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};