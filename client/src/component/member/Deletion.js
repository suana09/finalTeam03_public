import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authAxios from '../../util/jwtUtil';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

import { logoutAction } from '../../store/userSlice';
import '../../style/member/Login.css';

function Deletion() {
    const [pwd, setPwd] = useState('');
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loginUser.email) {
            alert("로그인이 필요한 서비스입니다 💧");
            navigate('/login');
        }
    }, [loginUser.email, loginUser.nickname, loginUser.provider])
    

    const deletion = async () => {

        try {
            const result = await authAxios.put('/api/member/deletion', { email: loginUser.email, pwd: pwd });
            if (result.data.status === 'fail') {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            else {
                let ans = window.confirm("정말로 탈퇴하시겠어요?");
                if (ans) {
                    await authAxios.delete('/api/auth/logout');
                    sessionStorage.removeItem("accessToken");
                    dispatch(logoutAction());
                    alert("회원 탈퇴가 완료되었습니다.");
                    navigate('/');
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Header />
            <div className='delete-container'>
                <h1>회원 탈퇴</h1>
                <p>서비스를 탈퇴하시려면 비밀번호를 입력해주세요. <br /><br /></p>
                <div className="delete-field">
                    <div className="delete-label">비밀번호 입력</div>
                    <input className='delete-input' type="password" value={pwd} onChange={(e) => {
                        setPwd(e.currentTarget.value);
                    }} /> <br />
                </div>
                <button className='delete-btn' onClick={deletion}>탈퇴하기</button>
            </div>
            <Footer />
        </>
    )
}

export default Deletion