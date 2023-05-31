import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css'

const Footer = () => {
  return (
    <div className="footer">
      <div className='my-5'>
        <p className='fs-5 my-2'>Created by <a href="https://www.optigoapps.com/" target="_blank" className='text-dark text-decoration-none'>optigoapps.com</a></p>
        <NavLink to="/three_d" target="_blank" className='text-dark text-decoration-none'>Three D demo</NavLink>
      </div>

    </div>
  )
}

export default Footer