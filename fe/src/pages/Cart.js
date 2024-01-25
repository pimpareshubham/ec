// Cart.js

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';


const Cart = () => {
    const [userCart, setUserCart] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const useremail = user ? user.email : '';
    const userToken = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${API_BASE_URL}/getcart/${useremail}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.usercart) {
                    setUserCart(data.usercart);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [useremail]);

    const removeProductFromCart = (productName) => {
        fetch(`${API_BASE_URL}/removepcart/${productName}/${useremail}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toast("Removed from cart")
                    setUserCart((prevUserCart) =>
                        prevUserCart.filter((item) => item.productName !== productName)
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleIncrementQuantity = (productName) => {
        fetch(`${API_BASE_URL}/cartplus/${productName}/${useremail}/`, {
            method: 'PUT',
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.usercart){
                    toast("Incremented the product quantity")
                    setUserCart(data.usercart)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDecrementQuantity = (productName) => {
        fetch(`${API_BASE_URL}/cartminus/${productName}/${useremail}/`, {
            method: 'PUT',
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.usercart){
                    toast("Decremented the product quantity")
                    setUserCart(data.usercart)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const totalCost = userCart.reduce(
        (total, item) => total + item.productPrice * item.cartQuantity,
        0
    );

    const shippingCost = totalCost === 0 ? 0 : 0;

    return (
        <>
            <div className="container mt-5 row cmd">
                <div className="col-md-auto scrollable-content">
                    {/* Items in Cart Section */}
                    <div className="cart-section">
                        <div className="card cart-cards">
                            <div className="card-body">
                                <div className="card-header text-center">
                                    <h2>Items in cart</h2>
                                </div>
                                {userCart.length === 0 ? (
                                    <p>Cart is empty, add items to cart</p>
                                ) : (
                                    userCart.map((item, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-md-auto">
                                                <div className="card cartnb cart-cards cart-image d-block" style={{ width: '18rem' }}>
                                                    <img src={item.productImage} alt={`Product ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                                                </div>
                                            </div>
                                            <div className="col-md-auto">
                                                <div className="card cartnb cartp d-block" style={{ width: '18rem' }}>
                                                    <div className="card-body text-center">
                                                        <div className="card-title">
                                                            <h5>{item.productName}</h5>
                                                        </div>
                                                        <div>{item.productPrice}RS</div>
                                                        <div>Quantity : {item.cartQuantity}</div>
                                                        <form className="cpm" onSubmit={(e) => { e.preventDefault(); removeProductFromCart(item.productName); }}>
                                                            <button className="btn btn-warning btn-outline-success">
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-auto">
                                                <div className="card cartnb" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="cart-plus-minus" style={{ display: 'flex' }}>
                                                        <div className="cpm">
                                                            <button className="btn btn-warning btn-outline-success" onClick={() => handleDecrementQuantity(item.productName)}>
                                                                <i className="fa-sharp fa-solid fa-minus"></i>
                                                            </button>
                                                        </div>
                                                        <div className='cart-input'>
                                                            {item.cartQuantity}
                                                        </div>
                                                        <div className="cpm">
                                                            <button className="btn btn-warning btn-outline-success" onClick={() => handleIncrementQuantity(item.productName)}>
                                                                <i className="fa-sharp fa-solid fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                {userCart.length === 0 ? "" : (
                    <div className="col-md-4 text-center">
                        <div className="card cs cart-cards d-block" style={{ width: '20rem' }}>
                            <div className="card-body">
                                <div className="card-header">
                                    <h2>Summary</h2>
                                </div>
                                <table className="table text-center">
                                    <tbody>
                                        <tr className="p-3">
                                            <td style={{ borderBottom: 'none' }}>
                                                <p style={{ textAlign: 'left' }}>Cost</p>
                                            </td>
                                            <td style={{ textAlign: 'right', borderBottom: 'none' }}>{totalCost}RS</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style={{ textAlign: 'left' }}>Shipping</p>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>{shippingCost}RS</td>
                                        </tr>
                                        <tr>
                                            <td style={{ borderBottom: 'none' }}>
                                                <p className="total" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                                    Total
                                                </p>
                                            </td>
                                            <td style={{ fontWeight: 'bold', borderBottom: 'none', textAlign: 'right' }}>{totalCost + shippingCost}RS</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Link to="/payment">
                                    <button
                                        style={{ width: '50%' }}
                                        className="btn btn-outline-success header-login-btn"
                                        type="button"
                                    >
                                        Checkout
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
