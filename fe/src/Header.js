import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [womenDropdownVisible, setWomenDropdownVisible] = useState(false);
  const [menDropdownVisible, setMenDropdownVisible] = useState(false);

  const handleSearch = () => {
    const search = document.getElementById('searchfor').value;
    navigate(`/search/${search}`);
  };

  const handleLoggedOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    toast('Logged out');
    dispatch({ type: 'LOGIN_ERROR' });
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleWomenMouseLeave = () => {
    setTimeout(() => {
        setWomenDropdownVisible(false);
    }, 500); // Adjust the delay (in milliseconds) according to your needs
  };

  const handleWomenMouseEnter = () => {
    setWomenDropdownVisible(true);
  };

  const handleMenMouseLeave = () => {
    setTimeout(() => {
      setMenDropdownVisible(false);
    }, 500); // Adjust the delay (in milliseconds) according to your needs
  };

  const handleMenMouseEnter = () => {
    setMenDropdownVisible(true);
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand b" href="/">
            <h1>Ecommerce</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"></li>
            </ul>

            <div className="header-search d-flex mx-auto" role="search">
              <input id="searchfor" className="form-control" placeholder="Search" aria-label="Search" />
              <button onClick={handleSearch} className="btn btn-outline-success header-search-btn">
                Search
              </button>
            </div>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"></li>
            </ul>

            <div className="l-c d-flex flex-md-column flex-lg-row flex-column">
              {localStorage.getItem('token') ? '' : <button onClick={handleLogin} className="btn btn-outline-success header-login-btn">Login</button>}
              {localStorage.getItem('token') ? (
                <button onClick={handleLoggedOut} className="btn btn-outline-success header-login-btn">
                  Logout
                </button>
              ) : (
                ''
              )}
              <Link to="/cart" className="btn btn-outline-success header-cart-btn">
                <i className="fa-solid fa-cart-shopping"></i>Cart
              </Link>
              <Link to="/orders" className="btn btn-outline-success header-cart-btn">
                Orders
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid header bn ">
        <ul className="nav">
          <li className="nav-item nav-2">
            <Link to="/" className="nav-link" aria-current="page">
              Home
            </Link>
          </li>
          {!user ? '' : user.username === 'admin' ? (
            <>
              <li className="nav-item nav-2">
                <Link to="/addproducts" className="nav-link" aria-current="page">
                  Add Products
                </Link>
              </li>
              <li className="nav-item nav-2">
                <Link to="/addfeatured" className="nav-link" aria-current="page">
                  Add Featured
                </Link>
              </li>
            </>
          ) : null}

          <li className="nav-item nav-2">
            <Link to="/allproducts" className="nav-link">
              All Products
            </Link>
          </li>
          <li className="nav-item nav-2 dropdown" onMouseEnter={handleWomenMouseEnter} onMouseLeave={handleWomenMouseLeave}>
            <a href="#" className="women-btn nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Women
            </a>
            <ul className={`dropdown-menu ${womenDropdownVisible ? 'show' : ''}`} onMouseEnter={() => setWomenDropdownVisible(true)} onMouseLeave={() => setWomenDropdownVisible(false)}>
              <li>
                <Link to="/allproductswomen" className="dropdown-item">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/womendresses" className="dropdown-item">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/womenpants" className="dropdown-item">
                  Pants
                </Link>
              </li>
              <li>
                <Link to="/womenskirts" className="dropdown-item">
                  Skirts
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item nav-2 dropdown" onMouseEnter={handleMenMouseEnter} onMouseLeave={handleMenMouseLeave}>
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Men
            </a>
            <ul className={`dropdown-menu ${menDropdownVisible ? 'show' : ''}`} onMouseEnter={() => setMenDropdownVisible(true)} onMouseLeave={() => setMenDropdownVisible(false)}>
              <li>
                <Link to="/allproductsmen" className="dropdown-item">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/menshirts" className="dropdown-item">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/menpants" className="dropdown-item">
                  Pants
                </Link>
              </li>
              <li>
                <Link to="/menhoodies" className="dropdown-item">
                  Hoodies
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item nav-2">
            <Link to="/allproductskids" className="nav-link">
              Kids
            </Link>
          </li>
          <li className="nav-item nav-2 hc">
            <Link className="nav-link header-contact" to="/contactus">
              Contact
            </Link>
          </li>
          {!user ? '' : user.username === 'admin' ? (
            <>
              <li className="nav-item nav-2">
                <Link to="/contactedby" className="nav-link" aria-current="page">
                  Contacted By
                </Link>
              </li>
             
            </>
          ) : null}
        </ul>
      </div>
    </>
  );
};

export default Header;
