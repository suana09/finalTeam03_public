import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/member/Register.css';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

import GoogleIcon from '../../images/google.png';
import KakaoIcon from '../../images/kakao.png';
import NaverIcon from '../../images/naver.png';
// member
function Register() {
    const [email, setEmail] = useState('');
    const [emailcode, setEmailCode] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdCheck, setPwdCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [nicknameValidation, setNicknameValidation] = useState('');

    const [pwdCheckResult, setPwdCheckResult] = useState(null);
    const [emailCheckResult, setEmailCheckResult] = useState(null);
    const [emailVerificationResult, setEmailVerificationResult] = useState(null);
    const [isEmailSending, setIsEmailSending] = useState(0);
    const [emailVerificationTimeOut, setEmailVerificationTimeOut] = useState(180);

    const navigate = useNavigate();

    const debounceTimeoutRef = useRef(null);

    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    const handleEmailChange = (e) => {
        const newEmail = e.currentTarget.value;
        setEmail(newEmail);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (newEmail.length >= 7) {
                axios.post("/api/member/validation/email", { email: newEmail })
                    .then((res) => {
                        if (res.data.isAlreadyIn === true) {
                            if (res.data.isDeleted === true && res.data.isDeletedAndReactivatable === true){
                                if (window.confirm("해당 계정은 탈퇴된 계정입니다. 복구를 위해 이메일 인증을 진행하시겠습니까?")) {
                                    navigate('/reactivate');
                                }
                            } else if (res.data.isDeleted === true && res.data.isDeletedAndReactivatable === false){
                                setEmailCheckResult(true);
                            } else {
                                setEmailCheckResult(false);
                            }
                        } else {
                            setEmailCheckResult(true);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }, 500);
    };

    const handleNicknameChange = (e) => {
        const newNickname = e.currentTarget.value;
        setNickname(newNickname);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (newNickname.length > 10) {
                setNicknameValidation(false);
            } else {
                setNicknameValidation(true);
            }
        }, 500);
    };

    const emailVerification = () => {
        if (!emailCheckResult) {
            alert("이미 가입된 이메일입니다.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {
            setIsEmailSending(1);
            axios.post('/api/mail/emailsend', null, { params: { email } })
                .then((res) => {
                    if (res.data.msg === 'success') {
                        setIsEmailSending(2);
                        alert('이메일이 전송되었습니다.');
                        setEmailVerificationTimeOut(180);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            alert("유효하지 않은 형식의 이메일입니다.");
        }
    }

    const codecheck = () => {
        if (emailcode === '') {
            return;
        }

        axios.post("/api/mail/codecheck", null, { params: { emailcode } })
            .then((res) => {
                if (res.data.msg === 'OK') {
                    setEmailVerificationResult(true);
                } else {
                    setEmailVerificationResult(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }


    useEffect(() => {
        codecheck();
    }, [emailcode]);

    useEffect(() => {
        if (pwd === '' || pwdCheck === '') {
            return;
        }

        const checkPasswords = async () => {
            if (pwd === pwdCheck) {
                setPwdCheckResult(true);
            } else {
                setPwdCheckResult(false);
            }
        }
        checkPasswords();
    }, [pwd, pwdCheck]);

    const register = () => {
        if (email === '') {
            alert("메일주소를 입력해주세요.");
        } else if (pwd === '') {
            alert('비밀번호를 입력해주세요.');
        } else if (pwdCheck !== pwd) {
            alert('비밀번호 확인이 일치하지 않습니다.');
        } else if (nickname === '') {
            alert('닉네임을 입력해주세요.');
        } else if (nicknameValidation === false) {
            alert('닉네임은 10자까지 가능합니다.');
        } else if (!emailCheckResult) {
            alert("이미 가입된 메일주소입니다. 다른 메일주소를 입력해주세요.");
        } else if (!emailVerificationResult || emailVerificationTimeOut === 0) {
            alert("이메일 인증을 완료해주세요.");
        } else {
            axios.post('/api/member/register', { email, pwd, nickname })
                .then((res) => {
                    alert("회원 가입이 완료되었습니다! 🍕")
                    navigate('/');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }



    const getInputBorder = (checkVar, checkResult) => {
        if (checkVar === '') return '1px solid #c0c0c0';
        return (checkResult) ? ('2px solid #5bc75b') : ('2px solid #ed3d3d');
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

    useEffect(() => {
        let timer;
        if (emailVerificationTimeOut > 0) {
            timer = setInterval(() => {
                setEmailVerificationTimeOut((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            setEmailVerificationResult(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [emailVerificationTimeOut]);



    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <>
            <Header />
            <div className='register-container'>
                <h1>JOIN US</h1>
                <div className="register-fields1" style={{
                    borderBottom: getInputBorder(email, emailCheckResult),
                }} >
                    <div className='register-labels'>
                        이메일 입력
                    </div>
                    <div className='register-input'>
                        <input className='reg-input' type="text" value={email} onChange={handleEmailChange} />
                        <button className='verify' onClick={emailVerification}> 인증</button>
                    </div>
                    {
                        (isEmailSending === 1) && (<div className='register-emailsend-msg'>상태 : 전송중</div>)
                    }
                    {
                        ((isEmailSending === 2) && (<div className='register-emailsend-msg' style={{ color: "#5bc75b" }}>상태 : 전송완료</div>))
                    }

                </div>

                <div className='register-fields' style={{
                    borderBottom: getInputBorder(emailcode, emailVerificationResult),
                }}>
                    <div className='register-labels'>
                        인증코드 입력
                    </div>
                    <div className='register-input'>
                        <input className='reg-input' type="text" value={emailcode} onChange={(e) => {
                            setEmailCode(e.currentTarget.value);
                        }} />
                    </div>
                    {isEmailSending === 2 && emailVerificationTimeOut > 0 && (
                        <div className='register-emailsend-msg'>
                            인증 시간 : {formatTime(emailVerificationTimeOut)}
                        </div>
                    )}
                    {isEmailSending === 2 && emailVerificationTimeOut === 0 && (
                        <div className='register-emailsend-msg' style={{ color: "#ed3d3d" }}>
                            인증 시간이 만료되었습니다. 다시 시도해주세요.
                        </div>
                    )}
                </div>

                <div className='register-fields'>
                    <div className='register-labels'>
                        비밀번호 입력
                    </div>
                    <div className='register-input'>
                        <input className='reg-input' type="password" value={pwd} onChange={(e) => {
                            setPwd(e.currentTarget.value);
                        }} />
                    </div>
                </div>

                <div className='register-fields' style={{
                    borderBottom: getInputBorder(pwdCheck, pwdCheckResult),
                }} >
                    <div className='register-labels'>
                        비밀번호 재입력
                    </div>
                    <div className='register-input'>
                        <input className='reg-input' type="password" value={pwdCheck} onChange={(e) => {
                            setPwdCheck(e.currentTarget.value);
                        }} />
                    </div>
                </div>


                <div className='register-fields'>
                    <div className='register-labels'>
                        닉네임 입력
                    </div>
                    <div className='register-input'>
                        <input className='reg-input' type="text" value={nickname} onChange={handleNicknameChange} />
                    </div>
                    <div className='register-emailsend-msg'>
                        닉네임은 최대 10글자까지 입력 가능합니다.
                    </div>
                </div>

                <p>잠깐! SNS 연동 계정으로도 회원 가입이 가능해요 🔗</p>
                <div className="sns-register">
                    <img src={GoogleIcon} style={{ width: "50px", height: "50px" }} onClick={google} alt='' />
                    <img className='kakao' src={KakaoIcon} style={{ width: "50px", height: "50px" }} onClick={kakao} alt='' />
                    <img src={NaverIcon} style={{ width: "52px", height: "52px" }} onClick={naver} alt='' />
                </div>
                <button className='register' onClick={register}>가입하기</button>
            </div>
            <Footer />
        </>
    )
}

export default Register;
