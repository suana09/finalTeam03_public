import React, { useEffect, useState } from 'react';
import authAxios from '../../util/jwtUtil';
import '../../style/admin/memberlist.css';
import { useNavigate } from 'react-router-dom';

import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';

import PrevIcon from '../../images/icons/arrow-prev.png'
import NextIcon from '../../images/icons/arrow-next.png'
import DoublePrevIcon from '../../images/icons/double-arrow-prev.png'
import DoubleNextIcon from '../../images/icons/double-arrow-next.png'

function AdminMembers() {
    const [memberlist, setMemberlist] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [checkedMembers, setCheckedMembers] = useState({});
    const [memberTri, setMemberTri] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageStarts, setPageStarts] = useState(10);
    const [pageEnds, setPageEnds] = useState(10);
    const [isPrevable, setIsPrevable] = useState(false);
    const [isNextable, setIsNextable] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(0);
    const maxVisiblePages = 10; // 한 번에 보여줄 페이지 번호의 수


    const navigate = useNavigate();

    useEffect(() => {
        authAxios.get('/api/admin/member', {
            params: { page, pageSize:10 }
        })
            .then((res) => {
                setMemberlist(res.data.content);
                setTotalPages(res.data.totalPages);

                const totalPageCount = res.data.totalPages;

                const start = currentGroup * maxVisiblePages;
                const end = Math.min(start + maxVisiblePages, totalPageCount);

                setPageStarts(start);
                setPageEnds(end);

                setIsPrevable(!res.data.first);
                setIsNextable(!res.data.last);

                const initialCheckedState = res.data.content.reduce((acc, member) => {
                    acc[member.email] = false;
                    return acc;
                }, {});
                setCheckedMembers(initialCheckedState);
            })
            .catch((err) => {
                if (err && err.response.data.error === 'ERROR_ACCESSDENIED') {
                    alert("권한이 없는 사용자입니다.");
                    navigate('/');
                } else if (err && err.response.data.error === 'ERROR_ACCESS_TOKEN'){
                    alert("관리자 회원으로 로그인해주시기 바랍니다.");
                    navigate('/');
                }
                console.error(err);
            });
    }, [memberTri, page, currentGroup]);


    const checkAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);

        // 전체 체크박스 상태를 업데이트
        const updatedCheckedMembers = memberlist.reduce((acc, member) => {
            acc[member.email] = isChecked;
            return acc;
        }, {});
        setCheckedMembers(updatedCheckedMembers);
    };

    const handleCheckboxChange = (email) => {
        setCheckedMembers(prevCheckedMembers => {
            const updatedCheckedMembers = { ...prevCheckedMembers, [email]: !prevCheckedMembers[email] };
            const allChecked = memberlist.every(member => updatedCheckedMembers[member.email]);
            setSelectAll(allChecked);
            return updatedCheckedMembers;
        });
    };

    const giveGrant = () => {
        const selectedEmails = Object.keys(checkedMembers).filter(email => checkedMembers[email]);

        authAxios.put('/api/admin/member/setadmin', { email: selectedEmails })
            .then((res) => {
                setMemberTri(memberTri + 1);
            })
            .catch((err) => {
                console.error(err);
            })

    };

    const removeGrant = () => {
        const selectedEmails = Object.keys(checkedMembers).filter(email => checkedMembers[email]);

        authAxios.put('/api/admin/member/notadmin', { email: selectedEmails })
            .then((res) => {
                setMemberTri(memberTri - 1);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const goToPrevPageGroup = () => {
        if (currentGroup > 0) {
            setCurrentGroup(prevGroup => prevGroup - 1);
        }
    };

    const goToNextPageGroup = () => {
        if ((currentGroup + 1) * maxVisiblePages < totalPages) {
            setCurrentGroup(prevGroup => prevGroup + 1);
        }
    };

    const goToPage = (pageIndex) => {
        setPage(pageIndex);
    };

    const goToPrevPage = ()=>{
        setPage(page-1);
    }

    const goToNextPage = ()=>{
        setPage(page+1);
    }



    return (
        <div>
            <Header />
            <div className='admin-member-container'>
                <div className='admin-member-subject'>
                    회원목록 조회
                </div>
                <div className='admin-member-title-row'>
                    <div className='admin-member-title-col flex3'>
                        이메일
                    </div>
                    <div className='admin-member-title-col flex2'>
                        닉네임
                    </div>
                    <div className='admin-member-title-col flex1'>
                        구분
                    </div>
                    <div className='admin-member-title-col flex2'>
                        권한
                    </div>
                    <div className='admin-member-title-col'>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={checkAll}
                        />
                    </div>
                </div>
                {
                    (memberlist && memberlist.length > 0) && (
                        memberlist.map((member, idx) => {
                            return (
                                <div className='admin-member-content-row' key={idx}>
                                    <div className='admin-member-content-col flex3'>
                                        {member.email}
                                    </div>
                                    <div className='admin-member-content-col flex2'>
                                        {member.nickname}
                                    </div>
                                    <div className='admin-member-content-col flex1'>
                                        {
                                            (member.provider === null || member.provider === '')?(
                                                'local'
                                            ) : (member.provider)
                                        }
                                    </div>
                                    <div className='admin-member-content-col flex2'>
                                        {
                                            member.userRoleList.map((role, index) => (
                                                <span key={index}>
                                                    {role}&nbsp;
                                                </span>
                                            ))
                                        }
                                    </div>
                                    <div className='admin-member-content-col'>
                                        <input
                                            type="checkbox"
                                            checked={checkedMembers[member.email] || false}
                                            onChange={() => handleCheckboxChange(member.email)}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )
                }

                <div className='admin-member-pagebtnfield'>
                    <div className='admin-member-pagebtns'>
                        {
                            currentGroup > 0 && (
                                <div
                                    className={`admin-member-pagebtn`}
                                    onClick={goToPrevPageGroup}>
                                    <div className='admin-member-pagebtn-imgbtn'>
                                        <img src={DoublePrevIcon} alt="Previous Group" />
                                    </div>
                                </div>
                            )
                        }


                        <div className={`admin-member-pagebtn ${(!isPrevable) ? 'pagebtn-unavailable' : ''}`} onClick={()=>{goToPrevPage()}}>
                            <div className='admin-member-pagebtn-imgbtn'>
                                <img src={PrevIcon} alt="" />
                            </div>
                        </div>

                        {
                            [...Array(pageEnds - pageStarts)].map((_, index) => (
                                <div
                                    className={`admin-member-pagebtn ${page === (pageStarts + index) ? 'pagebtn-active' : ''}`}
                                    key={index}
                                    onClick={() => goToPage(pageStarts + index)}
                                >
                                    {pageStarts + index + 1}
                                </div>
                            ))
                        }

                        <div className={`admin-member-pagebtn ${!isNextable ? 'pagebtn-unavailable' : ''}`} onClick={()=>{goToNextPage()}}>
                            <div className='admin-member-pagebtn-imgbtn'>
                                <img src={NextIcon} alt="" />
                            </div>
                        </div>

                        {
                            (currentGroup + 1) * maxVisiblePages < totalPages && (
                                <div className='admin-member-pagebtn' onClick={goToNextPageGroup}>
                                    <div className='admin-member-pagebtn-imgbtn'>
                                        <img src={DoubleNextIcon} alt="Next Group" />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className='admin-member-btnfield'>
                    <div className='admin-member-selectbox'>
                        <select id="adminMemberRoles">
                            <option value="0">권한 설정하기</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                        </select>
                    </div>
                    <div className='admin-member-btn'>
                        <button onClick={giveGrant}>설정</button>
                        <button onClick={removeGrant}>해제</button>
                    </div>
                </div>



            </div>
            <Footer />
        </div>
    );
}

export default AdminMembers;
