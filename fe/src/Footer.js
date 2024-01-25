import React from 'react';

const Footer = () => {
    return (
        <>

            <div className="footer-div  bg-dark">
                <div className="row text-center">
                    <div className="col-md-3">
                        <a href="../women/allproducts-women.html"><h6>Women</h6></a>

                        <div><a href="../women/women-dresses.html">Dresses</a></div>
                        <div><a href="../women/women-pants.html">Pants</a></div>
                        <div><a href="../women/women-skirts.html">Skirts</a></div>
                    </div>
                    <div className="col-md-3">
                        <a href="../men/allproducts-men.html"><h6>Men</h6></a>

                        <div><a href="../men/men-shirts.html">Shirts</a></div>
                        <div><a href="../men/men-pants.html">Pants</a></div>
                        <div><a href="../men/men-hoodies.html">Hoodies</a></div>
                    </div>
                    <div className="col-md-3">
                        <a href="../kids.html"><h6>Kids</h6></a>

                    </div>
                    <div className="col-md-3">
                        <h6>Links</h6>

                        <div><a href="../index.html">Home</a></div>
                        <div><a href="../login.html">Login</a></div>
                        <div><a href="../contactus.html">Contact</a></div>
                    </div>
                </div>

                <hr className="hr" />
                <div className="text-center">Copyright @Ecommerce 2023-24</div>
            </div>

        </>
    )
}

export default Footer;