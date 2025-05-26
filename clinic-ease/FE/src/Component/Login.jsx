import React, { useState } from "react";
import "../style/Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", phone: "", email: "", password: "" });
    setErrors({});
  };

  const validate = (name, value) => {
    let error = "";
    
    if (name === "name" && !/^[a-zA-Z\s]+$/.test(value)) {
      error = "Name must contain only alphabets.";
    }
    
    if (name === "phone" && (value.length !== 10 || !/^\d+$/.test(value))) {
      error = "Phone number must be exactly 10 digits.";
    }

    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Enter a valid email address.";
    }

    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters.";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) return; // Restrict to numbers only
    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) return; // Restrict to alphabets only

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    
    Object.keys(formData).forEach((key) => {
      if ((isSignup && key !== "password") || key === "password" || key === "name") {
        newErrors[key] = validate(key, formData[key]);
      }
    });

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }

    alert(`${isSignup ? "Signup" : "Login"} successful!`);
    console.log(isSignup ? "Signing up..." : "Logging in...", formData);
  };

  return (
    <div className={`login-container ${isSignup ? "signup-active" : "login-active"}`}>
      <div className="toggle-buttons">
        <button className={isSignup ? "active" : ""} onClick={toggleForm}>Signup</button>
        <button className={!isSignup ? "active" : ""} onClick={toggleForm}>Login</button>
      </div>

      <div className={`form-wrapper ${isSignup ? "turn-left" : "turn-right"}`}>
        <h2>{isSignup ? "Signup" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <FormField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />

          {isSignup && (
            <>
              <FormField label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required maxLength="10" />
              <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required />
            </>
          )}

          <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required />

          <button type="submit">{isSignup ? "Submit" : "Submit"}</button>
        </form>
      </div>
    </div>
  );
};

const FormField = ({ label, type, name, value, onChange, error, required, maxLength }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} maxLength={maxLength} />
    {error && <p className="error-message">{error}</p>}
  </div>
);

export default Login;
