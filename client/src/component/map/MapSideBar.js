import React, { useEffect, useRef } from 'react';
import '../../style/map/mapsidebar.css';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

function MapSideBar({ searchResults, onSelectPlace, onScroll }) {
    const containerRef = useRef(null);

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

    const handleClick = (result) => {
        if (onSelectPlace) {
            onSelectPlace(result);
        }
    };

    return (
        <div className='map-sidebar-container' ref={containerRef}>
            <div className='map-sidebar-inner-container'>
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
