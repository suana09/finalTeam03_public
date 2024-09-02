import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import "../../style/review/writeReview.css";
import authAxios from '../../util/jwtUtil';
import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

function UpdateReview() {
    const [nickname, setNickname] = useState("");
    const [content, setContent] = useState("");
    const [pname, setPname] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [oldImgSrc, setOldImgSrc] = useState("");
    const [placeId, setPlaceId] = useState('');
    const [oldImageFilename, setOldImageFilename] = useState("");
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    const fetchReviewData = async () => {
        try {
            const result = await authAxios.get(`/api/review/reviewDetail/${id}`);
            setNickname(loginUser.nickname);
            setContent(result.data.review.content);
            setPname(result.data.review.pname);
            setPlaceId(result.data.review.placeid);
            setOldImgSrc(`http://localhost:8090/images/${result.data.review.savefilename}`);
            setOldImageFilename(result.data.review.savefilename);  // 기존 이미지 파일명 저장

            console.log(result.data.review);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReviewData();
    }, []);

    const fileUpload = (e) => {
        const files = e.target.files;
        const imgPrev = document.querySelector('#imgPrev');

        // 기존 이미지를 제거
        imgPrev.innerHTML = '';

        Array.from(files).forEach(file => {
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgTag = document.createElement('img');
                    imgTag.src = event.target.result;
                    imgTag.style.display = 'inline-block';
                    imgTag.style.width = '200px';
                    document.querySelector('#imgPrev').appendChild(imgTag);
                };

                reader.readAsDataURL(file);
            }
        });
    };

    const onSubmit = async () => {
        const formData = new FormData();
        const files = document.querySelector('#imgInput').files;

        if (files.length === 0 && !oldImageFilename) {
            alert('이미지를 선택해주세요');
            return;
        } else if (!content) {
            alert('내용을 작성해주세요');
            return;
        } else if (rating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }

        // 새 이미지가 업로드된 경우
        if (files.length > 0) {
            Array.from(files).forEach((file) => {
                formData.append('file', file);
            });

            try {
                let savefilenames = [];
                if (files.length === 1) {
                    const res = await authAxios.post('/api/file', formData);
                    savefilenames.push(res.data.savefilename);

                    console.log("placeid", placeId)
                    // 리뷰 수정 요청
                    const result = await authAxios.post('/api/review/updateReview', { id, content, rates: rating, writer: loginUser.email, placeId });
                    if (result.data.message === "OK") {
                        const imageResponse = await authAxios.post("/api/review/updateImages", { savefilename: res.data.savefilename, reviewId: id });
                        if (imageResponse.data.message === "OK") {
                            alert("성공적으로 리뷰 수정이 완료되었습니다.");
                            await authAxios.put('/api/review/placeinfos', null, { params: { placeId } });
                            navigate('/reviewList');
                        }
                    } else {
                        return;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            // 새 이미지가 업로드되지 않은 경우 기존 이미지 파일명 사용
            try {
                const result = await authAxios.post('/api/review/updateReview', { id, content, rates: rating, writer: loginUser.email, placeId });
                if (result.data.message === "OK") {
                    // 리뷰 수정 요청
                    const imageResponse = await authAxios.post("/api/review/updateImages", { savefilename: oldImageFilename, reviewId: id });
                    if (imageResponse.data.message === "OK") {
                        alert("성공적으로 리뷰 수정이 완료되었습니다.");
                        await authAxios.put('/api/review/placeinfos', null, { params: { placeId } });
                        navigate('/reviewList');
                    }
                } else {
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    const showImgInput = () => {
        const imgInput = document.querySelector("#imgInput");
        if (imgInput) {
            imgInput.click();
        }
    };

    return (
        <div>
            <Header />
            <div className='writeReviewUpdate'>
                <div className='review-write-container-update'>
                    <h2>리뷰 수정</h2>
                    <div className='writeReview2-update'>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>리뷰 작성자</div>
                            <div className='review-write-input-update'>
                                <input type="text" value={nickname} readOnly />
                            </div>
                        </div>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>음식점 이름</div>
                            <div className='review-write-input-update'>
                                <input type="text" value={pname} readOnly />
                            </div>
                        </div>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>별점</div>
                            <div className='review-write-input-update'>
                                <div>
                                    {[1, 2, 3, 4, 5].map((index) => (
                                        <button
                                            key={index}
                                            className={index <= (hover || rating) ? 'star gold' : 'star'}
                                            onClick={() => setRating(index)}
                                            onMouseEnter={() => setHover(index)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            &#9733;
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>내용</div>
                            <div className='review-write-input-update'>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.currentTarget.value)}
                                    placeholder='내용을 입력해주세요...'
                                    rows="4"
                                    cols="70"
                                    className='textAreaRes'
                                ></textarea>
                            </div>
                        </div>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>사진</div>
                            <div className='review-write-input-update'>
                                <button onClick={showImgInput}>새 이미지 첨부</button>
                                <input type="file" id="imgInput" onChange={(e) => fileUpload(e)} />
                            </div>
                        </div>
                        <div className='review-write-field-update'>
                            <div className='review-write-label-update'>이미지</div>
                            <div id="imgPrev" className='review-write-field-updateimgprev'>
                                {oldImgSrc && (
                                    <div>
                                        <img src={oldImgSrc} alt="기존 이미지" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='btns-update'>
                            <button onClick={onSubmit}>수정하기</button>
                            <button onClick={() => navigate(`/reviewDetail/${id}`)}>뒤로 가기</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpdateReview;
