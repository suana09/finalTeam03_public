import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../store/userSlice';
import '../../style/admin/adminlogin.css';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

import GoogleIcon from '../../images/google.png';
import KakaoIcon from '../../images/kakao.png';
import NaverIcon from '../../images/naver.png';

function Login() {

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = () => {
        axios.post('/api/auth/admin/login', { email: email, pwd: pwd })
            .then((res) => {
                sessionStorage.setItem('accessToken', res.data.accessToken);
                dispatch(loginAction({ email: res.data.user.email, nickname: res.data.user.nickname, provider: res.data.user.provider }));
                navigate('/adminMemberlist');
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const kakao = () => {
        window.location.href = 'https://matchive.site/api/auth/kakao/loginpage';
    }

    const google = () => {
        window.location.href = 'https://matchive.site/api/auth/google/loginpage';
    }

    const naver = () => {
        window.location.href = 'https://matchive.site/api/auth/naver/loginpage';
    }


    return (
        <div>
            <Header />
            <div className="admin-login-container">
                <h1>ADMIN LOGIN</h1>
                <div className='admin-login-field'>
                    <input className='admin-logininput' type="text" placeholder='이메일 입력' value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                </div>
                <div className='admin-login-field'>
                    <input className='admin-logininput' type="password" placeholder='비밀번호 입력' value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} />
                </div>
                <div className='admin-login-field'>
                    <button className='admin-loginbtns3' onClick={login}>로그인</button>
                </div>
                <p>SNS 연동 로그인</p>
                <div className='admin-login-field'><button className='admin-loginbtns' onClick={google}><img src={GoogleIcon} style={{ width: "30px", height: "30px" }} />&nbsp;&nbsp;&nbsp;Sign In With Google</button></div>
                <div className='admin-login-field'><button className='admin-loginbtns1' onClick={kakao}><img src={KakaoIcon} style={{ width: "30px", height: "30px" }} />&nbsp;&nbsp;&nbsp;Sign In With Kakao</button></div>
                <div className='admin-login-field'><button className='admin-loginbtns2' onClick={naver}><img src={NaverIcon} style={{ width: "30px", height: "30px" }} />&nbsp;&nbsp;&nbsp;Sign In With Naver</button></div>
            </div>
            <Footer />
        </div>
    )
}

export default Login