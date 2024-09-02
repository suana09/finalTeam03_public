import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/HeaderFooter.css';
import '../style/index.css';
import axios from 'axios';

import Footer from './HeaderFooter/Footer';
import Header from './HeaderFooter/Header';
import SearchComponent from './map/SearchComponent';

import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import index_image1 from '../images/banner_image1.png';
import index_image2 from '../images/dessert.jpg';
import index_image3 from '../images/fastfood.jpg';
import logo_text from '../images/logo_text.png';
import nextArrow from '../images/icons/arrow-next.png';
import prevArrow from '../images/icons/arrow-prev.png';


function Index() {
    const nav = useNavigate();
    const navigate = useNavigate();
    const [hotplis, setHotplis] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [useLocationSearch, setUseLocationSearch] = useState(false);


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
            <img src={prevArrow} alt="Previous" />
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
            <img src={nextArrow} alt="Next" />
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
        // responsive: [
        //     {
        //         breakpoint: 768, // 화면 너비가 768px 이하일 때
        //         settings: {
        //             slidesToShow: 1,  // 1개의 슬라이드만 보여줍니다.
        //             arrows : true
        //         }
        //     }
        // ]
    };

    

    useEffect(() => {
        axios.get('/api/placelist/popular')
            .then((res) => {
                setHotplis(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [])


    const handleResults = () => {

    };

    const clearResults = () => {
        
    };

    const handleFetchNextPage = () => {

    };


    useEffect(() => {
        const autoSlide = setInterval(() => {
            moveSlide(1);
        }, 3000);

        return () => clearInterval(autoSlide);
    }, []);

    let currentSlide = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        const slider = document.querySelector('.slider');
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function moveSlide(step) {
        showSlide(currentSlide + step);
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


    const handleSearchParams = (searchKeyword, useLocationSearch, results, isEnd) => {
        setSearchKeyword(searchKeyword);
        setUseLocationSearch(useLocationSearch);
        
        setTimeout(() => {
            navigate('/searchResult', {
                state: { 
                    initialSearchResults: results, 
                    searchParams: { keyword: searchKeyword, useLocationSearch }
                }
            });
        }, 0);
    };
    
    

    return (
        <div className='page-container'>
            <Header />
            {/* 메인페이지 배너 이미지 */}
            <div className="banner">
                <div className='text'>
                    <img src={logo_text} alt='Logo' width={700} />
                </div>
                <div className="slider-container">
                    <div className='slider'>
                        <div className="slide">
                            <img src={index_image1} alt="Logo 1" />
                        </div>
                        <div className="slide">
                            <img src={index_image2} alt="Logo 2" />
                        </div>
                        <div className="slide">
                            <img src={index_image3} alt="Logo 3" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 아래 검색창 */}
            <div className="main-bottom">
                <SearchComponent
                    onResults={handleResults}
                    page={1}
                    onFetchNextPage={(nextPage) => handleFetchNextPage(nextPage)}
                    clearResults={clearResults}
                    onSearchParams={handleSearchParams}
                />
            </div>

            {/* Best 10 맛플리 */}
            <div className='bestPlaceList10'>
                <div className='main-best10-container-box'>
                    <div className='main-best10-text'>
                        <h1>맛카이브 Best 10 맛플리</h1>
                    </div>
                    <div className='pli-searchpage-content-item-container'>
                        <Slider className='pli-searchpage-slider' {...settings}>
                            {
                                (hotplis.map((pli, idx) => {
                                    return (
                                        <div className='pli-serachpage-content-slider-card' onClick={() => { navToHotplis() }} key={idx}>
                                            <div className='pli-searchpage-content-slider-card-img'>
                                                <img src={`${pli.image}`} alt="" />
                                            </div>
                                            <div className='pli-searpage-content-slider-card-title'>
                                                {pli.listName}
                                            </div>
                                        </div>
                                    ) 
                                }))
                            }
                        </Slider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Index;