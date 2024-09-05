import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../../store/userSlice';
import "../../style/Sidebar.css";
import authAxios from '../../util/jwtUtil';
import logo from '../../images/logo_header.png'

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);
    const isUserLoggedIn = loginUser.email !== '' && loginUser.nickname !== '';

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [sidebarOpen]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        authAxios.delete('/api/auth/logout')
            .then(() => {
                sessionStorage.removeItem("accessToken");
                navigate('/');
            });
    }

    useEffect(() => {
        const updateSlidesToShow = () => {
            if (window.innerWidth <= 480) {
                setIsMobile(true);

            } else {
                setIsMobile(false);
            }
        };

        window.addEventListener('resize', updateSlidesToShow);

        // 컴포넌트가 마운트될 때 초기 설정
        updateSlidesToShow();

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거.
        return () => {
            window.removeEventListener('resize', updateSlidesToShow);
        };
    }, []);

    return (
        <div>
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <button className={`toggle-btn ${sidebarOpen ? 'open' : ''}`}>
                    ☰
                </button>
            </div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className={`sidebar-close-btn ${sidebarOpen ? '' : 'hidden'}`} onClick={closeSidebar}>
                    ✖
                </button>

                {/* 로그인 필요 메시지와 로그인 버튼 */}
                {!isUserLoggedIn ? (
                    <div className="sidebar-login-prompt">
                        <p>로그인이 필요합니다</p>
                        <button className="login-btn" onClick={handleLogin}>LOGIN</button>
                    </div>
                ) : (
                    <div className="sidebar-user-info">
                        {
                            (isMobile) && (
                                <img src={logo} alt=""  onClick={()=>{navigate('/')}}/>
                            )
                        }
                        <div className='sidebar-user-loginUser'>
                            <p style={{ margin: "5px" }}>{loginUser.nickname} 님 </p>
                            <p style={{ margin: "5px" }} >환영합니다👏</p>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
                    </div>
                )}

                <div className='sidebar-menu'>
                    <div className='sidebar-menu1'>
                        <h2>회원 관리</h2>
                        <a href="/profileEdit" className="sidebar-link">회원 정보 수정</a>
                        <a href="/deletion" className="sidebar-link">회원 탈퇴</a>
                    </div>
                    <div className='sidebar-menu2'>
                        <h2>플리 관리</h2>
                        <a href="/insertPlaceList" className="sidebar-link">새 플리 생성</a>
                        <a href="/placeList" className="sidebar-link">나의 플리 보기</a>
                        <a href="/searchpli" className="sidebar-link">플리 탐방</a>
                        <a href="/favoritePlis" className='sidebar-link'>나의 즐겨찾기</a>
                    </div>
                    <div className='sidebar-menu3'>
                        <h2>내 리뷰 관리</h2>
                        <a href="/reviewList" className="sidebar-link">나의 리뷰 보기</a>
                    </div>
                </div>
                {
                    (!isMobile) && (
                        <img src={logo} alt=""  onClick={()=>{navigate('/')}}/>
                    )
                }
            </div>
        </div>
    );
}

export default Sidebar;
