import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';


import Header from '../Header';
import Footer from '../Footer';

const Payment = () => {



    const [userCart, setUserCart] = useState([]);
    const [cartValue, setCartValue] = useState();

    // const [updatedCart, setUpdatedCart] = useState([])
    const user = JSON.parse(localStorage.getItem('user'));
   

    useEffect(() => {
        fetch(`${API_BASE_URL}/getcart/${user.email}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.usercart) {
                    setUserCart(data.usercart);
    
                    // Calculate cart value by multiplying quantity and price for each product
                    const cartv = data.usercart.reduce((total, product) => {
                        const productValue = product.cartQuantity * product.productPrice;
                        return total + productValue;
                    }, 0);
    
                    // Set the calculated cart value in state
                    setCartValue(cartv);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user.email]);



    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [upi, setUpi] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState(''); // Initialize cardholder's name state

    const handleOrder = (e) => {
        e.preventDefault();

        if (paymentMethod === 'upi') {
            console.log('UPI:', upi);

            // Send the 'upi' value to the backend
            fetch(`${API_BASE_URL}/orderFinal/${userCart}/${user.email}/`, {
                method: 'POST',
                body: JSON.stringify({ upi }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {

                    toast(data.message);
                    // Navigate to '/'
                    navigate('/');


                })

                .catch((error) => {
                    console.error(error);
                });
        } else if (paymentMethod === 'cards') {
            console.log('Card Number:', cardNumber);
            console.log('Expiry Date:', expiryDate);
            console.log('CVV:', cvv);
            console.log('Cardholder Name:', cardHolderName);

            // Send the card information and 'upi' value to the backend
            fetch(`${API_BASE_URL}/orderFinal/${userCart}/${user.email}/`, {
                method: 'POST',
                body: JSON.stringify({ cardNumber, expiryDate, cvv, cardHolderName }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        toast("order placed");
                    } else {
                        toast("order failed");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };



    const renderPaymentFields = () => {
        if (paymentMethod === 'upi') {
            return (
                <div className="mb-3">
                    <label className="form-label" htmlFor="upi">
                        UPI ID
                    </label>
                    <input
                        className="form-control lgup"
                        type="text"
                        name="upi"
                        value={upi}
                        onChange={(e) => setUpi(e.target.value)}
                        placeholder="Enter your UPI ID"
                    />
                </div>
            );
        } else if (paymentMethod === 'cards') {
            return (
                <div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="cardNumber">
                            Card Number
                        </label>
                        <input
                            className="form-control lgup"
                            type="text"
                            name="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Enter your card number"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="expiryDate">
                            Expiry Date
                        </label>
                        <input
                            className="form-control lgup"
                            type="text"
                            name="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YYYY"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="cvv">
                            CVV
                        </label>
                        <input
                            className="form-control lgup"
                            type="text"
                            name="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="Enter your CVV"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="cardHolderName">
                            Cardholder's Name
                        </label>
                        <input
                            className="form-control lgup"
                            type="text"
                            name="cardHolderName"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            placeholder="Enter cardholder's name"
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className="container-fluid login-container">
                <div className='col'></div>
                <div className="row lgc">
                    <div className="col">
                        <div className="card d-block">
                            <div className="card-body">
                                <h2 className="card-title text-center login-heading">Payment of RS{cartValue}</h2>
                                <hr className="hr" />
                                <form onSubmit={handleOrder}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="paymentMethod">
                                            Select method
                                        </label>
                                        <select
                                            className="form-select lgup"
                                            name="paymentMethod"
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            value={paymentMethod}
                                        >
                                            <option value="">Select Payment Method</option>
                                            <option value="upi">UPI</option>
                                            <option value="cards">Cards</option>
                                        </select>
                                    </div>
                                    {renderPaymentFields()}
                                    <button
                                        className="btn btn-outline-success header-login-btn l-b navbar-text"
                                        type="submit"
                                    >
                                        Order
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col'></div>
            </div>
        </>
    );
};

export default Payment;
