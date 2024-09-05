import React, { useEffect, useRef, useState } from 'react';
import '../../style/map/mapsidebar.css';
import closeIcon from '../../images/icons/close.png'
import upIcon from '../../images/icons/arrow-up.png'

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

function MapSideBar({ searchResults, onSelectPlace, onScroll, onChangeMapSidebarVisibility }) {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);



    useEffect(() => {
        const handleScroll = debounce(() => {
            const container = containerRef.current;
            if (container) {
                const { scrollTop, scrollHeight, clientHeight } = container;

                if (scrollTop + clientHeight >= scrollHeight - 50) {
                    if (onScroll) {
                        onScroll();
                    }
                }
            }
        }, 300);

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [onScroll, searchResults]);


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


    const handleClick = (result) => {
        if (onSelectPlace) {
            onSelectPlace(result);
            onChangeMapSidebarVisibility(false);
        }
    };

    const closeMapSb = () => {
        onChangeMapSidebarVisibility(false);
    }

    const toTop = () => {
        const scrollElement = containerRef.current;

        if (!scrollElement) return;

        const scrollStep = -scrollElement.scrollTop / 15;
        const scrollInterval = setInterval(() => {
            if (scrollElement.scrollTop !== 0) {
                scrollElement.scrollTop += scrollStep;
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    };

    return (
        <div className='map-sidebar-container' ref={containerRef}>
            <div className='map-sidebar-inner-container'>
                <div className='map-sidebar-settopbtn'>
                    <button onClick={() => { toTop() }}>
                        <img src={upIcon} alt="" />
                    </button>
                </div>
                {
                    (isMobile) && (
                        <div className='map-sidebar-window'>
                            <button onClick={() => { closeMapSb() }}>
                                <img src={closeIcon} alt="" />
                            </button>
                        </div>
                    )
                }
                {searchResults && searchResults.length > 0 ? (
                    searchResults.map(result => (
                        <div className='map-sidebar-place' onClick={() => handleClick(result)} key={result.place_id}>
                            <div className='map-sidebar-place-name'>{result.place_name}</div>
                            <div className='map-sidebar-place-address'>{result.address_name}</div>
                            <div className='map-sidebar-place-category'>{result.category_name}</div>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>

        </div>
    );
}

export default MapSideBar;
