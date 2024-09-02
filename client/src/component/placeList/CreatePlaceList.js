import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import "../../style/review/writeReview.css";
import authAxios from '../../util/jwtUtil';

function CreateInsertPlace({ onAddPlaceList }) {
    const [name, setName] = useState("");
    const [savefilename, setSavefilename] = useState("");
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

    // 기본 이미지 사용 버튼 클릭 시 호출되는 함수
    // function handleUseDefaultImages() {
    //     setShowDefaultImages(true);
    // }

    // 제출 처리 함수
    const onSubmit = async () => {

        const formData = new FormData();
        const files = document.querySelector('#imgInput').files;

        Array.from(files).forEach((file) => {
            formData.append('file', file);
        });

        try {
            let savefilenames = [];
            let savefilenameRes;


            if (files.length === 1) {
                const res = await authAxios.post('/api/file', formData);
                savefilenames.push(res.data.savefilename);
                setSavefilename(res.data.savefilename);
                savefilenameRes = res.data.savefilename;

                // 글 작성 요청 

                await authAxios.post("/api/placelist", {
                    listName: name,
                    writer: loginUser.email,
                    image: savefilenameRes,
                    favcount: 0,
                })
                    .then((res) => {
                        onAddPlaceList();
                    })
                    .catch((err) => {
                        console.error(err);
                    })

            }
        } catch (error) {
            if (error.response.status === 409){
                alert("현재 입력한 이름의 맛플리가 이미 회원님의 목록에 존재합니다. 다른 이름으로 생성해 주세요.");
            }
        }
    }

    return (
        <div className='createPlaceListFormContainer'>
            <div className='writeReview'>
                <div className='review-write-container'>
                    <h2>맛플리 생성</h2>
                    <div className='writeReview2'>
                        <div className='review-write-field'>
                            <div className='review-write-label'>이름</div>
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
                            {/* <button
                                onClick={handleUseDefaultImages}
                                style={{ background: "#0F0E0E", borderRadius: "5px", color: "white", padding:"10px 20px", fontSize:"13px", marginRight:"10px" }}
                            >
                                기본 이미지 사용
                            </button> */}
                            <div className='review-write-input'>
                                <button
                                    onClick={showImgInput}
                                >
                                    나만의 이미지 등록하기
                                </button>
                                <input
                                    type="file"
                                    id="imgInput"
                                    onChange={(e) => fileUpload(e)}
                                    style={{ display: 'none' }} // input 요소를 숨깁니다.
                                />
                            </div>
                        </div>
                        {/* <div className='review-write-field' style={{marginBottom:"20px", display:"flex", justifyContent:"flex-start", flexDirection:"column"}}>
                            <div className='writePlaceListForm-defaultimage-label'> 
                                <span>등록할 이미지가 없다면?</span> 
                                대신 기본 이미지 사용하기
                            </div>
                            <div className='review-write-images' style={{
                                display:"flex",
                                gap: '10px',
                                justifyContent: 'center',
                                minHeight: "150px"
                            }}>
                                <div className='wrtiePlaceListForm-defaultimages'>
                                    <img src="/api/images/Chrysanthemum1723807518566.jpg" alt="기본 이미지 1" />
                                </div>
                                <div className='wrtiePlaceListForm-defaultimages'>
                                    <img src="/api/images/Chrysanthemum1723807518566.jpg" alt="기본 이미지 2" />
                                </div>
                                <div className='wrtiePlaceListForm-defaultimages'>
                                    <img src="/api/images/Chrysanthemum1723807518566.jpg" alt="기본 이미지 3" />
                                </div>
                                <div className='wrtiePlaceListForm-defaultimages'>
                                    <img src="/api/images/Chrysanthemum1723807518566.jpg" alt="기본 이미지 4" />
                                </div>
                            </div>
                        </div> */}
                        <div className='review-write-field'>
                            <div className='review-write-label'>파일 미리보기</div>
                            <div className='review-write-input'>
                                <input
                                    type="text"
                                    value={savefilename}
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
                                생성하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateInsertPlace;
