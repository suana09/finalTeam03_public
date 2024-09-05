import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import authAxios from '../../util/jwtUtil';

import nextIcon from '../../images/icons/arrow-next.png';
import prevIcon from '../../images/icons/arrow-prev.png';
import Header from '../HeaderFooter/Header';
import Sidebar from '../HeaderFooter/Sidebar';
import MapComponent from '../map/MapComponent';
import PlaceListSideBar from './PlaceListSideBar';


function PlaceListSearchResults() {
    const loginUser = useSelector(state => state.user);
    const location = useLocation();
    const { results } = location.state || {};

    const [placeList, setPlaceList] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedList, setSelectedList] = useState(null);
    const [selectedListId, setSelectedListId] = useState(null);
    const [mapCenter, setMapCenter] = useState({ y: 37.5665, x: 126.978 });
    const [restaurants, setRestaurants] = useState([]);
    const [mappedRestaurants, setMappedRestaurants] = useState([]);
    const [isPliSbVisible, setIsPliSbVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);

    const [placePage, setPlacePage] = useState(0);
    const [isPrevAble, setIsPrevAble] = useState(false);
    const [isNextAble, setIsNextAble] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (results !== null && results.length > 0) {
            setPlaceList(results);
            setSelectedList(results[0]);
            setSelectedListId(results[0].id);
        } else {
            alert("맛플리 검색 결과가 없습니다. 😓");
            navigate('/searchpli');
        }
    }, [results, navigate])


    // 맛집 목록 가져오기
    useEffect(() => {
        if (selectedListId !== null) {
            axios.get(`/api/placelist/place/${selectedListId}`, { params: { page: placePage, size: isMobile ? 1 : 4 } })
                .then(response => {
                    const places = response.data.content;
                    const mapped = places.map(restaurant => ({
                        place_id: restaurant.id,
                        place_name: restaurant.pname,
                        x: parseFloat(restaurant.longitude),
                        y: parseFloat(restaurant.latitude),
                        address_name: restaurant.address,
                        category_name: restaurant.categoryName,
                    }));

                    setRestaurants(response.data.content);
                    setMappedRestaurants(mapped);
                    const avgX = mapped.reduce((sum, doc) => sum + doc.x, 0) / mapped.length;
                    const avgY = mapped.reduce((sum, doc) => sum + doc.y, 0) / mapped.length;
                    setMapCenter({ x: avgX, y: avgY });

                    setIsPrevAble(!response.data.first);
                    setIsNextAble(!response.data.last);
                })
                .catch(error => {
                    console.error('맛집 목록을 가져오는 데 실패했습니다:', error);
                });
        }
    }, [selectedListId, placePage]);

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

    if (!results) {
        return <div>No results found.</div>;
    }

    // 리스트 사이드바에서 선택된 리스트를 전달받기 위한 콜백 함수
    const handleSelectPlaceList = (list) => {
        setSelectedPlace(null);
        setSelectedList(list);
        setSelectedListId(list.id);
    };

    // 장소 클릭할 때 맵컴포넌트에 장소를 상태로 전달
    const handleSelectPlaceCard = (place) => {
        setSelectedPlace(place);
    };

    // 맛플리 장소 - 삭제 (아이템 전체 온클릭 이벤트의 전파 방지..)
    const handleDeleteClick = (e, listId, restaurantId) => {
        e.stopPropagation();
        onRemove(listId, restaurantId);
    };

    const onRemove = (listId, id) => {
        let ans = window.confirm("이 장소를 맛플리에서 제거하시겠어요?")
        if (ans) {
            authAxios.delete(`/api/placelist/place`, {
                params: {
                    listId,
                    placeId: id
                }
            })
                .then(response => {
                    // 맛집 목록에서 삭제된 아이템을 제거
                    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
                    alert("삭제되었습니다.");
                })
                .catch(error => {
                    console.error('맛집 삭제 실패..', error);
                });
        }
    }

    const handlePlaceSliderPrev = () => {
        setPlacePage(prevPage => prevPage - 1);
    }

    const handlePlaceSliderNext = () => {
        setPlacePage(prevPage => prevPage + 1);
    }

    const handleChangePlaceList = (id, method, updatedPli) => {
        // 맛플리가 삭제되었을때
        if (method === 'delete') {
            setPlaceList((prevPlaceList) =>
                prevPlaceList.filter(place => place.id !== id)
            );
        }

        // 맛플리가 수정되었을때
        if (method === 'put') {
            setPlaceList((prevPlaceList) =>
                prevPlaceList.map(place =>
                    place.id === id ? updatedPli : place
                ))
        }
    }

    const togglePliSideBar = (param) => {
        if (param !== undefined) {
            setIsPliSbVisible(param);
        } else {
            setIsPliSbVisible(!isPliSbVisible);
        }
    }

    // 모바일 사이드패널 swipe 
    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (endX - startX > 20) {
            togglePliSideBar();
        }
    };

    const togglePliSlider = () => {
        setIsListVisible(!isListVisible);
    }

    const handleChangePsbVisibility = () => {
        if (isMobile) {
            togglePliSideBar(false);
        }
    }

    const handlePlaceSliderVisibility = (param) => {
        if (isMobile) {
            if (param !== undefined) {
                setIsListVisible(param);
            } else {
                setIsListVisible(!isListVisible);
            }
        }
    }



    return (
        <div className='placelist-main'>
            <div className='placelist-main-container'>
                {
                    (!isMobile) && (
                        <Header />
                    )
                }
                <div className="placelist-main-inner-container">
                    {placeList && selectedListId && (
                        <PlaceListSideBar
                            myLists={placeList}
                            onSelectPlaceList={handleSelectPlaceList}
                            onChangePlaceList={handleChangePlaceList}
                            sbVisiablityByToggle={isPliSbVisible}
                            onChangePliSbVisibility={handleChangePsbVisibility}
                        />
                    )}
                    <div className="placelist-middle-container">
                        <div className='placelist-place-selecteplace-banner'>
                            {
                                (selectedList && selectedList.listName) && (
                                    <>나의 플리 보기&nbsp;&nbsp;&gt;&nbsp;&nbsp;{selectedList.listName}</>
                                )
                            }
                        </div>
                        <div className='placelist-upper-container' style={{ justifyContent: "flex-end" }}>
                            {
                                (isMobile) && (
                                    <Sidebar />
                                )
                            }
                        </div>
                        <div className='placelist-map-container' style={{ height: `${isMobile ? isListVisible? "70%" : "100%" : "75%"}` }}>
                            {
                                (isMobile) && (
                                    <div className='placelist-placelist-panelbtn'
                                        onClick={() => { togglePliSideBar() }}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <img src={nextIcon} alt="" />
                                    </div>
                                )
                            }
                            {(mappedRestaurants.length > 0) ? (
                                <MapComponent
                                    className='search-result-kakaomap'
                                    searchResults={mappedRestaurants}
                                    mapCenter={mapCenter}
                                    selectedPlace={selectedPlace}
                                    onChangePlaceSliderVisibility={handlePlaceSliderVisibility}
                                />
                            ) : null}
                            {(isListVisible) && (
                                <div className="placelist-place-container">
                                    <div className='placelist-placeslider-pagebtn'>

                                        <button onClick={handlePlaceSliderPrev} disabled={!isPrevAble}>
                                            <img src={prevIcon} alt="" style={{ opacity: isPrevAble ? 1 : 0.2 }} />
                                        </button>
                                    </div>
                                    <div className='placelist-place-middle-container'>
                                        <div className='placelist-place-container-title'>
                                            선택중인 맛플리에 저장된 장소들 🗺️
                                        </div>
                                        <div className="placelist-place-slider">
                                            {restaurants.length > 0 ? (
                                                <div className="placelist-place-cards">
                                                    {restaurants.map((restaurant, idx) => (
                                                        <div className="placelist-place-card" key={restaurant.id - 1} onClick={() => handleSelectPlaceCard({
                                                            place_id: restaurant.id,
                                                            place_name: restaurant.pname,
                                                            x: parseFloat(restaurant.longitude),
                                                            y: parseFloat(restaurant.latitude),
                                                            address_name: restaurant.address,
                                                            category_name: restaurant.categoryName,
                                                        })}>
                                                            <div className='placelist-place-card-image'>
                                                                <img src={`${(restaurant.image !== '') ? (restaurant.image) : ('/api/images/noimages.png')}`} alt="" />
                                                            </div>
                                                            {
                                                                (isMobile) && (
                                                                    <div className='placelist-place-card-imgoverlay'>
                                                                    </div>
                                                                )
                                                            }
                                                            <div className="placelist-place-card-name">{restaurant.pname}</div>
                                                            <div className="placelist-place-card-btn">
                                                                {(loginUser && loginUser.email && loginUser.email === selectedList.writer) && (
                                                                    <button onClick={(e) => handleDeleteClick(e, selectedListId, restaurant.id)}>삭제</button>
                                                                )

                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>맛집 목록이 없습니다.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='placelist-placeslider-pagebtn'>

                                        <button onClick={handlePlaceSliderNext} disabled={!isNextAble}>
                                            <img src={nextIcon} alt="" style={{ opacity: isNextAble ? 1 : 0.2 }} />
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceListSearchResults