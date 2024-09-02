import React, { useState, useEffect } from 'react';
import '../../style/map/map.css';
import { useLocation } from 'react-router-dom';
import MapComponent from '../map/MapComponent';
import SearchComponent from '../map/SearchComponent';
import MapSideBar from '../map/MapSideBar';
import Header from '../HeaderFooter/Header';
import '../../style/place/search-result.css'


function SearchResult() {
    const location = useLocation();
    const { initialSearchResults, searchParams } = location.state || { initialSearchResults: [], searchParams: { keyword: '', useLocationSearch: false } };

    const [mapCenter, setMapCenter] = useState({ y: 37.5665, x: 126.978 });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        if (location.state?.initialSearchResults) {
            setSearchResults(location.state.initialSearchResults);
        }
    }, [location.state]);

    // 검색 결과 초기화
    const clearResults = () => {
        setSearchResults([]);
        setPage(1);
        setIsEnd(false);
    };
    
    // 페이징
    const handleResults = (results, avgCoords, isEndFlag) => {
        setSearchResults(prevResults => [...prevResults, ...results]);
        setMapCenter(avgCoords ? { x: avgCoords.avgX, y: avgCoords.avgY } : mapCenter);
        setIsEnd(isEndFlag);
    };

    // 페이징 +1
    const handleFetchNextPage = () => {
        if (!isEnd) {
            setPage(prevPage => prevPage + 1);
        } else {
            setPage(1);
        }
    };


    // 맵사이드바에서 선택된 장소를 전달받기 위한 콜백 함수
    const handleSelectPlaceFromSidebar = (place) => {
        setSelectedPlace(place);
    };







    return (
        <div className='search-result-container'>
            <Header />
            <SearchComponent
                onResults={handleResults}
                page={page}
                onFetchNextPage={(nextPage) => handleFetchNextPage(nextPage)}
                clearResults={clearResults}
                searchParams={searchParams}
            />
            <div className='search-result-middle-container'>
                <div className='search-result-mapContainer'>
                    <MapComponent 
                        className='search-result-kakaomap' 
                        searchResults={searchResults} 
                        selectedPlace={selectedPlace}
                        mapCenter={mapCenter} />
                </div>
                <div className='search-result-sidebar-container'>
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
        </div>
    );
}

export default SearchResult;
