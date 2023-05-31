import React, { useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getBannerWare } from '../middleware/banner';

const Header = () => {

  const dispatch = useDispatch();

  const {banner} = useSelector(state=>state.banner)


  return (
    <Container fluid>
        <Row>
            <img src={banner} className="w-100" />
        </Row>
    </Container>
  )
}

export default Header