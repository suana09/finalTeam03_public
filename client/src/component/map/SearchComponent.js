import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../style/search/searchbar.css';

function SearchComponent({ onResults, page, clearResults, onSearchParams, searchParams }) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [minRate, setMinRate] = useState(null);
    const [minReview, setMinReview] = useState(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [useLocationSearch, setUseLocationSearch] = useState(false);
    const [initialSearchKeyword, setInitialSearchKeyword] = useState('');
    const [initialUseLocationSearch, setInitialUseLocationSearch] = useState(false);

    useEffect(()=>{
        if (searchParams) {
            setInitialSearchKeyword(searchParams.keyword);
            setInitialUseLocationSearch(searchParams.useLocationSearch);
            handleSearch(2);
        }
    }, [searchParams])


    const location = useLocation();
    const currentPath = location.pathname;

    const apiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;

    const query = () => {
        if (initialUseLocationSearch && !initialSearchKeyword) {  
            return '맛집';
        } else if (initialUseLocationSearch && initialSearchKeyword){
            return initialSearchKeyword + ' 맛집';
        } else if (!initialUseLocationSearch && initialSearchKeyword) {
            return initialSearchKeyword + ' 맛집';
        } else if (useLocationSearch && !searchKeyword){
            return '맛집'
        }  else if (useLocationSearch && searchKeyword){
            return searchKeyword + ' 맛집';
        } else if (!useLocationSearch && searchKeyword) {
            return searchKeyword + ' 맛집';
        }
        return '맛집';
    };

    const handleSearch = async (page) => {
        if ((!initialSearchKeyword && !initialUseLocationSearch) && (!searchKeyword && !useLocationSearch)) {
            return;
        }

        const getCurrentPosition = () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position.coords),
                    (error) => reject(error)
                );
            });
        };

        try {
            const { latitude, longitude } = await getCurrentPosition();


            const results = [];
            let isEnd;

            const params = {
                query: query(),
                x: longitude,
                y: latitude,
                radius: useLocationSearch ? 2000 : undefined,
                sort: useLocationSearch ? "distance" : "accuracy",
                page,
                size: 10,
            };
            console.log("요청");
            const { data } = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
                headers: {
                    Authorization: `KakaoAK ${apiKey}`
                },
                params: params
            });

            if (data.documents) {
                const dataResults = data.documents.map(doc => ({
                    place_id: doc.id,
                    place_name: doc.place_name,
                    x: parseFloat(doc.x),
                    y: parseFloat(doc.y),
                    address_name: doc.address_name,
                    category_name: doc.category_name
                }));

                results.push(...dataResults);
            }
            
            isEnd = data.meta.is_end;


            const avgX = results.length > 0 ? results[0].x : null;
            const avgY = results.length > 0 ? results[0].y : null;


            if (isEnd) {
                setUseLocationSearch(false);
                setSearchKeyword("");
                setInitialSearchKeyword('');
                setInitialUseLocationSearch(false);
            }

            if (currentPath === ('/')){
                onSearchParams(searchKeyword, useLocationSearch, results, isEnd);
            }
            onResults(results, {avgX, avgY}, isEnd);

        } catch (error) {
            console.error('API 요청 실패:', error);
        }
    };



    //----------------- 페이징 관련
    const handleSearchClick = async () => {
        clearResults();
        setUseLocationSearch(false);
        await handleSearch(1); // 검색 버튼 클릭 시 첫 페이지로 검색
    };

    useEffect(() => {
        handleSearch(page);
    }, [page]);

    //--------------- 내 위치 기반 검색 관련
    const searchByCurrentLoc = async () => {
        clearResults();
        setUseLocationSearch(true);
        setSearchKeyword("");
    };

    useEffect(() => {
        if (useLocationSearch) {
            handleSearch(1);
        }
    }, [useLocationSearch]);

    //--------------- 필터창 관련
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'rating':
                setMinRate(Number(value));
                break;
            case 'reviews':
                setMinReview(Number(value));
                break;
            default:
                break;
        }
    };

    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className='search-bar-container'>
            <div className='search-bar-window'>
                <div className='search-bar-filter-icon'>
                    {/* <img src={filterImage} alt="필터 아이콘" onClick={toggleFilterVisibility} /> */}
                </div>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="검색어를 입력하세요"
                />
                <button onClick={handleSearchClick}>검색</button>
                <button onClick={searchByCurrentLoc}>주변 검색</button>
            </div>
            <div id='searchFilterWindow' className={`search-filter-section ${isFilterVisible ? 'active' : ''}`}>
                <div className="search-filter-popup">
                    <div className="search-filter-options">
                        <div className="search-filter-option">
                            <div className='search-filter-option-label'>평균 별점</div>
                            <div>
                                <input type="radio" name="rating" value={4} checked={minRate === 4} onChange={handleFilterChange} /> 4개 이상
                            </div>
                            <div>
                                <input type="radio" name="rating" value={3} checked={minRate === 3} onChange={handleFilterChange} /> 3-4개
                            </div>
                            <div>
                                <input type="radio" name="rating" value={2} checked={minRate === 2} onChange={handleFilterChange} /> 2-3개
                            </div>
                            <div>
                                <input type="radio" name="rating" value={1} checked={minRate === 1} onChange={handleFilterChange} /> 2개 미만
                            </div>
                        </div>
                        <div className="search-filter-option">
                            <div className='search-filter-option-label'>리뷰 개수</div>
                            <div>
                                <input type="radio" name="reviews" value={100} checked={minReview === 100} onChange={handleFilterChange} /> 100개 이상
                            </div>
                            <div>
                                <input type="radio" name="reviews" value={50} checked={minReview === 50} onChange={handleFilterChange} /> 50개 이상
                            </div>
                            <div>
                                <input type="radio" name="reviews" value={10} checked={minReview === 10} onChange={handleFilterChange} /> 10개 이상
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;
