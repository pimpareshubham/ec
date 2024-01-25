import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Initialize useState with a default empty object matching the expected structure
  const [product, setProduct] = useState({});

  // Extract the 'id' parameter from the URL using useParams
  const { id } = useParams();

  useEffect(() => {
    // Fetch data only if 'id' is available
    if (id) {
      axios.get(`${API_BASE_URL}/productdetails/${id}`)
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
        });
    }
  }, [id]);

  return (
    <div className='min-vh-50 container py-5'>
      <div className='row'>
        <div className='image-container col-md-6'>
          <img src={`${product.productImage}`} alt='Product Image' />
        </div>
        <div className='scrollable-content  col-md-6'>
          <div className='d-flex flex-column'>
            <p className='fw-bold'>Product name: {product.productName}</p>
            <p className='fw-bold'>Product price: {product.productPrice}</p>
            <p className='fw-bold'>Product Description: {product.productDescription}</p>
          </div>

          <div className='row py-4'>
            <div className='col px-2 py-2'>
              <h2>All Reviews</h2>

              <ul>
                {Object.keys(product).length === 0 ? (
                  <li>No reviews available</li>
                ) : (
                  Array.isArray(product.productReviews) && product.productReviews.length > 0 ? (
                    product.productReviews.map((review, index) => (
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
  );
};

export default ProductDetails;
