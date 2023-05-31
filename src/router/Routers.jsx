import React from 'react';
import {Route,Routes} from 'react-router-dom'
import Home from '../pages/Home';
import HomeT from '../pages/Home2';
import Product from '../pages/Product';
import Header from '../component/Header';
import Three_D from '../pages/Three_D';

const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<><Header/><Home/></>}/>
        <Route path="/home2" element={<><Header/><HomeT/></>}/>
        <Route path="/product/:designno" element={<Product/>}/>
        <Route path="/three_d" element={<Three_D/>}/>
    </Routes>
  )
}

export default Routers