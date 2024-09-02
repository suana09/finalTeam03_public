import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../../style/review/reviewList.css";
import authAxios from '../../util/jwtUtil';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

function ReviewSelect() {
    const navigate = useNavigate();
    const [totalReviews, setTotalReviews] = useState();
    const [reviewImages, setReviewImages] = useState({});
    const [reviewIds, setReviewIds] = useState([]);
    const [hoveredReviewId, setHoveredReviewId] = useState(null);
    const [reviewDetails, setReviewDetails] = useState({});
    const loginUser = useSelector(state => state.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await authAxios.get("/api/review/reviewList", { params: { writer: loginUser.email } });

                if (!loginUser) {
                    window.alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                }

                setTotalReviews(result.data.totalReviews);
                setReviewImages(result.data.reviewImages);
                setReviewIds(result.data.reviewIds);

                if (result.data.reviewIds.length > 0) {
                    const reviews = {};
                    for (const id of result.data.reviewIds) {
                        const res = await authAxios.get(`/api/review/reviewDetail/${id}`);
                        reviews[id] = res.data.review;
                    }
                    setReviewDetails(reviews);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [loginUser, navigate]);

    useEffect(() => {
        if (hoveredReviewId != null && reviewDetails[hoveredReviewId]) {
            const reviewDetail = reviewDetails[hoveredReviewId];
            console.log(reviewDetail);
        }
    }, [hoveredReviewId, reviewDetails]);

    const isScrollable = reviewIds.length >= 7;

    return (
        <div className="page-container">
            <Header />
            <article className="content-wrap">
                <div className='review-list'>
                    <div className='review-totalcount'>
                        {totalReviews ? (<div>내가 쓴 리뷰 (총 {totalReviews}개)</div>) : (<div>리뷰가 존재하지 않습니다.</div>)}
                    </div>
                    <div
                        className={`review-image-grid ${isScrollable ? 'scrollable' : ''}`}
                    >
                        {
                            reviewIds.map((id) => (
                                <div
                                    key={id}
                                    className='review-image-container'
                                    onMouseEnter={() => setHoveredReviewId(id)}
                                    onMouseLeave={() => setHoveredReviewId(null)}
                                    onClick={() => { navigate(`/reviewDetail/${id}`) }}
                                >
                                    <img
                                        src={`${reviewImages[id]}`}
                                        alt={`Review ${id}`}
                                        className="review-image"
                                    />
                                    { // 마우스 커서를 올렸을 때의 그 해당 이미지의 id랑 리뷰리스트에서 끌고 온 해당 id가 같고, 뷰에서 리뷰 id를 끌고 와서 그 행과 같으면
                                        // 그 리뷰id에 맞는 행의 pname과 content 추출
                                        (hoveredReviewId === id && reviewDetails[id]) && (
                                            <div className="review-details">
                                                <p>{reviewDetails[id].pname}</p>
                                                <p>{reviewDetails[id].content}</p>
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </article>
            <Footer />
        </div>
    );
}

export default ReviewSelect;
