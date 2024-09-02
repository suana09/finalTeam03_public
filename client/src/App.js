import React from 'react';
import './style/global.css';

import { Route, Routes } from "react-router-dom";
import ReviewDetail from "./component/review/ReviewDetail";
import ReviewList from "./component/review/ReviewList";
import UpdateReview from "./component/review/UpdateReview";
import WriteReview from "./component/review/WriteReview";

import PlaceListInserForm from "./component/placeList/NewPlaceListPage";
import PlaceList from "./component/placeList/PlaceList";

import AdminMembers from './component/admin/AdminMembers';
import AdminLogin from './component/admin/Login';
import Sidebar from './component/HeaderFooter/Sidebar';
import Index from './component/Index';
import Deletion from './component/member/Deletion';
import GoogleSaveInfo from './component/member/GoogleSaveInfo';
import KakaoSaveInfo from './component/member/KakaoSaveInfo';
import Login from './component/member/Login';
import NaverSaveInfo from './component/member/NaverSaveInfo';
import ProfileEdit from './component/member/ProfileEdit';
import Register from './component/member/Register';
import ResetPwd from './component/member/ResetPwd';
import ReactivateMember from './component/member/ReactivateMember'


import SearchResult from './component/place/SearchResult';

import MatplSearchPage from './component/placeList/MatplSearchPage';
import PlaceListSearchResults from './component/placeList/PlaceListSearchResults';

import FavoritePlaceList from './component/placeList/MyFavoritePlaceList';

import PlaceListEditForm from './component/placeList/PlaceListEditForm';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Index />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/kakaosaveinfo/:nickname" element={<KakaoSaveInfo />}></Route>
        <Route path="/googlesaveinfo/:email" element={<GoogleSaveInfo />}></Route>
        <Route path="/naversaveinfo/:nickname" element={<NaverSaveInfo />}></Route>
        <Route path="/profileEdit" element={<ProfileEdit />}></Route>
        <Route path="/deletion" element={<Deletion />}></Route>
        <Route path="/resetpwd" element={<ResetPwd />}></Route>
        <Route path="/reactivate" element={<ReactivateMember />}></Route>


        <Route path="/sidebar" element={<Sidebar></Sidebar>}></Route>



        <Route path='/insertPlaceList' element={<PlaceListInserForm />}></Route>
        <Route path='/placeList' element={<PlaceList />}></Route>

        <Route path="/reviewList" element={<ReviewList></ReviewList>}></Route>
        <Route path="/writeReview" element={<WriteReview></WriteReview>}></Route>
        <Route path="/reviewDetail/:id" element={<ReviewDetail></ReviewDetail>}></Route>
        <Route path="/updateReview/:id" element={<UpdateReview></UpdateReview>}></Route>
        <Route path="/searchResult" element={<SearchResult />}></Route>

        <Route path='/adminlogin' element={<AdminLogin />}></Route>
        <Route path='/adminMemberlist' element={<AdminMembers />}></Route>

        <Route path='/searchpli' element={<MatplSearchPage />}></Route>
        <Route path='/placelistSearchresults' element={<PlaceListSearchResults />}></Route>

        <Route path='/favoritePlis' element={<FavoritePlaceList/>}> </Route>

        <Route path='/editplacelist' element={<div style={{width:"500px", height:"80vh", margin:"0 auto"}}><PlaceListEditForm/></div>}> </Route>

      </Routes>
    </div>
  );
}

export default App;
