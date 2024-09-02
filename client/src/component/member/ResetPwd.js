import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/member/Register.css';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

import '../../style/member/Login.css';

function ResetPwd() {
    const [email, setEmail] = useState('');
    const [emailcode, setEmailCode] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdCheck, setPwdCheck] = useState('');
    const [isReactivating, setIsReactivating] = useState(false);

    const [pwdCheckResult, setPwdCheckResult] = useState(null);
    const [emailCheckResult, setEmailCheckResult] = useState(null);
    const [emailVerificationResult, setEmailVerificationResult] = useState(null);
    const [isEmailSending, setIsEmailSending] = useState(0);
    const [emailVerificationTimeOut, setEmailVerificationTimeOut] = useState(180);

    const navigate = useNavigate();



    const emailVerification = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {

            try {
                const result = await axios.post('/api/member/validation/email', { email });

                if (emailCheck(result.data)) {
                    setIsEmailSending(1);
                    const result = await axios.post('/api/mail/emailsend', null, { params: { email } });
                    if (result.data.msg === 'success') {
                        setIsEmailSending(2);
                        alert("이메일이 전송되었습니다.");
                        setEmailVerificationTimeOut(180);
                    }
                } else {
                    return;
                }
            } catch (error) {
                console.error(error);
            }

        } else {
            alert("유효하지 않은 형식의 이메일입니다.");
        }
    }

    const emailCheck = (result) => {
        if (result.isAlreadyIn === true) {
            if (result.isDeleted === false && result.isInactive === false) {
                return true;
            } else {
                if (result.isDeleted === true) {
                    if (result.isDeletedAndReactivatable === true) {
                        if (window.confirm("해당 계정은 탈퇴된 계정입니다. 복구를 위해 이메일 인증을 진행하시겠습니까?")) {
                            setIsReactivating(true);
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        alert("입력하신 이메일에 해당하는 회원정보가 존재하지 않습니다");
                        return false;
                    }
                } else if (result.isInactive === true) {
                    if (window.confirm("해당 계정은 휴면회원으로 전환된 계정입니다. 복구를 위해 이메일 인증을 진행하시겠습니까?")) {
                        setIsReactivating(true);
                        return true;
                    } else {
                        return false;
                    }
                }

                return false;
            }
        } else {
            alert("입력하신 이메일에 해당하는 회원정보가 존재하지 않습니다");
            return false;
        }
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


    const codecheck = async () => {
        if (emailcode === '') {
            return;
        }

        try {
            const res = await axios.post("/api/mail/codecheck", null, { params: { emailcode } });
            if (res.data.msg === 'OK') {
                if (isReactivating) {
                    const result = await axios.put("/api/member/reactivate", { email });
                    if (result.data === 'success') {
                        alert("복구 처리가 완료되었습니다. 비밀번호를 재설정해주세요.");
                        setIsReactivating(false);
                        setEmailVerificationResult(true);
                    }          
                } else {
                    alert("이메일 인증이 완료되었습니다. 재설정할 비밀번호를 입력해주세요.")
                    setEmailVerificationResult(true);
                }
            } else {
                alert("잘못된 코드입니다. 다시 입력해주세요.");
            }
        } catch (error){
            console.error(error);
        }
    }

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


        const getInputBorder = (checkVar, checkResult) => {
            if (checkVar === '') return '1px solid #c0c0c0';
            return (checkResult) ? ('2px solid #5bc75b') : ('2px solid #ed3d3d');
        }

        const formatTime = (timeInSeconds) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        };

        const resetPassword = () => {
            if (!pwdCheckResult) {
                alert("비밀번호 확인이 일치하지 않습니다.");
                return;
            }

            axios.put('/api/member/pwd', { email, pwd })
                .then((res) => {
                    if (res.data === 'success') {
                        alert("비밀번호가 재설정되었습니다. 서비스를 이용하시려면 로그인 해주세요.");
                        navigate('/login');
                    }
                })
                .catch((err) => {
                    console.error(err);
                })

        }


        return (
            <>
                <Header />
                <div className='register-container'>
                    <div className='register-inner-container'>
                        <h1>비밀번호 재설정</h1>
                        <div className="register-fields1" style={{
                            borderBottom: '1px solid #c0c0c0',
                        }} >
                            <div className='register-labels'>
                                이메일 입력
                            </div>
                            <div className='register-input'>
                                <input className='reg-input' type="text" value={email} onChange={(e) => {
                                    setEmail(e.currentTarget.value)
                                }} />
                                <button className='verify' onClick={emailVerification}> 전송</button>
                            </div>
                            {
                                (isEmailSending === 1) && (<div className='register-emailsend-msg'>상태 : 전송중</div>)
                            }
                            {
                                ((isEmailSending === 2) && (<div className='register-emailsend-msg' style={{ color: "#5bc75b" }}>상태 : 전송완료</div>))
                            }

                        </div>

                        <div className='register-fields' style={{
                            borderBottom: '1px solid #c0c0c0',
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

                        {
                            (!emailVerificationResult) && (
                                <button className='pwdresetbtn' onClick={codecheck}>이메일 인증하기</button>
                            )
                        }

                        {
                            (emailVerificationResult) && (
                                <>
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
                                </>
                            )
                        }

                        {
                            (emailVerificationResult) && (
                                <button className='pwdresetbtn' onClick={resetPassword}>비밀번호 재설정</button>
                            )
                        }
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    export default ResetPwd