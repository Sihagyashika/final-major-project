import React, { useState } from "react";
import "../style/BMICalculator.css";

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
  );
};

export default BMICalculator;
