import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "../../style/review/starRating.css";
import "../../style/review/writeReview.css";
import authAxios from '../../util/jwtUtil';

function WriteReview({ onWriteReview, selectedPlaceId, selectedPlaceName, place, mainphoto }) {
    const [nickname, setNickname] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const loginUser = useSelector(state => state.user);


    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    useEffect(() => {
        setNickname(loginUser.nickname);
    }, [loginUser.nickname])


    function fileUpload(e) {
        const files = e.target.files;
        const imgPrevContainer = document.querySelector('#imgPrev');

        imgPrevContainer.innerHTML = '';

        Array.from(files).forEach(file => {
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    let imgtag = document.createElement('img');
                    imgtag.src = event.target.result;
                    imgtag.style.display = 'inline-block';
                    // imgtag.style.width = '200px';
                    imgtag.className = 'image-preview';
                    document.querySelector('#imgPrev').appendChild(imgtag);
                };

                reader.readAsDataURL(file);
            }
        });

    }

    async function onSubmit() {
        const formData = new FormData();
        const files = document.querySelector('#imgInput').files;

        if (files.length === 0) {
            alert('이미지를 선택해주세요');
            return;
        } else if (!content) {
            alert('내용을 작성해주세요');
            return;
        } else if (rating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }

        Array.from(files).forEach((file) => {
            formData.append('file', file);
        });

        try {
            let savefilenames = [];
            let savefilenameRes;


            if (files.length === 1) {
                const res = await authAxios.post('/api/file', formData);
                savefilenames.push(res.data.savefilename);
                savefilenameRes = res.data.savefilename;

                // 글 작성 요청 
                await authAxios.post(`/api/place`, {
                    id: selectedPlaceId,
                    latitude: place.y,
                    longitude: place.x,
                    pname: place.place_name,
                    address: place.address_name,
                    categoryName: place.category_name,
                    image: mainphoto ? mainphoto : '/api/images/noimages.png'
                })

                const result = await authAxios.post('/api/review', { content: content, rates: rating, writer: loginUser.email, placeId: selectedPlaceId });
                if (result.data.message === "OK") {
                    const imageResponse = await authAxios.post("/api/review/images", { savefilename: savefilenameRes, reviewId: result.data.review.id })
                    if (imageResponse.data.message === "OK") {
                        await authAxios.put('/api/review/placeinfos', null, { params: { placeId: selectedPlaceId } })
                        alert("리뷰가 성공적으로 작성되었습니다 ✨");
                        onWriteReview();
                    }
                } else {
                    return;
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    const showImgInput = () => {
        const imgInput = document.querySelector("#imgInput");
        if (imgInput) {
            imgInput.click();
        }
    }


    return (
        
        <div className='writeReview-write'>
            <div className='review-write-container-write'>
                <h2>리뷰 작성</h2>
                <div className='writeReview2-write'>
                    <div className='review-write-field-write review-write-height40'>
                        <div className='review-write-label-write'>리뷰 작성자</div>
                        <div className='review-write-input-write'>
                            <input type="text" value={nickname} readOnly></input>
                        </div>
                    </div>
                    <div className='review-write-field-write review-write-height40'>
                        <div className='review-write-label-write'>음식점 이름</div>
                        <div className='review-write-input-write'>
                            <input type="text" value={selectedPlaceName} readOnly></input>
                        </div>
                    </div>
                    <div className='review-write-field-write review-write-height40'>
                        <div className='review-write-label-write'>별점</div>
                        <div className='review-write-input-write'>
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
                    <div className='review-write-field-write'>
                        <div className='review-write-label-write review-write-height60'>내용</div>
                        <div className='review-write-input-write'>
                            <textarea
                                value={content}
                                onChange={(e) => { setContent(e.currentTarget.value) }}
                                placeholder='내용을 입력해주세요...'
                                rows="3 "
                                cols="50"
                            ></textarea>
                        </div>
                    </div>
                    <div className='review-write-field-write review-write-height40'>
                        <div className='review-write-label-write'>사진</div>
                        <div className='review-write-input-write review-write-height40'>
                            <button onClick={showImgInput}> 사진 첨부 </button>
                            <input type="file" id="imgInput" onChange={(e) => { fileUpload(e) }}></input>
                        </div>
                    </div>
                    <div className='review-write-field-write review-write-height80'>
                        <div className='review-write-label-write'>이미지</div>
                        <div id="imgPrev" className='review-write-field-writeimgprev'></div>
                    </div>
                    <div className='btns-write'>
                        <button onClick={() => { onSubmit(); }}>등록</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WriteReview