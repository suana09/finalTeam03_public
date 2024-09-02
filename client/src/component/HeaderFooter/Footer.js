import React from 'react'
import logo from '../../images/logo_footer.png';
import InstagramIcon from '../../images/instagram.png';
import GoogleIcon from '../../images/google.png';
import KakaoIcon from '../../images/kakao.png';

function Footer() {
    return (
        <div className='footer'>
            <div className='footer-content'>
                <div className='footer-logo'>
                    <img className='footer-logo-img' src={logo} alt="Logo"/>
                </div>
                <div className='footer-details'>
                    <div className='company-info'>
                        <h3>COMPANY INFORMATION</h3>
                        주소 : 서울특별시 종로구 인사동길
                    </div>
                    <div className="contact-us">
                        <h3>CONTACT US</h3>
                        <div className="social-icons">
                            <img className="social-icon" src={InstagramIcon} alt="Instagram"/> Instagram
                            <img className="social-icon" src={GoogleIcon} alt="Google"/> Google 
                            <img className="social-icon" src={KakaoIcon} alt="Kakao"/> Kakao Channel
                        </div>
                    </div>
                    <div className="footer-links">
                        <a href="#">이용약관</a> |
                        <a href="#">개인정보처리방침</a> |
                        <a href="#">고객센터</a> |
                        <a href="/adminMemberlist">ADMIN</a>
                    </div>
                </div>
            </div>
            <div className='footer-bottom'>
                <p>copyright © 2019 inc. All Rights Reserved | E-mail : joha@gmail.com | Tel : 010-1004-1004</p>
            </div>
        </div>
    )
}

export default Footer
