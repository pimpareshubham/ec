import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const Featured = () => {
  const navigate = useNavigate();

  const { API_BASE_URL } = require('../config');
  const userToken = localStorage.getItem('token');

  

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState([]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {


      // const reqData = {productName,productPrice,productDescription}
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('productPrice', productPrice);
      formData.append('productDescription', productDescription);
      formData.append('productImage', productImage);

      const response = await fetch(`${API_BASE_URL}/addfeatured`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.status === 201) {
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        toast('Product added successfully!');

      } else {
        // toast('Failed to add product. Please try again.');
        toast(response.status)
      }
    } catch (error) {
      console.error('Error during product addition:', error);
      toast('An error occurred during product addition.');
    }
  };

  return (
    <div className="container">
      <div className="row lgc">
        <div className="col-md-auto">
          <div className="card d-block">
            <div className="card-body">
              <h2 className="card-title text-center login-heading">Add New Featured Product</h2>
              <hr className="hr" />
              <form onSubmit={handleAddProduct} encType="multipart/form-data">
                <div className="mb-3">
                  <label className="form-label" htmlFor="productName">
                    Product Name
                  </label>
                  <input
                    className="form-control lgup"
                    type="text"
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="productPrice">
                    Product price
                  </label>
                  <input
                    className="form-control lgup"
                    type="text"
                    name="productPrice"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Enter product price"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="productDescription">
                    Product Description
                  </label>
                  <input
                    className="form-control lgup"
                    type="text"
                    name="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Enter product description"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="productImage">
                    Product Image
                  </label>
                  <input
                    className="form-control lgup"
                    type="file"
                    name="productImage"
                    onChange={(e) => setProductImage(e.target.files[0])}
                    accept="image/*"
                  />
                </div>

                <button
                  className="btn btn-outline-success header-login-btn l-b navbar-text"
                  type="submit"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
