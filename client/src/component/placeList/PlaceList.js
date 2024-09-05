import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../style/PlaceList/PlaceList.css';
import authAxios from '../../util/jwtUtil';

import Header from '../HeaderFooter/Header';
import MapComponent from '../map/MapComponent';
import MapSideBar from '../map/MapSideBar';
import SearchComponent from '../map/SearchComponent';
import PlaceListSideBar from './PlaceListSideBar';
import Sidebar from '../HeaderFooter/Sidebar';

import nextIcon from '../../images/icons/arrow-next.png';
import prevIcon from '../../images/icons/arrow-prev.png';

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
    const [selectedPlaceList, setSelectedPlaceList] = useState({});
    const [isPliSbVisible, setIsPliSbVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMapSidebarVisible, setIsMapSidebarVisible] = useState(true);


    const [page, setPage] = useState(1);
    const [placePage, setPlacePage] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [isPrevAble, setIsPrevAble] = useState(false);
    const [isNextAble, setIsNextAble] = useState(false);


    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);


    const navigate = useNavigate();

    useEffect(() => {
        if (!loginUser.email) {
            alert("로그인이 필요한 서비스입니다 💧");
            navigate('/login');
        }
    }, [loginUser.email, navigate])

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
            authAxios.get(`/api/placelist/place/${selectedPlaceId}`, { params: { page: placePage, size: isMobile ? 1 : 4 } })
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
    const handleSelectPlaceList = (list) => {
        setSearchResults([]);
        setSelectedPlace(null);
        setSelectedPlaceList(list);
        setSelectedPlaceId(list.id);
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

    const togglePliSideBar = (param) => {
        if (param !== undefined) {
            setIsPliSbVisible(param);
        } else {
            setIsPliSbVisible(!isPliSbVisible);
        }
    }

    const handlePlaceSliderVisibility = (param) => {
        if (isMobile){
            if (param !== undefined){
                setIsListVisible(param);
            } else {
                setIsListVisible(!isListVisible);
            }
        }
    }

    const handleChangeMsbVisibility = (param) => {
        if (isMobile) {
            if (param !== undefined) {
                setIsMapSidebarVisible(param);
            } else {
                setIsMapSidebarVisible(!isMapSidebarVisible);
            }
        }
    }

    const handleChangePsbVisibility = () => {
        if (isMobile) {
            togglePliSideBar(false);
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

    const toggleMsb = () => {
        setIsMapSidebarVisible(!isMapSidebarVisible)
    }


    return (
        <div className='placelist-main'>
            <div className='placelist-main-container'>
                <div className='placelist-header'>
                    <Header />
                </div>

                <div className="placelist-main-inner-container">
                    {(placeLists) && (
                        (
                            <PlaceListSideBar
                                myLists={placeLists}
                                onSelectPlaceList={handleSelectPlaceList}
                                onChangePlaceList={handleChangePlaceList}
                                sbVisiablityByToggle={isPliSbVisible}
                                onChangePliSbVisibility={handleChangePsbVisibility}
                            />
                        )

                    )}
                    <div className="placelist-middle-container">
                        <div className='placelist-place-selecteplace-banner'>
                            {
                                (selectedPlaceList && selectedPlaceList.listName) && (
                                    <>나의 플리 보기&nbsp;&nbsp;&gt;&nbsp;&nbsp;{selectedPlaceList.listName}</>
                                )
                            }
                        </div>
                        <div className='placelist-place-selectplace-togglebtn'>
                            {/* <button onClick={() => { togglePliSlider() }}>플리별 장소</button> */}
                            {
                                (searchResults && searchResults.length > 0) && (
                                    <button onClick={() => { toggleMsb() }}>검색결과</button>
                                )
                            }
                        </div>
                        <div className='placelist-upper-container'>
                            <SearchComponent
                                onResults={handleResults}
                                page={page}
                                onFetchNextPage={(nextPage) => handleFetchNextPage(nextPage)}
                                clearResults={clearResults}
                                onChangePlaceSliderVisibility={handlePlaceSliderVisibility}
                                onChangeMapSidebarVisibility={handleChangeMsbVisibility}
                            />
                            {
                                (isMobile) && (
                                    <Sidebar />
                                )
                            }
                        </div>
                        <div className={`placelist-map-container ${!isListVisible ? 'heightFull' : ''}`}
                        >
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
                                    selectedListId={selectedPlaceId}
                                    onChangePlace={handleChanglePlace}
                                    onChangePlaceSliderVisibility={handlePlaceSliderVisibility}
                                />
                            ) : null}
                            {
                                (isListVisible) && (
                                    <div className="placelist-place-container">
                                        <div className='placelist-place-middle-container'>
                                            <div className='placelist-place-container-title'>
                                                선택중인 맛플리에 저장된 장소들 🗺️
                                            </div>
                                            <div className="placelist-place-slider">
                                                <div className='placelist-placeslider-pagebtn'>

                                                    <button onClick={handlePlaceSliderPrev} disabled={!isPrevAble}>
                                                        <img src={prevIcon} alt="" style={{ opacity: isPrevAble ? 1 : 0.2 }} />
                                                    </button>
                                                </div>
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
                                                                    <button onClick={(e) => handleDeleteClick(e, selectedPlaceId, restaurant.id)}>삭제
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>맛집 목록이 없습니다.</p>
                                                )}
                                                <div className='placelist-placeslider-pagebtn'>

                                                    <button onClick={handlePlaceSliderNext} disabled={!isNextAble}>
                                                        <img src={nextIcon} alt="" style={{ opacity: isNextAble ? 1 : 0.2 }} />
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {
                        (searchResults && searchResults.length > 0 && isMapSidebarVisible) ? (
                            <MapSideBar
                                searchResults={searchResults}
                                onSelectPlace={handleSelectPlaceFromSidebar}
                                onScroll={() => handleFetchNextPage(page + 1)}
                                onChangeMapSidebarVisibility={handleChangeMsbVisibility}
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
