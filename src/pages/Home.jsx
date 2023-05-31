import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Card from '../component/Card';
import { getPDstorePrice, getProductWare } from '../middleware/product';
import { encode } from '../utils/encoding';
import queryString from 'query-string';

const Home = () => {

    let searchArr = queryString.parse(window.location.search);

    const dispatch = useDispatch()
    const { FrontEnd_RegNo, imagepath } = useSelector(state => state.banner)
    const { product, store_price, metalPurity, metalColorArr } = useSelector(state => state.product);

    const [frontEncoding, setFrontEncoding] = useState("")
    const [productArr, setProductArr] = useState([])
    const [searchValue, setSearch] = useState("");

    useEffect(() => {
        if (Object.keys(FrontEnd_RegNo).length > 0) {
            let encoding = encode(FrontEnd_RegNo);
            setFrontEncoding(encoding)
        }
    }, [FrontEnd_RegNo])

    useEffect(() => {
        frontEncoding !== "" && dispatch(getProductWare({ FrontEnd_RegNo, imagepath, mode: "pdproductlist", frontEncoding }))
        frontEncoding !== "" && dispatch(getPDstorePrice({ frontEncoding, imagepath, mode: "pdstoreprice" }))
    }, [frontEncoding])

    product.length > 0 && localStorage.setItem('product', JSON.stringify(product));

    const navigateToNewTab = (url) => {
        // window.open(url, '_blank');
        window.location.href = url
    }

    const searching = () => {
        if (searchValue !== "" && searchValue.length === 12) {
          let splitting = searchValue.split("")
          let dShape = splitting[1] + splitting[2], caratWt = splitting[3] + splitting[4] + splitting[5], hShape = splitting[6], metal_type = splitting[7] + splitting[8] + splitting[9]
          let getMetalColor = splitting[10] + splitting[11]
          let metal_color = getMetalColor === 'WG' ? 'WHITE' : getMetalColor === 'YG' ? 'YELLOW' : getMetalColor === 'RG' ? "ROSE" : 'TWO TONE'
          let a = product.filter((p) => p.designno === searchValue.slice(0, -5))
          let arrForPrice = store_price.filter((s) => s.autocode === a[0].autocode && s.metalpurity === metal_type && s.metalcolor === metal_color)
    
          let main_url = `/product/${a[0].ParentDesignno}`
          let obj = {}
          obj['shape'] = dShape
          obj['carat'] = parseInt(caratWt) / 100
          obj['head'] = hShape
          obj['metal_type'] = metal_type
          obj['metalColor'] = metal_color.replaceAll(' ', '_')
          obj['build'] = searchValue
          if (arrForPrice.length > 0) {
            obj['price'] = parseFloat(arrForPrice[0].unitprice)
          }
    
          const search = queryString.stringify(obj);
          let url = `${main_url}?${search}`
          navigateToNewTab(url)
        }
      }

    /* useEffect(() => {
        let products = JSON.parse(JSON.stringify(product.filter(v => v.isparentdesign === 1)))


        console.log("products:- ", products)

        console.log("filter:- ", store_price.filter((a) => a.autocode === "55670335"))

        // localStorage.setItem
        products.map((p) => {
            let arr = store_price.filter((a) => {
                if (a.autocode === p['autocode'] && a.metalpurity === metalPurity[0]?.slice(5) && a.metalcolor === metalColorArr[0].label) {
                    return a
                }
            });
            p['price'] = arr.length > 0 ? arr[0].unitprice : ""
        })
        setProductArr(products)
    }, [store_price, product]) */

    return (
        <>
            <div className='d-flex justify-content-between m-4'>
                <div>
                    <p><span className='fw-semibold'> 1 </span>-<span className='fw-semibold'> {product.filter(v => v.isparentdesign === 1).length}</span> of <span className='fw-semibold'>{product.filter(v => v.isparentdesign === 1).length}</span> Search Results</p>
                </div>
                <div className='d-flex w-25'>
                    <input type="text" className='w-100' onChange={(e) => setSearch(e.target.value)} value={searchValue} />
                    <div className='btn btn-secondary w-100 mx-4' onClick={() => searching()}>Search</div>
                </div>
            </div>
            <Container fluid>

                <Row>
                    {/* {console.log(product.filter(v => v.isparentdesign == 1))} */}
                    {product && product.length > 0 && product.filter(v => v.isparentdesign === 1).map((arr, i) => (
                        <Col md={3} key={i}>
                            <NavLink to={`/product/${arr.designno}`} className="text-decoration-none text-dark"><Card data={arr} imgPath={imagepath} /></NavLink>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default Home