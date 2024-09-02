import React from 'react';
import './Modal.css'; // CSS 파일을 이용해 스타일링합니다.

const Modal = ({ isOpen, onClose, place }) => {
    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{place?.place_name}</h2>
                <p><strong>주소:</strong> {place?.address_name}</p>
                <p><strong>전화:</strong> {place?.phone}</p>
                <p><strong>카테고리:</strong> {place?.category_name}</p>
                <p><strong>상세 주소:</strong> {place?.road_address_name}</p>
                <a href={place?.place_url} target="_blank" rel="noopener noreferrer">상세보기</a>
            </div>
        </div>
    );
};

export default Modal;
