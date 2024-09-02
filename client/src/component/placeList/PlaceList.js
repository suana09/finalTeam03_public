import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../style/PlaceList/PlaceList.css';
import { useNavigate } from 'react-router-dom';
import authAxios from '../../util/jwtUtil';

import Header from '../HeaderFooter/Header';
import MapComponent from '../map/MapComponent';
import SearchComponent from '../map/SearchComponent';
import PlaceListSideBar from './PlaceListSideBar';
import MapSideBar from '../map/MapSideBar';

import prevIcon from '../../images/icons/arrow-prev.png'
import nextIcon from '../../images/icons/arrow-next.png'

function PlaceList() {
    const loginUser = useSelector(state => state.user);

    const [placeLists, setPlaceLists] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [mapCenter, setMapCenter] = useState({ y: 37.5665, x: 126.978 });
    const [restaurants, setRestaurants] = useState([]);
    const [mappedRestaurants, setMappedRestaurants] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [placeListChange, setPlaceListChange] = useState(false);
    const [placeChange, setPlaceChange] = useState(false);

    const [page, setPage] = useState(1);
    const [placePage, setPlacePage] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
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
        authAxios.get('/api/placelist/my', {
            params: {
                writer: loginUser.email
            }
        })
            .then(response => {
                setPlaceLists(response.data);
                if (response.data.length > 0) {
                    const results = response.data;
                    setSelectedPlaceId(results[0].id);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [loginUser.email, placeListChange]);

    // 맛집 목록 가져오기
    useEffect(() => {
        if (selectedPlaceId !== null) {
            authAxios.get(`/api/placelist/place/${selectedPlaceId}`, { params: { page: placePage } })
                .then(response => {
                    const places = response.data.content;
                    const mapped = places.map(places => ({
                        place_id: places.id,
                        place_name: places.pname,
                        x: parseFloat(places.longitude),
                        y: parseFloat(places.latitude),
                        address_name: places.address,
                        category_name: places.categoryName,
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
    }, [selectedPlaceId, placeChange, placePage]);



    //----------------- 프롭스 관련 함수

    // 서치컴포넌트에서 검색 결과를 전달받기 위한 콜백 함수
    const handleResults = (results, avgCoords, isEndFlag) => {
        setSelectedPlace(null);
        setMappedRestaurants(results);
        setSearchResults(prevResults => [...prevResults, ...results]);

        if (avgCoords) {
            setMapCenter({ x: avgCoords.avgX, y: avgCoords.avgY });
        }

        setIsEnd(isEndFlag);  // is_end 값을 상태로 설정
    };

    const clearResults = () => {
        setSearchResults([]);
    };

    // 리스트 사이드바에서 선택된 리스트를 전달받기 위한 콜백 함수
    const handleSelectPlaceList = (id) => {
        setSearchResults([]);
        setSelectedPlace(null);
        setSelectedPlaceId(id);
    };

    // 장소 클릭할 때 맵컴포넌트에 장소를 상태로 전달
    const handleSelectPlaceCard = (place) => {
        setSelectedPlace(place);
    };

    // 맵사이드바에서 선택된 장소를 전달받기 위한 콜백 함수
    const handleSelectPlaceFromSidebar = (place) => {
        setSelectedPlace(place);
    };

    // 맵사이드바에서 스크롤 이벤트가 일어나면 페이지를 다음 페이지로 설정하기 위한 콜백 함수
    const handleFetchNextPage = () => {
        if (!isEnd) { // 더 가져올 데이터가 있을 때만 페이지를 증가시킴
            setPage(prevPage => prevPage + 1);
        } else {
            setPage(1);
        }
    };

    // 플리 사이드바에서 플리 변경점 발생시 플리 재조회를 위한 콜백 함수
    const handleChangePlaceList = () => {
        setPlaceListChange(!placeListChange);
    }

    // 맛플리에 장소 추가/변경 시 변경점 디테일인포 > 맵컴포넌트 > 현재컴포넌트까지 상태로 끌어올려서 리렌더링
    const handleChanglePlace = () => {
        setPlaceChange(!placeChange);
    }

    //----------------- 플레이스리스트 컴포넌트 단독 함수

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
                        <SearchComponent
                            onResults={handleResults}
                            page={page}
                            onFetchNextPage={(nextPage) => handleFetchNextPage(nextPage)}
                            clearResults={clearResults}
                        />
                        <div className='placelist-map-container'>
                            {(mappedRestaurants.length > 0) ? (
                                <MapComponent
                                    className='search-result-kakaomap'
                                    searchResults={mappedRestaurants}
                                    mapCenter={mapCenter}
                                    selectedPlace={selectedPlace}
                                    selectedListId={selectedPlaceId}
                                    onChangePlace={handleChanglePlace}
                                />
                            ) : null}
                            <div className="placelist-place-container">
                                <div className='placelist-placeslider-pagebtn'>

                                    <button onClick={handlePlaceSliderPrev} disabled={!isPrevAble}>
                                        <img src={prevIcon} alt="" style={{opacity: isPrevAble ? 1 : 0.2}} />
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
                                                            <img src={`${(restaurant.image !== '') ? (restaurant.image) : ('/api/images/noimages.png') }`} alt="" />
                                                        </div>
                                                        <div className="placelist-place-card-name">{restaurant.pname}</div>
                                                        <div className="placelist-place-card-btn">
                                                            <button onClick={(e) => handleDeleteClick(e, selectedPlaceId, restaurant.id)}>삭제
                                                            </button>
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
                                        <img src={nextIcon} alt="" style={{opacity: isNextAble ? 1 : 0.2}}  />
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        (searchResults && searchResults.length > 0) ? (
                            <MapSideBar
                                searchResults={searchResults}
                                onSelectPlace={handleSelectPlaceFromSidebar}
                                onScroll={() => handleFetchNextPage(page + 1)}
                            />
                        ) : (null)
                    }
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default PlaceList;
