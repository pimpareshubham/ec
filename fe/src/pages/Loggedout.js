import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';


const Loggedout = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const dispatch = useDispatch()
  const user = useSelector(state=> state.user)



  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();
      toast(data.message)


   

      if (response.status == 200) {
        localStorage.setItem("token", data.result.token)
        localStorage.setItem("user", JSON.stringify(data.result.user))
        dispatch({type:'LOGIN_SUCCESS',payload:data.result.data})
        
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <>
  
      <div className="container-fluid login-container">
        <div className="row lgc">
          <div className="col-md-auto">
            <div className="card d-block">
              <div className="card-body">
                <h2 className="card-title text-center login-heading">Logged out</h2>
                <hr className="hr" />
                {/* <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control lgup"
                      type="text"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </div>

                  <div className="signuplink">
                    <a href="/signup">Don't have an account? Click here to Signup</a>
                  </div>
                  <div className="signuplink">
                    <a href="/admin">For admin login click here</a>
                  </div>
                  {user ?
                  <button

                    className="btn btn-outline-success header-login-btn l-b navbar-text"
                    type="submit"
                  >
                    Login
                  </button>
                  :''}

                </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </>
  );
};

export default Loggedout;
