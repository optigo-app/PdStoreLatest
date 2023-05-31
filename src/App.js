import logo from './logo.svg';
import './App.css';
import Routers from './router/Routers';
import Footer from './component/Footer';
import Header from './component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getBannerWare } from './middleware/banner';

function App() {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getBannerWare())
  },[])
  
  return (
    <div className="App">

      {/* <Header/> */}
      <Routers />
      <Footer/>
    </div>
  );
}

export default App;
