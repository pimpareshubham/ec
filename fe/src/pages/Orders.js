import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Orders = () => {
  const [userCart, setUserCart] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    fetch(`${API_BASE_URL}/getorders/${user.email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.userorders) {
          setUserCart(data.userorders);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.email]);

  // Function to handle adding a review
  const handleAddReview = (productId) => {
    const reviewContent = document.getElementById(`reviewTextarea-${productId}`).value;

    // Make an API call to '/addreview'
    fetch(`${API_BASE_URL}/addreview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        review: reviewContent,
        useremail: user.email
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server if needed
        console.log('Review added successfully:', data);
        // You can show a success message using toast
        toast.success('Review added successfully!');
      })
      .catch(error => {
        // Handle errors
        console.error('Error adding review:', error);
        // You can show an error message using toast
        toast.error('Error adding review. Please try again.');
      });
  };

  return (
    <>
      <div className="container my-3">
        <div className="">
          <div className="">
            <div className="card-body scrollable-content">
              <div className="card-header text-center">
                <h2>Order History</h2>
              </div>
              {userCart.length === 0 ? (
                <p>Buy what you love and complete your first order</p>
              ) : (
                userCart.slice().reverse().map((order, orderIndex) => (
                  <div className="pb-2" key={orderIndex}>
                    <div className="card">
                      {order.products.map((product, productIndex) => (



                        <div className="row mt-4" key={productIndex}>


                          <div className='col-md-6 pb-1 pt-1 d-flex align-items-center justify-content-center'>

                            <Link className="" to={`/fproductdetails/${product._id}`}>

                              <img
                                className="pi3 card-img-top"
                                style={{ maxWidth: '300px', height: '200px' }}
                                src={`${product.productImage}`}
                                alt={`Product ${productIndex + 1}`}
                              />
                            </Link>
                            {/* <img
                              src={`${API_BASE_URL}` + product.productImage}
                              alt={`Product ${productIndex + 1}`}
                              style={{ maxWidth: '300px', height: '200px' }}
                            /> */}




                          </div>
                          <div className='col-md-6 d-flex align-items-center justify-content-center'>
                            <div>
                              <h5>{product.productName}</h5>
                              <p>{product.productPrice} RS</p>
                              <p>Quantity: {product.cartQuantity}</p>
                              <p>Date: {order.date}</p>

                              <div className="form-floating my-1">
                                <textarea
                                  className="form-control"
                                  placeholder="Leave a comment here"
                                  id={`reviewTextarea-${product._id}`}
                                ></textarea>
                                <label htmlFor={`reviewTextarea-${product._id}`}>Write review</label>

                                <button
                                  onClick={() => handleAddReview(product._id)}
                                  className='btn btn-primary  my-1'
                                >
                                  Add Review
                                </button>

                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Orders;
