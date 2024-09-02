import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../style/PlaceList/PlaceList.css';
import { useNavigate } from 'react-router-dom';
import authAxios from '../../util/jwtUtil';

import Header from '../HeaderFooter/Header';
import MapComponent from '../map/MapComponent';
import PlaceListSideBar from './PlaceListSideBar';

import prevIcon from '../../images/icons/arrow-prev.png'
import nextIcon from '../../images/icons/arrow-next.png'


function MyFavoritePlaceList() {
    const loginUser = useSelector(state => state.user);

    const [placeLists, setPlaceLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [selectedList, setSelectedList] = useState(null);
    const [mapCenter, setMapCenter] = useState({ y: 37.5665, x: 126.978 });
    const [restaurants, setRestaurants] = useState([]);
    const [mappedRestaurants, setMappedRestaurants] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeListChange, setPlaceListChange] = useState(false);
    const [placeChange, setPlaceChange] = useState(false);

    const [placePage, setPlacePage] = useState(0);
    const [isPrevAble, setIsPrevAble] = useState(false);
    const [isNextAble, setIsNextAble] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loginUser.email) {
            alert("로그인이 필요한 서비스입니다 💧");
            navigate('/login');
        }
    }, [loginUser.email, navigate])

    // 내 맛플리 목록 가져오기
    useEffect(() => {
        authAxios.get('/api/placelist/fav', {
            params: {
                email: loginUser.email
            }
        })
            .then(response => {
                setPlaceLists(response.data);
                if (response.data.length > 0) {
                    const results = response.data;
                    setSelectedList(results[0]);
                    setSelectedListId(results[0].id);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [loginUser.email, placeListChange]);

    // 맛집 목록 가져오기
    useEffect(() => {
        if (selectedListId !== null) {
            authAxios.get(`/api/placelist/place/${selectedListId}`)
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
                })
                .catch(error => {
                    console.error('맛집 목록을 가져오는 데 실패했습니다:', error);
                });
        }
    }, [selectedListId, placeChange]);

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

    // 맵사이드바에서 플리 변경점 발생시 플리 재조회를 위한 콜백 함수
    const handleChangePlaceList = () => {
        setPlaceListChange(!placeListChange);
    }

    //맛플리에 장소 추가/변경 시 변경점 디테일인포 > 맵컴포넌트 > 현재컴포넌트까지 상태로 끌어올려서 리렌더링
    const handleChanglePlace = () => {
        setPlaceChange(!placeChange);
    }

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


    return (
        <div className='placelist-main'>
            <div className='placelist-main-container'>
                <Header />
                <div className="placelist-main-inner-container">
                    {placeLists && (
                        <PlaceListSideBar
                            myLists={placeLists}
                            onSelectPlaceList={handleSelectPlaceList}
                            onChangePlaceList={handleChangePlaceList}
                        />
                    )}
                    <div className="placelist-middle-container">
                        <div className='placelist-map-container' style={{ height: "75%" }}>
                            {(mappedRestaurants.length > 0) ? (
                                <MapComponent
                                    className='search-result-kakaomap'
                                    searchResults={mappedRestaurants}
                                    mapCenter={mapCenter}
                                    selectedPlace={selectedPlace}
                                    selectedListId={selectedListId}
                                    onChangePlace={handleChanglePlace}
                                />
                            ) : null}
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
                                                        <div className="placelist-place-card-name">{restaurant.pname}</div>
                                                        <div className="placelist-place-card-btn">
                                                            {
                                                                (selectedList.writer === loginUser.email) && (
                                                                    <button onClick={(e) => handleDeleteClick(e, selectedListId, restaurant.id)}>삭제
                                                                    </button>
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
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default MyFavoritePlaceList
