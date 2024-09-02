import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../style/PlaceList/searchpage.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import Footer from '../HeaderFooter/Footer';
import Header from '../HeaderFooter/Header';

import nextArrow from '../../images/icons/arrow-next.png';
import prevArrow from '../../images/icons/arrow-prev.png';
import PlateIcon from '../../images/icons/platesemoji.png';
import SearchIcon from '../../images/icons/search.png';

function MatplSearchPage() {

    useEffect(()=>{
        document.querySelectorAll('input, textarea').forEach((element) => {
            element.setAttribute('spellcheck', 'false');
        });
    }, [])
    
    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
        <button
            {...props}
            className={
                "custom-slick-arrow custom-slick-prev" +
                (currentSlide === 0 ? " slick-disabled" : "")
            }
            aria-hidden="true"
            aria-disabled={currentSlide === 0 ? true : false}
            type="button"
        >
            <img src={prevArrow} alt="" />
        </button>
    );
    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
        <button
            {...props}
            className={
                "custom-slick-arrow custom-slick-next" +
                (currentSlide === slideCount - 1 ? " slick-disabled" : "")
            }
            aria-hidden="true"
            aria-disabled={currentSlide === slideCount - 1 ? true : false}
            type="button"
        >
            <img src={nextArrow} alt="" />
        </button>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <SlickArrowLeft />,
        nextArrow: <SlickArrowRight />,
    };

    const [searchKeyword, setSearchKeyword] = useState('');
    const [hotplis, setHotplis] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/placelist/popular')
            .then((res) => {
                setHotplis(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleSearchClick = () => {
        axios.get('/api/placelist/search', {
            params: { keyword: searchKeyword }
        })
            .then((res) => {
                navigate('/placelistSearchresults', {
                    state: {
                        results: res.data
                    }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const navToHotplis = ()=>{
        if (hotplis && hotplis.length > 0){
            navigate('/placelistSearchresults', {
                state: {
                    results: hotplis
                }    
            })
        }
    }




    return (
        <div>
            <div className='pli-searchpage-container'>
                <Header />
                <div className='pli-searchpage-search-container'>
                    <div className='pli-searchpage-window'>
                        <div className='pli-searchpage-input'>
                            <img src={SearchIcon} alt="" />
                            <input type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="이름으로 맛플리를 검색해보세요"
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* <button onClick={handleSearchClick}>검색</button> */}
                    </div>
                </div>
                <div className='pli-searchpage-content-container'>
                    <div className='pli-searchpage-content-container-box'>
                        <div className='pli-searchpage-content-title' onClick={()=>{navToHotplis()}}>
                            이런 플리는 어떠세요? <img src={PlateIcon} alt="" />
                        </div>
                        <div className='pli-searchpage-content-item-container'>
                            <Slider className='pli-searchpage-slider' {...settings}>
                                {
                                    (hotplis.map((pli, idx) => {
                                        return (
                                            <div  key={idx+1100}>
                                                <div className='pli-serachpage-content-slider-card' onClick={()=>{navToHotplis()}}>
                                                    <div className='pli-searchpage-content-slider-card-img'>
                                                        <img src={`${pli.image}`} alt="" />
                                                    </div>
                                                    <div className='pli-searpage-content-slider-card-title'>
                                                        {pli.listName}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }))
                                }
                            </Slider>
                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    )
}

export default MatplSearchPage