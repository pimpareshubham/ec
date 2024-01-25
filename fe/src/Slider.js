import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userToken = localStorage.getItem('token')
  


  useEffect(() => {
    fetch(`${API_BASE_URL}/getfeatured`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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
    // Send a request to the backend to remove the product by its name
    fetch(`${API_BASE_URL}/removefproduct/${productName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If the product was successfully removed, update the state
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.productName !== productName)
          );
        } else {
          // Handle errors if needed
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderProductSlides = () => {
    return products.map((product) => (


      <div key={product._id} className="item fc">
        {user && user.username === 'admin' && (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => removeProduct(product.productName)}
          >
            X
          </button>
        )}
        <div className="card d-block" style={{ width: '18rem' }}>
          <Link className="" to={`/fproductdetails/${product._id}`}>

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
            <p className="card-text">{product.productPrice}</p>
          </div>
          <button
            className="btn btn-outline-success add-to-cart navbar-text apcb"
            type="button"
            onClick={() => addToCart(product)}
          >
            <i className="fas fa-cart-shopping"></i> Add to cart
          </button>

        </div>
      </div>
    ));
  };

  return (
    <div className="od">
      <div className="fpheading">
        <h1>Featured Products</h1>
      </div>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={2000}
        infinite={true}
      >
        {renderProductSlides()}
      </Carousel>
    </div>
  );
};

export default ProductSlider;
