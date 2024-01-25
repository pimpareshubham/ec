import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import { Link, useParams } from 'react-router-dom';

const SearchResult = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  

  // Initialize useState with an empty array instead of an object
  const [products, setProducts] = useState([]);

  const { searchFor } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchFor) {
          const response = await axios.get(`${API_BASE_URL}/search/${searchFor}`);
          const data = response.data;
          if (data.result) {
            setProducts(data.result);
          } else {
            toast.error('Product not found');
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Product Not Found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchFor]);

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

  const removeProduct = (productName) => {
    fetch(`${API_BASE_URL}/removeproduct/${productName}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedProducts = products.filter(
            (product) => product.productName !== productName
          );
          setProducts(updatedProducts);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="container-fluid text-center pt-4">
        <h1>Search Result</h1>
      </div>
      <div className="row ap text-center">
        {products.map((product, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card d-block" style={{ width: '18rem' }}>
              {user && user.firstName === '1' && (
                <button
                  className="btn btn-danger remove-btn"
                  onClick={() => removeProduct(product.productName)}
                >
                  x
                </button>
              )}

              <Link className="" to={`/productdetails/${product._id}`}>
                <img
                  className="pi3 card-img-top"
                  style={{ height: '20rem', objectFit: 'cover' }}
                  src={`${product.productImage}`}
                  alt="Product"
                />
              </Link>

              <div className="card-body">
                <h5 className="card-title">{product.productName}</h5>
                <p className="card-text">{product.productDescription}</p>
                <p className="card-text">Price: ${product.productPrice}</p>
              </div>
              <button
                className="btn btn-outline-success add-to-cart navbar-text apcb"
                type="button"
                onClick={() => addToCart(product)}
              >
                <i className="addto-cart-icon fa-solid fa-cart-shopping"></i> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResult;
