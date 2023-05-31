import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Card from '../component/Card';
import { getProductWare } from '../middleware/product';
import { encode } from '../utils/encoding';

const Home = () => {

    const dispatch = useDispatch()
    const { FrontEnd_RegNo, imagepath } = useSelector(state => state.banner)
    const { product } = useSelector(state => state.product);

    const [frontEncoding, setFrontEncoding] = useState("")

    useEffect(() => {
        if (Object.keys(FrontEnd_RegNo).length > 0) {
            let encoding = encode(FrontEnd_RegNo);
            setFrontEncoding(encoding)
        }
    }, [FrontEnd_RegNo])

    useEffect(() => {
        frontEncoding !== "" && dispatch(getProductWare({ FrontEnd_RegNo, imagepath, mode: "pdproductlist", frontEncoding }))
    }, [frontEncoding])

    product.length > 0 && localStorage.setItem('product', JSON.stringify(product))

    return (
        <Container fluid>
            <Row>
                {product && product.length > 0 && product.filter(v => v.isparentdesign === 1).map((arr, i) => (
                    <Col md={3} key={i}>
                    
                        <NavLink to={`/product/${arr.designno}`} className="text-decoration-none text-dark"><Card data={arr} imgPath={imagepath} /></NavLink>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Home