import React, { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'

function KakaoSaveInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {nickname} = useParams('nickname');

    useEffect(() => {
        const saveUserInfo = async ()=>{
            try {
                const result = await axios.post('/api/auth/login', { email: nickname, pwd: "kakao"} );

                if (result.data.error === 'ERROR_LOGIN') {
                    return alert('이메일 또는 패스워드 오류');
                } else {
                    sessionStorage.setItem('accessToken', result.data.accessToken);
                    dispatch(loginAction({email:result.data.user.email, nickname:result.data.user.nickname, provider:result.data.user.provider}));
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
            }
        }
           
        saveUserInfo();
        }
    )


    return (
        <div>

        </div>
    )
}

export default KakaoSaveInfo
