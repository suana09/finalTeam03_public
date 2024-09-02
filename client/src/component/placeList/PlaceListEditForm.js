import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "../../style/review/writeReview.css";
import authAxios from '../../util/jwtUtil';

function PlaceListEditForm({ selectedList, onUpdatePlaceList }) {

    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])

    const [name, setName] = useState(selectedList.listName);
    const [savefilename, setSavefilename] = useState("");
    const [exfilename, setExfilename] = useState("");
    // const [showDefaultImages, setShowDefaultImages] = useState(false);
    const loginUser = useSelector(state => state.user);

    // 파일 업로드 처리 함수
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
                    // imgtag.style.display = 'inline-block';
                    imgtag.style.width = '200px';
                    imgtag.className = 'image-preview';
                    document.querySelector('#imgPrev').appendChild(imgtag);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // 이미지 입력 버튼 클릭 시 호출되는 함수
    const showImgInput = () => {
        const imgInput = document.querySelector("#imgInput");
        if (imgInput) {
            imgInput.click();
        }
    }


    // 제출 처리 함수
    const onSubmit = async () => {
        const formData = new FormData();
        const files = document.querySelector('#imgInput').files;

        let savefilenameRes;

        // 새로운 파일이 업로드된 경우
        if (files.length > 0) {
            console.log("우잉?");
            Array.from(files).forEach((file) => {
                formData.append('file', file);
            });

            try {
                const res = await authAxios.post('/api/file', formData);
                savefilenameRes = res.data.savefilename;

                console.log(savefilenameRes);
            } catch (error) {
                console.log(error);
            }
        } else {
            savefilenameRes = selectedList.image;
        }

        try {
            const result = await authAxios.put(`/api/placelist/${selectedList.id}`, {
                listName: name,
                writer: loginUser.email,
                image: savefilenameRes,
                favcount: 0,
            });
            let updatedPli = result.data;
            alert("맛플리 수정이 완료되었습니다.")
            onUpdatePlaceList(selectedList.id, updatedPli);
        } catch (error) {
            if (error.response.status === 409){
                alert("현재 입력한 이름의 맛플리가 이미 회원님의 목록에 존재합니다. 다른 이름으로 변경해 주세요.");
                onUpdatePlaceList();
            }
        }
    }

    

    return (
        <div className='createPlaceListFormContainer'>
            <div className='writeReview'>
                <div className='review-write-container'>
                    <h2>맛플리 수정</h2>
                    <div className='writeReview2'>
                        <div className='review-write-field'>
                            <div className='review-write-label'>
                                이름
                            </div>
                            <div className='review-write-input'>
                                <input
                                    type="text"
                                    value={name} 
                                    onChange={(e) => setName(e.currentTarget.value)}
                                />
                            </div>
                        </div>
                        <div className='review-write-field'>
                            <div className='review-write-label'>대표 이미지</div>

                            <div className='review-write-input'>
                                <button
                                    onClick={showImgInput}
                                >
                                    이미지 수정하기
                                </button>
                                <input
                                    type="file"
                                    id="imgInput"
                                    onChange={(e) => fileUpload(e)}
                                    style={{ display: 'none' }} // input 요소를 숨깁니다.
                                />
                            </div>
                        </div>
                        <div className="review-write-field">
                            <div className="review-write-label">기존 이미지</div>
                            <div className="review-write-input">
                                {selectedList.image && 
                                    <img src={`/api/images/${selectedList.image}`} alt="기존 이미지" style={{height:"100px"}}/>}
                            </div>
                        </div>

                        <div className='review-write-field'>
                            <div className='review-write-label'>파일 미리보기</div>
                            <div className='review-write-input'>
                                <input
                                    type="text"
                                    onChange={(e) => setSavefilename(e.currentTarget.value)}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='review-write-field'>
                            <div id="imgPrev">
                            </div>
                        </div>

                        <div className='writePlaceListForm-btns'>
                            <button
                                onClick={() => { onSubmit(); }}
                            >
                                수정하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceListEditForm;
