import React, { useState } from 'react';
import myImage1 from '../img/cu.jpg';
import { API_BASE_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/contactus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast('Form data successfully submitted');
        // Optionally reset the form fields after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        console.error('Failed to submit form data:', response.statusText);
      }
    } catch (error) {
      toast('Form data not submitted');
      console.error('Error submitting form data:', error.message);
    }
  };

  return (
    <>
      <div className="text-center ch">
        <h1>Contact Us</h1>
      </div>

      <div className="container-fluid login-container">
        <div className="row lgc">
          <div className="col">
            <div className="card">
              <img className="cuimg" src={myImage1} alt="contactus" />
            </div>
          </div>

          <div className="col mb-4">
            <div className="card d-block">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      id="name"
                      placeholder="Enter your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control lgup"
                      type="email"
                      id="email"
                      placeholder="Enter your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      cols="30"
                      rows="4"
                      placeholder="Any Message"
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <button
                    className="btn btn-outline-success header-login-btn l-b navbar-text"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
