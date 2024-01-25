import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HashLoader from 'react-spinners/HashLoader';

const FProductDetails = () => {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  


  // Initialize useState with a default empty object matching the expected structure
  const [product, setProduct] = useState({});

  // Extract the 'id' parameter from the URL using useParams
  const { id } = useParams();



  useEffect(() => {
    // Fetch data only if 'id' is available
    if (id) {
      axios.get(`${API_BASE_URL}/fproductdetails/${id}`)
        .then((response) => response.data)
        .then((data) => {
          if (data.productDetails) {
            setProduct(data.productDetails);
          } else {
            toast.error("Product not found");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred while fetching product details");
        })
      
    }
  }, [id]);

  const addToCart = async (product) => {


    try {
      const response = await fetch(`${API_BASE_URL}/addtocart/${user.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      });

      if (response.ok) {
        toast('Product added to cart');
      } else {
        const data = await response.json();
        toast(data.error || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Please login first');
    }

  };

  return (
    <>
    
        <div className='min-vh-50 container py-5'>
          <div className='row'>
            <div className='image-container col-md-6'>
              <img src={`${product.productImage}`} alt='Product Image' />
            </div>
            <div className='scrollable-content my-4  col-md-6'>
              <div className='d-flex flex-column'>
                <p className='fw-bold'>Product name: {product.productName}</p>
                <p className='fw-bold'>Product price: {product.productPrice}</p>
                <p className='fw-bold'>Product Description: {product.productDescription}</p>
              </div>

              <div className='row col-4'>
                <button
                  className="btn btn-outline-success add-to-cart navbar-text apcb"
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  <i className="fas fa-cart-shopping"></i> Add to cart
                </button>
              </div>



              <div className='row py-4'>
                <div className='col py-2'>
                  <h2>All Reviews</h2>


                  <ul>
                    {Object.keys(product).length === 0 ? (
                      <li>No reviews available</li>
                    ) : (
                      Array.isArray(product.productReviews) && product.productReviews.length > 0 ? (
                        product.productReviews.slice().reverse().map((review, index) => (
                          <div className='border my-1' key={index}>
                            <h6 className='px-2'>{review.useremail}</h6>
                            <p className='px-2' key={index}>{review.review}</p>
                          </div>
                        ))
                      ) : (
                        <li>No reviews available</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
    
    </>
  );
};

export default FProductDetails;
