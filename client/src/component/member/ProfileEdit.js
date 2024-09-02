import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../store/userSlice';
import '../../style/member/ProfileEdit.css';
import authAxios from '../../util/jwtUtil';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';


function ProfileEdit() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdCheck, setPwdCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [provider, setProvider] = useState(null);

    const [pwdCheckResult, setPwdCheckResult] = useState(null);
    const loginUser = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    useEffect(()=>{
        if (loginUser.email){
            setEmail(loginUser.email);
            setNickname(loginUser.nickname);
            setProvider(loginUser.provider);
        }
    }, [loginUser.email, loginUser.nickname, loginUser.provider])


    const getInputBorder = (checkVar, checkResult) => {
        if (checkVar === '') return '1px solid #c0c0c0';
        return (checkResult) ? ('2px solid #5bc75b') : ('2px solid #ed3d3d');
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

    const update = async () => {
        if (pwd === '' && provider === null) {
            alert("비밀번호를 입력해주세요.");
        } else if (nickname === '') {
            alert('이메일을 입력해주세요.');
        } else if (!pwdCheckResult && provider === null) {
            alert("비밀번호 확인이 일치하지 않습니다.");
        } else {
            const res = await authAxios.put('/api/member/edit', { email, pwd, nickname })
            const result = await axios.post('/api/auth/login', { email: res.data.email, pwd: res.data.pwd });
            dispatch(loginAction({ email: result.data.user.email, nickname: result.data.user.nickname, provider: result.data.user.provider }));
            alert("회원정보가 수정되었습니다.");
            navigate('/');
        }
    }

    return (
        <>
            <Header />
            <div className='pfEdit-container'>
                <h1>EDIT INFO</h1>
                <div className="pfEdit-fields">
                    <div className="pfEdit-label">이메일</div>
                    <input className='edit-input' type="text" value={email} placeholder={email} />
                </div>

                <div className="pfEdit-fields">
                    <div className="pfEdit-label">새 비밀번호 입력</div>
                    <input className='edit-input'
                     type="password" value={pwd}
                     onChange={(e) => {setPwd(e.currentTarget.value);}}
                     readOnly={provider !== null} /> <br />
                </div>
                <div className="pfEdit-fields" style={{
                    borderBottom: getInputBorder(pwdCheck, pwdCheckResult)
                }} >
                    <div className="pfEdit-label">비밀번호 재입력</div>
                    <input className='edit-input'
                     type="password" value={pwdCheck} 
                     onChange={(e) => {setPwdCheck(e.currentTarget.value);}}
                     readOnly={provider !== null} /> <br />
                </div>
                <div className="pfEdit-fields">
                    <div className="pfEdit-label">닉네임</div>
                    <input className='edit-input' type="text" value={nickname} onChange={(e) => {
                        setNickname(e.currentTarget.value);
                    }} /> <br />
                </div>
                <button className='update' onClick={update}>수정하기</button>
            </div>
            <Footer />
        </>
    )
}

export default ProfileEdit