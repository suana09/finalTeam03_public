import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo_header.png';
import { logoutAction } from '../../store/userSlice';
import "../../style/HeaderFooter.css";
import authAxios from '../../util/jwtUtil';
import Sidebar from './Sidebar';

function Header() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);

    const logout = async () => {
        try {
            await authAxios.delete('/api/auth/logout');
            dispatch(logoutAction());
            sessionStorage.removeItem("accessToken");
            alert("로그아웃되었습니다.");
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const handleLogin = () => {
        navigate('/login');
    };

    const handleJoin = () => {
        navigate('/register');
    };

    const handleLogoClick = () => {
        navigate('/');
    }

    return (
        <div className='header' style={{ marginBottom: "10px" }}>
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }} >
                <img src={logo} alt="Logo" width={200} />
            </div>
            <div className='header-content'>
                {/* <div className="nav">
                    <a href="insertPlaceList" className="nav-link">맛플리 생성</a>
                    <a href="placeList" className="nav-link">맛플리 관리</a>
                    <a href="searchpli" className="nav-link">맛플리 탐방</a>
                </div> */}
                <div className="nav">
                    <span onClick={() => navigate('/insertPlaceList')} className="nav-link">맛플리 생성</span>
                    <span onClick={() => navigate('/placeList')} className="nav-link">맛플리 관리</span>
                    <span onClick={() => navigate('/searchpli')} className="nav-link">맛플리 탐방</span>
                </div>
                <div className="user-info">
                    {loginUser?.nickname ? (
                        <>
                            <span className="nav-link">{loginUser.nickname} 님 </span>
                            <span
                                className="nav-link"
                                onClick={logout}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                LOGOUT
                            </span>
                        </>
                    ) : (
                        <>  <span
                                className="join-button"
                                onClick={handleJoin}
                                style={{ cursor: 'pointer' }}>
                                JOIN
                            </span>
                            <span
                                className="login-button"
                                onClick={handleLogin}
                                style={{ cursor: 'pointer' }}>
                                LOGIN
                            </span>

                        </>
                    )}
                </div>
                <Sidebar />
            </div>
        </div>
    );
}

export default Header;
