import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import authAxios from '../../util/jwtUtil';
import "../../style/review/review.css"
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';


function ReviewDetail() {

    const [review, setReview] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const [imgSrc, setImgSrc] = useState('');
    // const [rating, setRating] = useState(review ? review.rates : 0);
    // const [hover, setHover] = useState(0);

    useEffect(() => {
        authAxios.get(`/api/review/reviewDetail/${id}`)
            .then((result) => {
                setReview(result.data.review);
                setImgSrc(`${result.data.review.savefilename}`)
            })
            .catch((err) => {
                console.error(err);
            })

    }, [id]
    )

    async function deleteReview(id) {
        const ans = window.confirm("정말로 해당 리뷰를 삭제하시겠습니까?");
        if (ans) {
            try {
                const result = await authAxios.delete(`/api/review/deleteReview/${id}`);
                if (result.data.message === "OK") {
                    await authAxios.put('/api/review/placeinfos', null, { params: { placeId: result.data.placeId } });
                    window.alert("삭제가 정상적으로 완료되었습니다.");
                    navigate("/reviewList")
                }
            } catch (err) {
                console.error(err);
            }
        }
    }


    const formatDate = (dateString) => {
        if (!dateString) return '';

        return dateString.substring(0, 10);
    };


    const formattedDate = formatDate(review.writedate);

    return (
        <div>
            <Header></Header>
            <article>
                <div className='subPage'>
                    {
                        (review) ? (
                            <div className='reviewDetail'>
                                <div className='detail'>
                                    <div className='detailinfo'>
                                        <div className='detailInfo-field0'>
                                            <div className='detailInfo-field0Div'>
                                                <div>{review.pname} </div>&nbsp;&nbsp;
                                                <span className="arrow"> &gt; </span>&nbsp;&nbsp;
                                                <div>{formattedDate}</div>
                                            </div>
                                        </div>
                                        <div className='detailInfo-field2'>
                                            <div className="star-container">
                                                {[1, 2, 3, 4, 5].map((index) => (
                                                    <button
                                                        key={index}
                                                        className={index <= (review.rates) ? 'star gold' : 'star'}
                                                        disabled
                                                    >
                                                        &#9733; {/* Star Unicode Character */}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='detailInfo-field'>
                                            <div>{review.content}</div>
                                        </div>
                                        <div className='detailimg'>
                                            <img src={imgSrc} alt=''></img>
                                        </div>
                                    </div>
                                </div>
                                <div className='btns0'>
                                    <input type="button" value="수정하기" onClick={() => { navigate(`/updateReview/${review.reviewId}`) }}></input>
                                    <input type="button" value="삭제하기" onClick={() => { deleteReview(`${review.reviewId}`) }}></input>
                                    <input type="button" value="뒤로가기" onClick={() => { navigate('/reviewList') }}></input>
                                </div>
                            </div>
                        ) : (null)

                    }
                </div>
            </article>
            <Footer></Footer>
        </div>
    )
}

export default ReviewDetail