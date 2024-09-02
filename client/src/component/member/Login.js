import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../store/userSlice';
import '../../style/member/Login.css';
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

    useEffect(() => {
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    const login = () => {
        axios.post('/api/auth/login', { email: email, pwd: pwd })
            .then((res) => {
                sessionStorage.setItem('accessToken', res.data.accessToken);
                dispatch(loginAction({ email: res.data.user.email, nickname: res.data.user.nickname, provider: res.data.user.provider }));

                navigate('/');
            })
            .catch((err) => {
                const error = err.response.data.error;
                if (error === "ERROR_LOGIN" || error === "ERROR_USER_DELETED") {
                    alert("이메일 또는 비밀번호 오류입니다.");
                } else if (error === "ERROR_INACTIVE") {
                    alert("휴면회원입니다.");
                }
            })
    }

    const kakao = () => {
        window.location.href = 'http://localhost:8090/auth/kakao/loginpage';
    }

    const google = () => {
        window.location.href = 'http://localhost:8090/auth/google/loginpage';
    }

    const naver = () => {
        window.location.href = 'http://localhost:8090/auth/naver/loginpage';
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div>
            <div className='login-upper'>
                <Header />
                <div className="login-container">
                    <h1>LOG IN</h1>
                    <div className="login-fields">
                        <div className="login-label">이메일 입력</div>
                        <input className='logininput' type="text" value={email} onChange={(e) => setEmail(e.currentTarget.value)} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="login-fields">
                        <div className="login-label">비밀번호 입력</div>
                        <input className='logininput' type="password" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} onKeyDown={handleKeyDown} />
                    </div>
                    <button className='loginbtns3' onClick={login}>로그인</button>
                    <div className="idpwd-search-box">
                        <div className='joinus-box'>
                            {/* <p>비밀번호가 기억이 나지 않아요</p> */}
                            <p><a href="/resetpwd">비밀번호 재설정</a></p>
                        </div>
                    </div>


                    <p>SNS 연동 로그인</p>
                    <button className='loginbtns' onClick={google}><img src={GoogleIcon} style={{ width: "30px", height: "30px" }} alt='' />&nbsp;&nbsp;&nbsp;Sign In With Google</button>
                    <button className='loginbtns1' onClick={kakao}><img src={KakaoIcon} style={{ width: "30px", height: "30px" }} alt='' />&nbsp;&nbsp;&nbsp;Sign In With Kakao</button>
                    <button className='loginbtns2' onClick={naver}><img src={NaverIcon} style={{ width: "30px", height: "30px" }} alt='' />&nbsp;&nbsp;&nbsp;Sign In With Naver</button>
                    <div className="joinus">
                        <div className='joinus-box'>
                            <p>아직 회원이 아니신가요?</p>
                            <p><a href="/register">가입하러 가기</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
