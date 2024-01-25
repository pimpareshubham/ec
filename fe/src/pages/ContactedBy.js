import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ContactedBy = () => {
  const [details, setUserDetails] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    fetch(`${API_BASE_URL}/contactus`)
      .then((response) => response.json())
      .then((data) => {
        if (data.contactedBy) {
          setUserDetails(data.contactedBy);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.email]);

  

  return (
    <>
    <div> </div>
      <div className="container card contactedby ">
        <div className="row justify-content-center">
          <div className="col">
            <div className="">
              <div className="card-body scrollable-content">
                <div className=" text-center">
                  <h2>Contacted By</h2>
                </div>
                {details.length === 0 ? (
                  <p>Not contacted by anyone yet</p>
                ) : (
                  details.slice().reverse().map((details, detailsIndex) => (
                    <div className="p-2" key={detailsIndex}>
                      <div className="card p-3">
                        <p className='fw-bold'>Name : {details.name}</p>
                        <p>Email : {details.email}</p>
                        <p>Message :{details.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div> </div>
      <ToastContainer />
    </>
  );

                  }
  

export default ContactedBy;
