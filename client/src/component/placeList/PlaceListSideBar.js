import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../style/PlaceList/sidebar.css';
import authAxios from '../../util/jwtUtil';
import closeIcon from '../../images/icons/close.png'

import PlaceListEditForm from './PlaceListEditForm';

import { useLocation } from 'react-router-dom';

function PlaceListSideBar({ myLists, onSelectPlaceList, onChangePlaceList, sbVisiablityByToggle, onChangePliSbVisibility }) {
    const [placeLists, setPlaceLists] = useState([]);
    const [selectedPlaceListId, setSelectedPlaceListId] = useState(null);
    const [myfavlists, setMyfavlists] = useState([]);
    const [isEditingPlaceList, setIsEditingPlaceList] = useState(false);
    const [plisVisiabilty, setPlisVisiabilty] = useState('');
    const loginUser = useSelector(state => state.user);


    const editListRef = useRef(null);

    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });

    }, [])

    useEffect(() => {
        if (Array.isArray(myLists)) {
            setPlaceLists(myLists);
            if (myLists.length > 0) {
                onSelectPlaceList(myLists[0]);
                setSelectedPlaceListId(myLists[0].id);
            }
        } else {
            console.error("myLists is not an array", myLists);
        }
    }, [myLists]);

    useEffect(() => {
        if (!loginUser || !loginUser.email) {
            return;
        }

        authAxios.get('/api/placelist/fav', { params: { email: loginUser.email } })
            .then((res) => {
                setMyfavlists(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [loginUser]);

    useEffect(() => {
        const updateSlidesToShow = () => {
            if (window.innerWidth <= 480) {
                setPlisVisiabilty(' displayNone');
                
            } else {
                setPlisVisiabilty('');
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

    useEffect(() => {
        if (sbVisiablityByToggle === true) {
            setPlisVisiabilty('');
        } else {
            setPlisVisiabilty(' displayNone');
        }
    }, [sbVisiablityByToggle])

    const handleSelect = (list) => {
        setSelectedPlaceListId(list.id);
        onSelectPlaceList(list);
        sidebarClose();
    };

    let selectedList = {};

    selectedList = myLists.find(list => list.id === selectedPlaceListId);
    if (!selectedList && myLists.length > 0) {
        selectedList = myLists[0];
    }

    const addToFav = () => {
        authAxios.post('/api/favorite', { listId: selectedPlaceListId, email: loginUser.email })
            .then((res) => {
                alert("즐겨찾기에 추가되었습니다.");
                setMyfavlists([...myfavlists, selectedList]);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const removeFromFav = () => {
        if (!window.confirm("즐겨찾기에서 삭제하시겠어요?")) {
            return;
        }

        authAxios.delete('/api/favorite', { data: { listId: selectedPlaceListId, email: loginUser.email } })
            .then((res) => {
                alert("즐겨찾기에서 삭제되었습니다.");
                setMyfavlists(myfavlists.filter(fav => fav.id !== selectedList.id));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const editPlaceList = () => {
        setIsEditingPlaceList(true);
    }

    const deletePlaceList = (id) => {
        if (!window.confirm("맛플리를 삭제하시겠어요?")) {
            return;
        }

        authAxios.delete(`/api/placelist/${id}`)
            .then((res) => {
                if (res.data.success === true) {
                    alert("맛플리가 삭제되었습니다.");
                    onChangePlaceList(id, 'delete');
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const handleUpdatePlaceList = (id, updatedPli) => {
        onChangePlaceList(id, 'put', updatedPli);
        setIsEditingPlaceList(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditingPlaceList && editListRef.current && !editListRef.current.contains(event.target)) {
                setIsEditingPlaceList(false);
                return;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditingPlaceList]);

    const sidebarClose = ()=>{
        onChangePliSbVisibility(false);
        setPlisVisiabilty(' displayNone');
    }


    return (
        <div className={`placelist-sidebar-container ${plisVisiabilty}`}>
            <div className='placelist-sidebar-closebtn'>
                <button>
                    <img src={closeIcon} alt="" onClick={()=>{sidebarClose()}}/>
                </button>
            </div>
            {
                (isEditingPlaceList) && (
                    <div className='placelidesidebar-modal-overlay'>
                        <div className='placelidesidebar-editFormBox' ref={editListRef}>
                            <PlaceListEditForm
                                selectedList={selectedList}
                                onUpdatePlaceList={handleUpdatePlaceList}
                            />
                        </div>
                    </div>
                )
            }
            {
                (selectedList) && (
                    <div className="placelist-sidebar-selectedplace">
                        <div className='placelist-sidebar-selectedplace-infotext'>
                            현재 선택중인 맛플리는? 🗺️
                            {
                                (!currentPath.includes('/placeList')) && (
                                    <>
                                        <br /> {selectedList.nickname} 님의 맛플리예요
                                    </>
                                )
                            }
                        </div>
                        <div className='placelist-sidebar-selectedplace-img'>
                            {
                                <img src={selectedList.image} alt="" />
                            }
                            <div className='placelist-sidebar-selectedplace-overlay'>
                                <div className='placelist-sidebar-selectedplace-title'>
                                    {selectedList.listName}
                                </div>
                            </div>
                        </div>
                        <div className='placelist-sidebar-selectedplace-btns'>
                            {
                                (loginUser && loginUser.email && selectedList.writer === loginUser.email) && (
                                    <>
                                        <button onClick={() => { editPlaceList(selectedList.id) }}>맛플리 수정</button>
                                        <button onClick={() => { deletePlaceList(selectedList.id) }}>맛플리 삭제</button>
                                    </>
                                )
                            }
                            {(loginUser && loginUser.email && selectedList.writer !== loginUser.email) && (
                                myfavlists.find(fav => fav.id === selectedList.id) ? (
                                    <button onClick={() => { removeFromFav() }}>즐겨찾기에서 삭제</button>
                                ) : (
                                    <button onClick={() => { addToFav() }}>즐겨찾기에 추가</button>
                                )
                            )}
                        </div>
                    </div>
                )
            }

            <div className="placeList-sidebar-list">
                <div>
                    {placeLists.map(place => (
                        <div
                            key={place.id}
                            onClick={() => handleSelect(place)}
                            className={`placelist-sidebar-item ${place.id === selectedPlaceListId ? 'placelist-sidebar-item-selected' : ''}`}
                        >
                            <div className='placelist-sidebar-item-img'>
                                <img src={place.image} alt="" />
                            </div>
                            <span>{place.listName}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PlaceListSideBar;
