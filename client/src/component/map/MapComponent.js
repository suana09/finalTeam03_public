import React, { useEffect, useRef, useState } from 'react';
import markerImageSrc from '../../images/map-marker-yellow.png';
import DetailInfo from './DetailInfo';
import '../../style/map/map.css';

function MapComponent({ searchResults, selectedPlace, selectedListId, onChangePlace }) {
    const mapContainer = useRef(null);
    const [selectedPlaceMap, setSelectedPlaceMap] = useState(selectedPlace);
    const detailInfoRef = useRef(null);
    const markers = useRef([]);
    const mapInstanceRef = useRef(null);
    const selectedMarkerRef = useRef(null);
    const selectedOverlayRef = useRef(null);

    const MAX_DISTANCE_BETWEEN_MARKERS = 10000; // 5km (필요에 따라 조정 가능)

    // 두 지점 간의 거리를 계산하는 함수 (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // 지구 반지름 (미터)
        const radLat1 = lat1 * Math.PI / 180;
        const radLat2 = lat2 * Math.PI / 180;
        const deltaLat = (lat2 - lat1) * Math.PI / 180;
        const deltaLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // 두 지점 간 거리 (미터)
    };

    // 검색 결과에 따른 마커와 커스텀 오버레이 설정
    useEffect(() => {
        const loadKakaoMap = () => {
            return new Promise((resolve, reject) => {
                if (window.kakao) {
                    resolve(window.kakao);
                } else {
                    const kakaoMapScript = document.createElement('script');
                    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
                    kakaoMapScript.async = true;
                    kakaoMapScript.onload = () => {
                        window.kakao.maps.load(() => {
                            resolve(window.kakao);
                        });
                    };
                    kakaoMapScript.onerror = reject;
                    document.head.appendChild(kakaoMapScript);
                }
            });
        };

        loadKakaoMap().then(kakao => {
            if (searchResults.length > 0) {
                const defaultCenter = new kakao.maps.LatLng(37.56, 126.98);

                const mapInstance = new kakao.maps.Map(mapContainer.current, {
                    center: defaultCenter,
                    level: 6,
                });

                mapInstanceRef.current = mapInstance;

                const markerImageSize = new kakao.maps.Size(50, 50);
                const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize);

                const bounds = new kakao.maps.LatLngBounds();
                let previousMarkerPosition = null;

                searchResults.forEach(result => {
                    const markerPosition = new kakao.maps.LatLng(result.y, result.x);

                    if (previousMarkerPosition) {
                        const distance = calculateDistance(
                            previousMarkerPosition.getLat(),
                            previousMarkerPosition.getLng(),
                            result.y,
                            result.x
                        );

                        if (distance > MAX_DISTANCE_BETWEEN_MARKERS) {
                            return;
                        }
                    }

                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                        image: markerImage,
                    });

                    bounds.extend(markerPosition);
                    previousMarkerPosition = markerPosition;

                    const content = `
                    <div class="map-custom-overlay" id="mapoverlay${result.place_id}">
                        <div class="map-custom-overlay-label">
                            ${result.place_name}
                        </div>
                        <div class="map-custom-overlay-address">
                            ${result.address_name}
                        </div>
                    </div>
                    `;

                    const customOverlay = new kakao.maps.CustomOverlay({
                        content,
                        position: markerPosition,
                        xAnchor: 0.5,
                        yAnchor: 1.8,
                        map: null,
                    });

                    kakao.maps.event.addListener(marker, 'click', () => {
                        setSelectedPlaceMap(result);
                        mapInstance.setLevel(3);
                        mapInstance.setCenter(markerPosition);
                    });

                    kakao.maps.event.addListener(marker, 'mouseover', () => {
                        customOverlay.setMap(mapInstance);
                    });

                    kakao.maps.event.addListener(marker, 'mouseout', () => {
                        customOverlay.setMap(null);
                    });

                    marker.setMap(mapInstance);
                    markers.current.push(marker);
                });

                mapInstance.setBounds(bounds);
            }
        }).catch(error => {
            console.error('Error loading Kakao Map:', error);
        });

    }, [searchResults]);

    // selectedPlace에 따른 마커와 오버레이 설정
    useEffect(() => {
        if (selectedPlace) {
            const { kakao } = window;
            const markerImageSize = new kakao.maps.Size(50, 50);
            const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize);
            const markerPosition = new kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);

            // 기존의 selectedPlace 마커 제거
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.setMap(null);
            }

            // 기존의 selectedPlace 오버레이 제거
            if (selectedOverlayRef.current) {
                selectedOverlayRef.current.setMap(null);
            }

            // 새로운 selectedPlace 마커 생성
            const marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
                map: mapInstanceRef.current
            });

            selectedMarkerRef.current = marker;

            // 새로운 selectedPlace 오버레이 생성
            const content = `
            <div class="map-custom-overlay" id="mapoverlay${selectedPlace.place_id}">
                <div class="map-custom-overlay-label">
                    ${selectedPlace.place_name}
                </div>
                <div class="map-custom-overlay-address">
                    ${selectedPlace.address_name}
                </div>
            </div>
            `;

            const customOverlay = new kakao.maps.CustomOverlay({
                content,
                position: markerPosition,
                xAnchor: 0.5,
                yAnchor: 1.8,
                map: mapInstanceRef.current
            });

            selectedOverlayRef.current = customOverlay;

            // selectedPlace의 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedPlaceMap(selectedPlace);
                mapInstanceRef.current.setLevel(3);
                mapInstanceRef.current.setCenter(markerPosition);
            });

            // 마커 마우스오버 이벤트: 오버레이 표시
            kakao.maps.event.addListener(marker, "mouseover", () => {
                customOverlay.setMap(mapInstanceRef.current);
            });

            // 마커 마우스아웃 이벤트: 오버레이 제거
            kakao.maps.event.addListener(marker, "mouseout", () => {
                customOverlay.setMap(null);
            });

            // 지도 중심과 레벨 설정
            mapInstanceRef.current.setCenter(markerPosition);
            mapInstanceRef.current.setLevel(3);
        }
    }, [selectedPlace]);

    const handleCloseDetails = () => {
        setSelectedPlaceMap(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (detailInfoRef.current && !detailInfoRef.current.contains(event.target)) {
                handleCloseDetails();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePlaceChange = () => {
        onChangePlace();
    }

    return (
        <div style={{ width: "100%", height: "98%" }}>
            <div
                ref={mapContainer}
                style={{ width: '100%', height: '100%' }}
            />
            {selectedPlaceMap && (
                <div ref={detailInfoRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <DetailInfo
                        place={selectedPlaceMap}
                        onClose={handleCloseDetails}
                        selectedListId={selectedListId}
                        onPlaceChange={handlePlaceChange}
                    />
                </div>
            )}
        </div>
    );
}

export default MapComponent;
