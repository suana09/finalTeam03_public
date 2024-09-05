import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaceListWriteForm from '../../component/placeList/CreatePlaceList';
import ReviewWriteForm from '../../component/review/WriteReview';
import AddIcon from '../../images/icons/add.png';
import closeIcon from '../../images/icons/close.png';
import WriteIcon from '../../images/icons/edit.png';
import ListIcon from '../../images/icons/lists.png';
import noimages from '../../images/noimages.png';
import '../../style/place/detailinfo.css';
import authAxios from '../../util/jwtUtil';



function DetailInfo({ place, onClose, selectedListId, onPlaceChange }) {
    const modalRef = useRef(null);
    const addPlaceListFormRef = useRef(null);
    const [isAddPlaceListOpen, setIsAddPlaceListOpen] = useState(false);
    const writeReviewRef = useRef(null);
    const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [currentPlace, setCurrentPlace] = useState({});
    const [myLists, setMyLists] = useState([]);
    const [reviewInfo, setReviewInfo] = useState({});
    const [reviewlist, setReviewlist] = useState([]);
    const [mainphoto, setMainPhoto] = useState('');

    const [reviewChange, setReviewChange] = useState(0);

    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();


    const currentPath = location.pathname;
    const placeId = place.place_id;

    useEffect(() => {
        axios.get(`/api/map/details`, { params: { placeId } })
            .then((result) => {
                const data = result.data;
                let { basicInfo, menuInfo, photo } = data;

                if (!basicInfo) {
                    console.error('필요한 정보가 응답 데이터에 없습니다.');
                    return;
                }

                if (!menuInfo) {
                    menuInfo = [];
                }

                if (!photo) {
                    photo = [];
                }
                setCurrentPlace({ basicInfo, menuInfo, photo });
                setMainPhoto(result.data.basicInfo.mainphotourl);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [placeId]);

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

    useEffect(() => {
        axios.get(`/api/place`, { params: { placeId } })
            .then((res) => {
                setReviewInfo(res.data);
            })
            .catch((err) => {
                console.error(err);
            })

    }, [reviewChange, placeId])

    useEffect(() => {
        axios.get(`/api/review`, { params: { placeId } })
            .then((res) => {
                setReviewlist(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [reviewChange, isWriteReviewOpen, placeId])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isAddPlaceListOpen && addPlaceListFormRef.current && !addPlaceListFormRef.current.contains(event.target)) {
                setIsAddPlaceListOpen(false);
                return;
            }

            if (isWriteReviewOpen && writeReviewRef.current && !writeReviewRef.current.contains(event.target)) {
                setIsWriteReviewOpen(false);
                return;
            }

            if (isAddPlaceListOpen) {
                return;
            }

            if (isWriteReviewOpen) {
                return;
            }

            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAddPlaceListOpen, isWriteReviewOpen, onClose]);

    const addPlaceLists = () => {
        setIsAddPlaceListOpen(true);
    };

    const handleAddPlaceList = () => {
        alert("맛플리를 성공적으로 생성하였습니다 ✨");
        addToMyLists();
        if (addPlaceListFormRef.current) {
            setIsAddPlaceListOpen(false);
        }
    };

    const handleWriteReview = () => {
        setReviewChange(reviewChange + 1);
        if (writeReviewRef.current) {
            setIsWriteReviewOpen(false);
        }
    }

    const addPlaceToList = async (listId) => {
        let mainphoto = '';
        if (currentPlace.basicInfo.mainphotourl) {
            mainphoto = currentPlace.basicInfo.mainphotourl;
        }

        await authAxios.post(`/api/place`, {
            id: placeId,
            latitude: place.y,
            longitude: place.x,
            pname: place.place_name,
            address: place.address_name,
            categoryName: place.category_name,
            image: mainphoto
        })

        await authAxios.post('/api/placelist/place', { listId, placeId })
            .then((res) => {
                if (res.data.status === 'success') {
                    alert("맛플리에 장소를 추가하였습니다 ✨");
                    onPlaceChange();
                } else if (res.data.status === 'fail') {
                    alert("이미 맛플리에 존재하는 맛플리입니다 💧");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const addToSelectedLists = async () => {

        if (!loginUser.email) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        let mainphoto = '';
        if (currentPlace.basicInfo.mainphotourl) {
            mainphoto = currentPlace.basicInfo.mainphotourl;
        }

        await authAxios.post(`/api/place`, {
            id: placeId,
            latitude: place.y,
            longitude: place.x,
            pname: place.place_name,
            address: place.address_name,
            categoryName: place.category_name,
            image: mainphoto
        })

        await authAxios.post('/api/placelist/place', { listId: selectedListId, placeId })
            .then((res) => {
                if (res.data.status === 'success') {
                    alert("맛플리에 장소를 추가하였습니다 ✨");
                    onPlaceChange();
                } else if (res.data.status === 'fail') {
                    alert("이미 맛플리에 존재하는 맛플리입니다 💧");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }


    const msgVisibleTrue = () => {
        document.querySelector("#detailinfoMSG").style.visibility = 'visible';
    }

    const msg2VisibleTrue = () => {
        document.querySelector("#detailinfoMSG2").style.visibility = 'visible';
    }

    const msgVisibleFalse = () => {
        document.querySelector("#detailinfoMSG").style.visibility = 'hidden';
    }

    const msg2VisibleFalse = () => {
        document.querySelector("#detailinfoMSG2").style.visibility = 'hidden';
    }

    const reviewmsgVisibleTrue = () => {
        document.querySelector("#reviewwriteMSG").style.visibility = 'visible';
    }

    const reviewmsgVisibleFalse = () => {
        document.querySelector("#reviewwriteMSG").style.visibility = 'hidden';
    }

    const toggleInfos = () => {
        setIsBasicInfoOpen(!isBasicInfoOpen);
    }

    const menuinfoToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const wrtieReview = () => {
        setIsWriteReviewOpen(true);
    }

    const addToMyLists = () => {
        if (!loginUser || !loginUser.email || loginUser.email === '') {
            let confirm = window.confirm("로그인이 필요한 기능입니다. 로그인 하시겠습니까?");
            if (confirm) {
                navigate('/login');
            }
        }

        authAxios.get('/api/placelist/my', {
            params: {
                writer: loginUser.email
            }
        })
        .then((res) => {
            document.querySelector("#mylistbox").style.display = 'block';
            setMyLists(res.data);
        });
    }


    const renderStars = (rating) => {
        const starWidth = 24; // 별의 너비
        const totalStars = 5; // 총 별의 수
        const filledPercentage = (rating / totalStars) * 100; // 채워진 비율

        return (
            <div className='detailinfo-review-stars-container' style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(totalStars)].map((_, index) => {
                    const starStart = (index / totalStars) * 100; // 각 별의 시작 비율
                    const starEnd = ((index + 1) / totalStars) * 100; // 각 별의 끝 비율
                    const isFilled = filledPercentage >= starEnd;
                    const isPartiallyFilled = filledPercentage > starStart && filledPercentage < starEnd;

                    return (
                        <div
                            key={index}
                            className='detailinfo-review-star'
                            style={{
                                width: starWidth,
                                height: starWidth,
                                position: 'relative',
                                fontSize: starWidth,
                                color: '#e0e0e0', // 빈 별의 색상
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    color: '#e0e0e0', // 빈 별의 색상
                                    fontSize: '24px',
                                    lineHeight: '24px',
                                    textAlign: 'center',
                                }}
                            >
                                ★
                            </div>
                            {isPartiallyFilled && (
                                <div
                                    style={{
                                        width: `${((filledPercentage - starStart) / (starEnd - starStart)) * 100}%`,
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        color: '#FFD700', // 채워진 별의 색상
                                        fontSize: '24px',
                                        lineHeight: '24px',
                                        textAlign: 'center',
                                        overflow: "hidden"
                                    }}
                                >
                                    ★
                                </div>
                            )}
                            {isFilled && !isPartiallyFilled && (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        color: '#FFD700', // 채워진 별의 색상
                                        fontSize: '24px',
                                        lineHeight: '24px',
                                        textAlign: 'center',
                                    }}
                                >
                                    ★
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const closeMyLists = ()=>{
        document.querySelector("#mylistbox").style.display = 'none';
    }




    return (
        <div className='detailinfo-overlay'>
            {isAddPlaceListOpen && (
                <div className='detailinfo-addPlaceListBox-overlay'>
                    <div className='detailinfo-addPlaceListBox' ref={addPlaceListFormRef}>
                        <PlaceListWriteForm onAddPlaceList={handleAddPlaceList} />
                    </div>
                </div>
            )}
            {isWriteReviewOpen && (
                <div className='detailinfo-writeReviewForm-overlay'>
                    <div className='detailinfo-writeReviewFormBox' ref={writeReviewRef}>
                        <ReviewWriteForm
                            onWriteReview={handleWriteReview}
                            selectedPlaceId={placeId}
                            selectedPlaceName={currentPlace.basicInfo.placenamefull}
                            place={place}
                            mainphoto={mainphoto}
                        />
                    </div>
                </div>
            )}
            <div className='detailinfo-wrapper' ref={modalRef}>
                <div className='detailinfo-mylists' id='mylistbox'>
                    <div className='detailinfo-mylists-title'>🍳 내 플리 목록</div>

                    {myLists && myLists.length > 0 ? (
                        <div>
                            <div className='detailinfo-mylists-item-container'>
                                {myLists.map((item, idx) => (
                                    <div className='detailinfo-mylists-item' key={idx}>
                                        <div className='detailinfo-mylists-item-name'>{item.listName}</div>
                                        <div className='detailinfo-mylists-item-image'>
                                            <div className='detailinfo-mylists-item-imageoverlay'></div>
                                            <img src={item.image} alt="" />
                                            <button className='detailinfo-mylists-item-addbtn' onClick={() => addPlaceToList(item.id)}>
                                                <img src={AddIcon} alt='' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {addPlaceListFormRef.current && addPlaceListFormRef.current.style.display === 'block' ? null : (
                                <div className='detailinfo-mylists-pliaddbtn' >
                                    <button onClick={()=>{addPlaceLists()}}> 새 맛플리 생성하기</button>
                                    {
                                        isMobile && (
                                            <>&nbsp;
                                            <button onClick={()=>{closeMyLists()}}>닫기</button></>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='detailinfo-mylists-item'>
                            아직 생성된 플리가 없는 것 같아요 🥺
                            <br /><br />
                            <div className='detailinfo-addPlaceListsBox' ref={addPlaceListFormRef}>

                            </div>
                            {addPlaceListFormRef.current && addPlaceListFormRef.current.style.display === 'block' ? null : (
                                <button className='addPlaceListsBtn' onClick={addPlaceLists}>여기서 플리 추가하기!</button>
                            )}
                        </div>
                    )}
                </div>
                <div className='detailinfo-modal'>
                    {
                        (currentPlace && currentPlace.basicInfo && currentPlace.basicInfo.placenamefull) ? (
                            <>
                                <div className='detailinfo-window-title'>
                                    <button className='detailinfo-closeButton' onClick={onClose}>
                                        <img src={closeIcon} alt="Close" />
                                    </button>
                                </div>
                                <div className='detailinfo-imgContainer'>
                                    {currentPlace.basicInfo?.mainphotourl ? (
                                        <img className='detailinfo-img' src={currentPlace.basicInfo.mainphotourl} alt="Place" />
                                    ) : (
                                        <img className='detailinfo-img' src={noimages} alt="No images" />
                                    )}
                                </div>
                                <div className='detailinfo-title'>
                                    {currentPlace.basicInfo?.placenamefull}
                                </div>
                                <div className='detailinfo-title-intro'>
                                    {currentPlace.basicInfo?.introduction || ' '}
                                </div>
                                <div className='detailinfo-listbtnbar'>

                                    {
                                        loginUser.email && (
                                            currentPath.includes("/placelistSearchresults") ||
                                            currentPath.includes("/favoriteplacelists") ||
                                            currentPath.includes("/searchResult")
                                        ) ? (
                                            <>
                                                <div className='detailinfo-btn-listadd'>
                                                    <span id='detailinfoMSG'>내 리스트에 추가하기</span>
                                                    <button onMouseOver={msgVisibleTrue} onMouseOut={msgVisibleFalse} onClick={addToMyLists}>
                                                        <img src={ListIcon} alt='' />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            currentPath.includes("/placeList") && (
                                                <>
                                                    <div className='detailinfo-btn-listadd'>
                                                        <span id='detailinfoMSG2'>내 리스트에 추가하기</span>
                                                        <button onMouseOver={msg2VisibleTrue} onMouseOut={msg2VisibleFalse} onClick={addToMyLists}>
                                                            <img src={ListIcon} alt='' />
                                                        </button>
                                                    </div>
                                                    <div className='detailinfo-btn-listadd'>
                                                        {/* 이미 목록에 있는 장소면 버튼 안뜨게 해야될듯..ㅜ */}
                                                        <span id='detailinfoMSG'>현재 선택중인 리스트에 추가하기</span>
                                                        <button onMouseOver={msgVisibleTrue} onMouseOut={msgVisibleFalse} onClick={addToSelectedLists}>
                                                            <img src={AddIcon} alt='' />
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        )
                                    }


                                    <div className='detailinfo-btn-reviewwrite'>
                                        {
                                            (loginUser.email) && (
                                                <>
                                                    <span id='reviewwriteMSG'>이 장소에 리뷰 작성하기</span>
                                                    <button onMouseOver={reviewmsgVisibleTrue} onMouseOut={reviewmsgVisibleFalse} onClick={wrtieReview}>
                                                        <img src={WriteIcon} alt='' />
                                                    </button>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='detailinfo-maincontent-box'>
                                    <div id='detailinfoToggleBtn' onClick={toggleInfos} className='detailinfo-toggle-btn'>
                                        🔍 가게 정보
                                    </div>
                                    <div className='detailinfo-infos'>

                                        {
                                            isBasicInfoOpen && (
                                                <div id='infoToggles' className='detailinfo-infos-to-toggle'>
                                                    <div className='detailinfo-fields'>
                                                        <div className='detailinfo-labels'>주소</div>
                                                        <div className='detailinfo-contents' style={{ textAlign: 'left' }}>
                                                            <>
                                                                {currentPlace.basicInfo && currentPlace.basicInfo.address ? (
                                                                    <>
                                                                        {currentPlace.basicInfo.address.region && currentPlace.basicInfo.address.region.newaddrfullname ? currentPlace.basicInfo.address.region.newaddrfullname : ''}
                                                                        {currentPlace.basicInfo.address.newaddr && currentPlace.basicInfo.address.newaddr.newaddrfull ? ' ' + currentPlace.basicInfo.address.newaddr.newaddrfull : ''}
                                                                        {currentPlace.basicInfo.address.addrdetail ? ' ' + currentPlace.basicInfo.address.addrdetail : ''}
                                                                        {currentPlace.basicInfo.address.newaddr && currentPlace.basicInfo.address.newaddr.bsizonno ? (
                                                                            <>
                                                                                <br />
                                                                                {'(우편번호) ' + currentPlace.basicInfo.address.newaddr.bsizonno}
                                                                            </>
                                                                        ) : ''}
                                                                    </>
                                                                ) : (
                                                                    '주소 정보 없음'
                                                                )}
                                                            </>
                                                        </div>
                                                    </div>
                                                    <div className='detailinfo-fields'>
                                                        <div className='detailinfo-labels'>전화번호</div>
                                                        <div className='detailinfo-contents'>
                                                            {currentPlace.basicInfo?.phonenum ? (
                                                                currentPlace.basicInfo.phonenum
                                                            ) : '전화번호 없음'}
                                                        </div>
                                                    </div>
                                                    <div className='detailinfo-fields'>
                                                        <div className='detailinfo-labels'>
                                                            홈페이지
                                                        </div>
                                                        <div className='detailinfo-contents'>
                                                            {currentPlace.basicInfo.homepage ? (
                                                                <a href={currentPlace.basicInfo.homepage}>{currentPlace.basicInfo.homepage}</a>
                                                            ) : '홈페이지 정보 없음'}
                                                        </div>
                                                    </div>
                                                    <div className='detailinfo-fields'>
                                                        <div className='detailinfo-labels'>시설 정보</div>
                                                        <div className='detailinfo-contents'>
                                                            {currentPlace.basicInfo?.facilityInfo?.wifi === 'Y' ? '와이파이 O' : '와이파이 X'} &nbsp;
                                                            {currentPlace.basicInfo?.facilityInfo?.pet === 'Y' ? '반려동물 O' : '반려동물 X'} &nbsp;
                                                            {currentPlace.basicInfo?.facilityInfo?.parking === 'Y' ? '주차 O' : '주차 X'} &nbsp;
                                                            {currentPlace.basicInfo?.facilityInfo?.fordisabled === 'Y' ? '휠체어 O' : '휠체어 X'} &nbsp;
                                                        </div>
                                                    </div>
                                                    <div onClick={menuinfoToggle} id='menuToggleBTN' className='detailinfo-labels-toggle'>📋 메뉴 정보</div>
                                                    {
                                                        isMenuOpen && (
                                                            <div id='menuinfoToggles' className='detailInfo-menulist'>
                                                                {currentPlace.menuInfo?.menuList?.length > 0 ? (
                                                                    currentPlace.menuInfo.menuList.map((menuItem, index) => (
                                                                        <div className='detailInfo-menucard' key={index}>
                                                                            <div className='detailinfo-menuImgContainer'>
                                                                                {menuItem.img ? (
                                                                                    <img src={menuItem.img} alt={menuItem.menu} />
                                                                                ) : <img src={noimages} />}
                                                                            </div>
                                                                            <div>{menuItem.menu}</div>
                                                                            <div>{menuItem.price}</div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    '메뉴 정보 없음'
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className='detailinfo-reviewinfos'>

                                            {
                                                (reviewlist && reviewlist.length > 0 && reviewInfo && reviewInfo.reviewCount !== 0 && reviewInfo.avgRates !== null) ? (
                                                    <>
                                                        <div className='detailinfo-reviewinfos-contents'>
                                                            <div className='detailinfo-reviewinfo-avgrates'>
                                                                {reviewInfo.avgRates ? reviewInfo.avgRates.toFixed(1) : '정보 없음'}
                                                            </div>
                                                            <div className='detailinfo-reviewinfo-stars'>
                                                                {renderStars(reviewInfo.avgRates)}
                                                            </div>
                                                        </div>

                                                        <div className='detailinfo-reviewlists-container'>
                                                            <div className='detailinfo-reviewinfos-reviewCounts'>
                                                                {'총 ' + reviewInfo.reviewCount + ' 개의 리뷰가 있어요 📝'}
                                                            </div>
                                                            {reviewlist.map((review) => {
                                                                return (
                                                                    <div className='detailinfo-reviewlists-card' key={review.id}>
                                                                        <div className='detailinfo-reviewlists-contentbox'>
                                                                            <div className='detailinfo-reviewlists-writer'>
                                                                                {review.nickname}
                                                                            </div>
                                                                            <div className='detailinfo-reviewlists-stars'>
                                                                                {renderStars(review.rates)}
                                                                            </div>
                                                                            <div className='detailinfo-reviewlists-content'>
                                                                                {review.content}
                                                                            </div>
                                                                        </div>
                                                                        <div className='detailinfo-reviewlists-image'>
                                                                            <img src={review.savefilename} alt="" />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}

                                                        </div>

                                                    </>
                                                ) : (
                                                    <>
                                                        리뷰 정보 없음
                                                    </>
                                                )
                                            }

                                        </div>
                                    </div>

                                </div>
                            </>
                        ) : (null)
                    }
                </div>
                {/* 리뷰 작성 창 모달 */}
            </div>
        </div>
    );

}

export default DetailInfo;
