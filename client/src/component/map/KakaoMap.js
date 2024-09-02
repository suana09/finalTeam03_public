import React, { useEffect, useRef } from 'react';
import markerImageSrc from '../../images/map-marker-yellow.png';

function KakaoMap({ center, markers, onMarkerClick }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (window.kakao) {
            const { kakao } = window;

            // 지도 생성
            const map = new kakao.maps.Map(mapContainer.current, {
                center: new kakao.maps.LatLng(center.lat, center.lng),
                level: 6
            });

            mapRef.current = map;

            // 마커 이미지 설정
            const markerImage = new kakao.maps.MarkerImage(markerImageSrc, new kakao.maps.Size(40, 40));

            // 이벤트 리스너 등록
            const handleMapClick = (event) => {
                const overlayDiv = event.target.closest('.custom-overlay');
                if (overlayDiv) {
                    const lat = overlayDiv.getAttribute('data-lat');
                    const lng = overlayDiv.getAttribute('data-lng');
                    const marker = markers.find(m => m.lat === lat && m.lng === lng);
                    if (marker && onMarkerClick) {
                        onMarkerClick(marker); 
                    }
                }
            };

            const handleMouseOver = (event) => {
                const overlayDiv = event.target.closest('.custom-overlay');
                if (overlayDiv) {
                    overlayDiv.style.color = 'red';
                }
            };

            const handleMouseOut = (event) => {
                const overlayDiv = event.target.closest('.custom-overlay');
                if (overlayDiv) {
                    overlayDiv.style.color = 'black';
                }
            };

            // 이벤트 리스너 등록 및 해제
            const mapContainerElement = mapContainer.current;
            mapContainerElement.addEventListener('click', handleMapClick);
            mapContainerElement.addEventListener('mouseover', handleMouseOver);
            mapContainerElement.addEventListener('mouseout', handleMouseOut);

            // 마커 생성 및 이벤트 리스너 등록
            markers.forEach(marker => {
                const kakaoMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(marker.lat, marker.lng),
                    map,
                    image: markerImage
                });

                // 오버레이 콘텐츠 설정
                const content = `
                    <div class="custom-overlay" data-lat="${marker.lat}" data-lng="${marker.lng}" style="
                        background-color: white; 
                        padding: 5px; 
                        border: 1px solid black; 
                        border-radius: 3px; 
                        font-size: 12px;
                        white-space: nowrap;
                        cursor: pointer;
                    ">
                        ${marker.name}
                    </div>
                `;

                // 커스텀 오버레이 생성
                const customOverlay = new kakao.maps.CustomOverlay({
                    content,
                    position: kakaoMarker.getPosition(),
                    xAnchor: 0.5,
                    yAnchor: 2.4
                });

                customOverlay.setMap(map);

                // 마커 클릭 이벤트 리스너 추가
                kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                    if (onMarkerClick) {
                        onMarkerClick(marker); // 부모 컴포넌트의 콜백 호출
                    }
                });
            });

            // Cleanup: 컴포넌트 언마운트 시 이벤트 리스너 해제
            return () => {
                if (mapContainerElement) {
                    mapContainerElement.removeEventListener('click', handleMapClick);
                    mapContainerElement.removeEventListener('mouseover', handleMouseOver);
                    mapContainerElement.removeEventListener('mouseout', handleMouseOut);
                }
            };
        }
    }, [center, markers, onMarkerClick]);

    return (
        <div
            ref={mapContainer}
            style={{ width: '100%', height: '100%' }}
        />
    );
}

export default KakaoMap;
