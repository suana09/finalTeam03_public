import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../../style/review/reviewList.css";
import authAxios from '../../util/jwtUtil';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

function ReviewSelect() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [reviewCounts, setReviewCounts] = useState(0);
    const loginUser = useSelector(state => state.user);
    const [reviewDetailClass, setReviewDetailClass] = useState('review-details');
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await authAxios.get("/api/review/my", { params: { writer: loginUser.email } });


                if (!loginUser) {
                    window.alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                }

                setReviews(result.data.reviewList);
                setReviewCounts(result.data.reviewList.length);
                if (result.data.reviewList.length > 6) {
                    setIsScrollable(true);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [loginUser, navigate]);

    useEffect(() => {
        const handleResize = () => {
            reviewDetailsToggle(0);
        };

        // 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // cleanup 함수: 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 빈 배열로 설정하면 컴포넌트가 마운트 및 언마운트 될 때만 실행됨


    const reviewDetailsToggle = (id) => {

        let isInMobile = false;

        if (window && window.innerWidth <= 768) {
            isInMobile = true;
        }

        if (isInMobile) {
            setReviewDetailClass('review-details review-details-selected');
        } else {
            setReviewDetailClass('review-details');
        }
    }

    return (
        <div className="page-container">
            <Header />



            <article className="content-wrap">
                <div className='review-list'>
                    <div className='review-totalcount'>
                        {
                            (reviewCounts > 0) ?
                            (<div> 내가 쓴 리뷰 (총 {reviewCounts}개) </div>) :
                            (<div> 리뷰가 존재하지 않습니다. </div>)
                        }
                    </div>
                    {
                        (reviews && reviews.length > 0) && (
                            <div
                                className={`review-image-grid ${isScrollable ? 'scrollable' : ''}`}
                            >
                                {
                                    reviews.map((review, idx) => (
                                        <div
                                            key={review.reviewId}
                                            className='review-image-container'
                                            onMouseEnter={() => reviewDetailsToggle(review.reviewId)}
                                            onClick={() => { navigate(`/reviewDetail/${review.reviewId}`) }}
                                        >
                                            <img
                                                src={review.savefilename}
                                                alt=''
                                                className="review-image"
                                            />
                                            {/* {'review-details ' + (hoveredReviewId === id && reviewDetails[id]) && ('review-details-selected')} */}

                                            <div className={reviewDetailClass}>
                                                <p>{review.pname}</p>
                                                <p>{review.content}</p>
                                            </div>


                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </article>

            <Footer />
        </div>
    );
}

export default ReviewSelect;
