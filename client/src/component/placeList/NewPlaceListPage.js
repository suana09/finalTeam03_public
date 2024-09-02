import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';
import CreateInsertPlace from './CreatePlaceList';

function NewPlaceListPage() {
    const loginUser = useSelector(state => state.user);

    const navigate = useNavigate();
    useEffect(() => {
        if (!loginUser.email) {
            alert("로그인이 필요한 서비스입니다 💧");
            navigate('/login');
        }
    }, [loginUser.email, navigate])

    const handleAddPlaceList = () => {
        alert("맛플리를 성공적으로 생성하였습니다 ✨");
        navigate("/placeList");
    }

    return (
        <div>
            <Header />
            <div style={{ width: "500px", height: "120%", margin: "100px auto" }}>
                <CreateInsertPlace onAddPlaceList={handleAddPlaceList} />
            </div>
            <Footer />
        </div>
    )
}

export default NewPlaceListPage