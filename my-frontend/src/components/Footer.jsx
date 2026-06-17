import React from 'react'
import "./Footer.css";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
function Footer() {
  return (
    <div><footer class="priceoye-footer">
  <div class="footer-top">
   
    <div class="footer-section about">
      <div class="footer-logo">
        <img src="PO-logo.png" alt="Priceoye Logo"/>
      </div>
      <p>Priceoye helps you compare prices, find the best deals, and shop smarter. Your trusted price comparison platform.</p>
    </div>

    
    <div class="footer-section links">
      <h4>Company</h4>
      <ul>
        <li><LinkContainer to="/aboutus">
                          <Nav.Link className="dropdown-item">
                            About Us
                          </Nav.Link>
                        </LinkContainer></li>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">Press & Blog</a></li>
        <li><a href="#">Terms & Condition</a></li>
      </ul>
    </div>

    <div class="footer-section links">
      <h4>Support</h4>
      <ul>
        <li><a href="#">Customer Service</a></li>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Installments Plan</a></li>
        <li><a href="#">E-Warranty Activation</a></li>
        <li><a href="#">Sell on Priceoye</a></li>
        <li><a href="#">Secure Payment Methods</a></li>
      </ul>
    </div>

  
    <div class="footer-section socials">
      <h4>Get Our App</h4>
      <div class="app-links">
        <img src="google-playstore.png" alt="Google Play Store"/>
      </div>
      <h4>Follow Us</h4>
      <div class="social-icons">
        <a href="#"><img src="social-youtube.png" alt="YouTube"/></a>
        <a href="#"><img src="social-fb.png" alt="Facebook"/></a>
        <a href="#"><img src="social-instagram.png" alt="Instagram"/></a>
        <a href="#"><img src="tiktok.png" alt="TikTok"/></a>
        <a href="#"><img src="social-linkedin.png" alt="LinkedIn"/></a>
      </div>
    </div>
  </div>


  <div class="footer-bottom">
    &copy; 2026 Priceoye.pk. All Rights Reserved.
  </div>
</footer>
</div>
  )
}

export default Footer