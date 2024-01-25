import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const requestData = JSON.stringify({ username, password, email, address, firstName, lastName });
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });

      const data = await response.json()
      .then((data)=>{
          if(data.ok){
            toast(data.message);
            setUsername('');
            setPassword('');
            setEmail('');
            setAddress('');
            setFirstName('');
            setLastName('');
            navigate("/login");
          }
          else {
            toast(data.message);
            navigate("/login");
          }
      })
      .catch((error)=>{
        console.log(error)
      })



      if (data.ok) {
        toast(data.message);
        
        setUsername('');
        setPassword('');
        setEmail('');
        setAddress('');
        setFirstName('');
        setLastName('');
        
        
      } 
      
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle error state or show error message to the user.
    }
  };

  return (
    <>
      
      <div className="container login-container">
        <div className="row lgc">
          <div className='col'></div>
          <div className="col-md-8">
            <div className="card d-block">
              <div className="card-body">
                <h2 className="card-title text-center login-heading">Signup</h2>
                <hr className="hr" />
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your First Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your Last Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="username">
                      Username
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="form-control lgup"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your Address"
                    />
                  </div>
                  <div className="signuplink">
                    <a href="/login">Already have an account? Click here to Login</a>
                  </div>
                  <button
                    className="btn btn-outline-success header-login-btn l-b navbar-text"
                    type="submit"
                  >
                    Signup
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className='col'></div>
        </div>
      </div>
    
    </>
  );
};

export default Signup;
