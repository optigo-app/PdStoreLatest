import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';
import { colorImage, getPDstorePrice, getProductWare, saveOrder } from '../middleware/product';
import { getHeadWare } from '../middleware/head';
import { getShapeWare } from '../middleware/shape';
import ViewerComponent from '../component/ViewerComponent'
import { encode } from '../utils/encoding';
import queryString from 'query-string';
import { getBannerWare } from '../middleware/banner';
import Viewer from '../component/Viewer2';

const Product = () => {
  const dispatch = useDispatch()
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let searchArr = queryString.parse(window.location.search);
  // const query = queryString.parse(window.location.search);




  const { FrontEnd_RegNo, imagepath } = useSelector(state => state.banner)
  const { product, store_price, metalPurity, metalColorArr, metalCaratArr, saveLoading, saveSuccess, colorImageSuccess } = useSelector(state => state.product)
  const { head } = useSelector(state => state.head)
  const { shape } = useSelector(state => state.shape);


  const [data, setData] = useState([]);
  const [productArr, setProductArr] = useState([]);
  const [image, setImage] = useState("")
  const [imageArr, setImageArr] = useState([])
  const [modal, setModelOpen] = useState(false)
  const [largeImage, setLargeImage] = useState("")
  const [fInput, setFInput] = useState("")
  const [fInputPrice, setFInputPrice] = useState(0)
  const [sInputPrice, setSInputPrice] = useState(0)
  const [fInputStyle, setFInputStyle] = useState("helvetica")
  const [sInput, setSInput] = useState("")
  const [sInputStyle, setSInputStyle] = useState("helvetica")
  const [saveRing, setSaveRing] = useState(false);
  const [headimage, setHeadimage] = useState(searchArr.head || 'A')
  const [shapeimage, setShapeimage] = useState(searchArr.shape || "RD")
  const [metalColorFile, setMetalColorFile] = useState(searchArr.metalColor ? `/pmat/${searchArr.metalColor.slice(0, 1) + searchArr.metalColor.slice(1).toLocaleLowerCase()}_Gold.pmat` : "/pmat/White_Gold.pmat")
  const [metalColor, setMetalColor] = useState(searchArr.metalColor ? searchArr.metalColor : "")
  const [MetalType, setMetalType] = useState(searchArr.metal_type || "18K")
  const [CS_diaColor, setCSDiaColor] = useState("/dmat/sapphire-green.dmat")
  const [SS_diaColor, setSSDiaColor] = useState("/dmat/diamond-white-2.dmat")
  const [filterData, setFilterData] = useState([]);
  const [CARAT, setCARAT] = useState(searchArr.carat || metalCaratArr[0]);
  const [design_autoCode, setDesignAutoCode] = useState(searchArr.build ? { designCode: searchArr.build.slice(0, -4) } : {});
  const [buildNo, setBuildNo] = useState(searchArr.build ? { designCode: searchArr.build.slice(-4) } : "")
  const [price, setPrice] = useState(searchArr.number && searchArr.markup ? Number(parseFloat(searchArr.number)) + Number(parseFloat(Number(parseFloat(searchArr.number)) * Number(parseFloat(searchArr.markup)) / 100)) : searchArr.number ? Number(parseFloat(searchArr.number)) + Number(parseFloat(Number(parseFloat(searchArr.number)) * 120 / 100)) : "")
  const [checked, setChecked] = useState(true);
  const [frontEncoding, setFrontEncoding] = useState("");
  const [ringSize, setRingSize] = useState(searchArr.ring_size || "4");
  const [formSuccess, setFormSuccess] = useState(false);
  const [searchValue, setSearch] = useState("");
  const [band, setBand] = useState([]);
  const [simiband, setSimiBand] = useState([]);
  const [query, setQuery] = useState(searchArr || {})
  const [selectedBand, setSelectedBand] = useState(parseInt(searchArr.bandIndex) || 0)
  const [finalPrice, setFinalPrice] = useState(0)

  useEffect(() => {
    dispatch(getBannerWare())
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("pathname:- ", pathname)
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem('metalColorFile', '/White_Gold-14K.pmat')
    if (Object.keys(FrontEnd_RegNo).length > 0) {
      let encoding = encode(FrontEnd_RegNo);
      setFrontEncoding(encoding)
    }
  }, [FrontEnd_RegNo])

  useEffect(() => {
    if (frontEncoding !== "") {
      dispatch(getHeadWare({ frontEncoding, imagepath, mode: "pdhead" }))
      dispatch(getProductWare({ frontEncoding, imagepath, mode: "pdproductlist" }))
      dispatch(getPDstorePrice({ frontEncoding, imagepath, mode: "pdstoreprice" }))
      dispatch(getShapeWare({ frontEncoding, imagepath, mode: "pddiashape" }))
      dispatch(colorImage({ frontEncoding, mode: "pdstorecolorimage" }))
    }
  }, [frontEncoding]);

  useEffect(() => {
    product.length > 0 && load()
    let q = { ...query }
    if (searchArr.markup === undefined && q.markup === undefined) {
      q['markup'] = 120
    }

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }, [product])

  useEffect(() => {
    if (metalCaratArr.length > 0) {
      setCARAT(metalCaratArr[0])
    }
  }, [metalCaratArr])

  useEffect(() => {
    if (metalColor === "" && metalColorArr.length > 0) {
      setMetalColor(metalColorArr[0].value)
    }
  }, [metalColorArr])

  useEffect(() => {
    let headname = searchArr.head || 'A'
    let shapename = searchArr.shape || "RD"
    getFilterData(headname, shapename)
  }, [data]);

  useEffect(() => {
    if (data.length > 0 && colorImageSuccess.length > 0 && metalColorArr.length > 0 && store_price.length > 0) {
      let setOfImage = []
      let metal_color = searchArr.metalColor || metalColorArr[0].value;
      // let metal_purity = searchArr.metal_type || "18K"
      let dShape = searchArr.shape || shapeimage
      let dHead = searchArr.head || headimage
      let autoCode = data.filter((d) => d.diamondshape === dShape && d.headname === dHead)
      if (autoCode.length > 0) {
        let auto_code = autoCode[0].autocode
        let imageArr = colorImageSuccess.filter((v) => v.autocode === auto_code && v.colorname === metal_color)
        imageArr.forEach((i) => setOfImage.push(i.imagepath))
        setImageArr(setOfImage)
        setImage(setOfImage[0])
      }
    }

  }, [colorImageSuccess, metalColorArr, store_price, data])

  useEffect(() => {
    let obj = {}, q = { ...query }
    let metaltype = searchArr.metal_type || metalPurity[0]?.slice(5)
    if (filterData.length > 0) {
      obj['designCode'] = q.pIndex === undefined ? filterData[0].designno : data[q.pIndex].designno
      obj['autoCode'] = q.pIndex === undefined ? filterData[0].autocode : data[q.pIndex].autocode
      obj['description'] = q.pIndex === undefined ? filterData[0].description : data[q.pIndex].description

      setDesignAutoCode(obj)

      let Sband = [...band]
      let filter = []
      filterData[0].similarband.split(',').forEach((d) => {
        Sband.forEach((s) => {
          if (s.designno === d) {
            filter.push(s)
          }
        })
      })

      setSimiBand(filter)
      if (price === "") {
        let a = store_price.filter((a) => a.autocode === obj['autoCode'] && a.metalpurity === metaltype && a.metalcolor === metalColorArr[0].label)
        if (a.length > 0) {
          q['number'] = a[0].unitprice
          let p = searchArr.markup ? parseFloat(parseFloat(a[0].unitprice) * parseFloat(searchArr.markup) / 100) + parseFloat(a[0].unitprice) : parseFloat(parseFloat(a[0].unitprice) * 120 / 100) + parseFloat(a[0].unitprice)
          setPrice(p)

          console.log("price change initially")
        }
      }
    }
    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }, [filterData])

  useEffect(() => {
    let type = MetalType, q = { ...query };

    let mColorArr = metalColorFile.slice(6, -5).split("_")
    let mColor = ""
    mColorArr.forEach((m) => {
      mColor = mColor.concat(m[0])
    })
    let builtNo = type + mColor
    setBuildNo(builtNo)
    if (shapeimage !== "RD" && MetalType !== '18K' && headimage !== 'A') {

      q['build'] = design_autoCode?.designCode + builtNo
      setQuery(q)
      const search = queryString.stringify(q);
      navigate({ search: search })
    }

  }, [metalColorFile, MetalType])

  useEffect(() => {
    let q = { ...query }
    q['bandIndex'] = selectedBand
    q['band'] = simiband[selectedBand]?.designno

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }, [selectedBand, simiband])

  const load = () => {

    let arr = product.filter(v => v.ParentDesignno === params.designno && v.ismatchingband == 0);
    setData(arr)
    let similarBand = product.filter((p) => p.ismatchingband == 1)
    setBand(similarBand)
  }

  const getFilterData = (hName, dShape) => {
    let prod = data.filter(v => v.headname === hName && v.diamondshape === dShape)
    setProductArr(prod);
    // prod.length > 0 && setImage(prod[0]?.MediumImagePath.split(',')[0])
    // prod.length > 0 && setLargeImage(prod[0]?.OriginalImagePath.split(',')[0]);


    let arr = data.length > 0 ? data.filter((d) => d.headname === headimage && d.diamondshape === shapeimage && d.diawt === product[0].diawt) : [];
    setFilterData(arr)
    // setCARAT(arr[0]?.diawt)
  }

  const showImage = (s) => {
    if (s !== "") {
      setImage(s)
      // setLargeImage(productArr[0]?.OriginalImagePath.split(',')[index])
    } else {
      setImage("");
      // setLargeImage("")
    }
  }

  /* const showModal = () => {
    let bool = modal;
    setModelOpen(!bool)
  } */

  const saveRingModel = () => {
    let bool = saveRing;
    setSaveRing(!bool)
    // formSuccess(false)
  }

  const changeHead = (code, i) => {
    let metaltype = searchArr.metal_type || metalPurity[0]?.slice(5)
    let arr = [], datas = JSON.parse(JSON.stringify(product));
    let q = { ...query }
    arr = datas.length > 0 ? datas.filter((d) => d.headname === code && d.diamondshape === shapeimage && d.diawt === product[0].diawt && d.ParentDesignno === params.designno) : [];

    if (arr.length > 0) {
      setFilterData(arr)

      q['build'] = arr[0].designno + buildNo
      let getIndex = data.findIndex((i) => i.designno === arr[0].designno)
      q['pIndex'] = getIndex

      let a = store_price.filter((a) => a.autocode === arr[0]['autocode'] && a.metalpurity === metaltype && a.metalcolor === metalColor)
      if (a.length > 0) {
        q['number'] = a[0].unitprice
        let p = searchArr.markup ? parseFloat(parseFloat(a[0].unitprice) * parseFloat(searchArr.markup) / 100) + parseFloat(a[0].unitprice) : parseFloat(parseFloat(a[0].unitprice) * 120 / 100) + parseFloat(a[0].unitprice)
        setPrice(p)
      }

    }
    getFilterData(code, shapeimage)
    setHeadimage(code);
    q['head'] = code

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
    if (colorImageSuccess.length > 0 && metalColorArr.length > 0 && store_price.length > 0) {
      let setOfImage = []
      let metal_color = searchArr.metalColor || metalColorArr[0].value;
      // let metal_purity = searchArr.metal_type || "18K"
      let dShape = searchArr.shape || shapeimage
      let dHead = code
      let autoCode = data.filter((d) => d.diamondshape === dShape && d.headname === dHead)
      if (autoCode.length > 0) {
        let auto_code = autoCode[0].autocode
        let imageArr = colorImageSuccess.filter((v) => v.autocode === auto_code && v.colorname === metal_color)
        imageArr.forEach((i) => setOfImage.push(i.imagepath))
        console.log("data:- ", setOfImage)
        setImageArr(setOfImage)
        setImage(setOfImage[0])
      }
    }
  }

  const changeShape = (code) => {
    let q = { ...query }
    setShapeimage(code);
    let datas = JSON.parse(JSON.stringify(product))
    let arr = datas.length > 0 ? datas.filter((d) => d.headname === headimage && d.diamondshape === code && d.diawt === product[0].diawt) : [];
    if (arr.length > 0) {
      setFilterData(arr);
      q['build'] = arr[0].designno + buildNo;
    }

    q['shape'] = code

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }

  const changeMetalColor = (selected) => {
    let metaltype = searchArr.metal_type || metalPurity[0]?.slice(5)
    let q = { ...query }
    let fileSelected = selected.slice(0, 1) + selected.slice(1).toLocaleLowerCase()
    let file = `/pmat/${fileSelected}_Gold.pmat`

    setMetalColorFile(file);
    let select = selected.replace('_', " ")
    let a = store_price.filter((a) => a.autocode === design_autoCode['autoCode'] && a.metalpurity === metaltype && a.metalcolor === select)

    if (a.length > 0) {
      let p = searchArr.markup ? parseFloat(parseFloat(a[0].unitprice) * parseFloat(searchArr.markup) / 100) + parseFloat(a[0].unitprice) : parseFloat(parseFloat(a[0].unitprice) * 120 / 100) + parseFloat(a[0].unitprice)
      setPrice(p)
      q['number'] = a[0].unitprice
    }
    setMetalColor(selected)

    q['metalColor'] = selected

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })

    if (colorImageSuccess.length > 0 && store_price.length > 0) {
      let setOfImage = []
      let metal_color = selected
      // let metal_purity = searchArr.metal_type || "18K"
      let dShape = searchArr.shape || shapeimage
      let dHead = searchArr.head || headimage
      let autoCode = data.filter((d) => d.diamondshape === dShape && d.headname === dHead)
      if (autoCode.length > 0) {

        let auto_code = autoCode[0].autocode
        let imageArr = colorImageSuccess.filter((v) => v.autocode === auto_code && v.colorname === metal_color)
        imageArr.forEach((i) => setOfImage.push(i.imagepath))
        // console.log("data:- ",setOfImage)
        setImageArr(setOfImage)
        image !== "" && setImage(setOfImage[0])
      }
    }
  }

  const changeCSDiaColor = (selected) => {
    let file = `/dmat/${selected}.json`
    setCSDiaColor(file);
  }

  const changeSSDiaColor = (selected) => {
    let file = `/${selected}.dmat`
    setSSDiaColor(file);
  }

  const changeCarat = (e) => {
    let q = { ...query }
    setCARAT(e)
    let datas = JSON.parse(JSON.stringify(product))
    let arr = datas.length > 0 ? datas.filter((d) => d.headname === headimage && d.diamondshape === shapeimage && d.diawt === e) : [];
    // filter data on the basis of head image, shape and carat weight that is selected right now as 'e'
    if (arr.length > 0) {

      setFilterData(arr)
      q['build'] = arr[0].designno + buildNo;
    }

    q['carat'] = e

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }

  //to change metal Purity:- 14K, 18K
  const changeMetalType = e => {
    let q = { ...query }
    let select = metalColor // getting metal selected color and set in filter function to get price if purity changes

    // let file = `/pmat/${metalColorFile.slice(6, -9)}.pmat`// change metal purity that is attached with metal color because of webgi pmat files
    // setMetalColorFile(file);
    setMetalType(e.slice(1)) // set metal purity

    let a = store_price.filter((a) => a.autocode === design_autoCode['autoCode'] && a.metalpurity === e.slice(1) && a.metalcolor === select)
    //getting product price according to purity,metal color and autocode that was set earlier

    if (a.length > 0) {
      let p = searchArr.markup ? parseFloat(parseFloat(a[0].unitprice) * parseFloat(searchArr.markup) / 100) + parseFloat(a[0].unitprice) : parseFloat(parseFloat(a[0].unitprice) * 120 / 100) + parseFloat(a[0].unitprice)
      setPrice(p)
      q['number'] = parseFloat(a[0].unitprice)
    }

    q['metal_type'] = e.slice(1)

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }

  const onFinish = (value) => {

    setFormSuccess(true);
    let url = window.location.href, obj = {}
    obj['FrontEnd_RegNo'] = FrontEnd_RegNo
    obj['autocode'] = design_autoCode.autoCode
    obj['design_engrave_msg'] = fInput
    obj['design_engrave_price'] = fInputPrice
    obj['matchingband_engrave_msg'] = sInput
    obj['matchingband_engrave_price'] = sInputPrice
    obj['designno'] = design_autoCode?.designCode
    obj['emailid'] = value.email
    obj['firstname'] = value.fname
    obj['lastname'] = value.lname
    obj['matchingband'] = simiband ? simiband[selectedBand]?.designno : ''
    obj['metalcolor'] = metalColor
    obj['metalpurity'] = MetalType
    obj['metaltype'] = "GOLD"
    obj['mobileno'] = value.phNumber || ''
    obj['note'] = value.notes || ''
    obj['zip'] = value.zipcode || ''
    obj['unitprice'] = finalPrice

    let encoding = encode(obj);
    dispatch(saveOrder({ data: encoding, mode: "pdsaveorder" }))

  }

  const onFinishFailed = (error) => {
    console.log(error)
  }

  const onChange = (e) => {
    console.log('checked = ', e.target.checked);
    setChecked(e.target.checked);
  };

  const changeRingSize = selected => {
    setRingSize(selected)

    let q = { ...query }
    q['ring_size'] = selected

    setQuery(q)
    const search = queryString.stringify(q);
    navigate({ search: search })
  }

  const navigateToNewTab = (url) => {
    window.open(url, '_blank');
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

  useEffect(() => {
    let p = parseFloat(Number(parseFloat(price).toFixed(2)) + Number(parseFloat(100).toFixed(2)) + Number(parseFloat(fInputPrice).toFixed(2)) + Number(parseFloat(sInputPrice).toFixed(2))).toFixed(2)
    setFinalPrice(p)
  }, [price, fInputPrice, sInputPrice])

  return (
    <>
      <Container fluid className="my-5">
        <>
          <Row>
            <Col md={1} className="d-flex flex-column">
              {imageArr.length > 0 && imageArr.map((s, index) => (
                <div className='p-2' key={index} style={{ height: "80px", width: "80px", border: '0.5px solid #ddd' }}>
                  <img src={`${imagepath}${s}`} className="w-100 object-fit-cover" onClick={() => showImage(s)} />
                </div>
              ))}
              {productArr.length > 0 && <div className='p-2' style={{ height: "80px", width: "80px", border: '0.5px solid #ddd' }}>
                <img src={require('../assets/image/View_in_3d.svg').default} alt="view in 3D" style={{ width: '90%' }} onClick={() => showImage("")} />
              </div>}
            </Col>

            <Col md={4} className="z-3 d-flex flex-column">
              {/* <div className='d-flex flex-column align-items-end' onClick={showModal}><img src={require('../assets/image/View_in_3d.svg').default} style={{ width: '7%' }} /><p className='text-primary'>VIEW IN 3D</p></div> */}

              {image !== "" ? <ReactImageMagnify className="react-image" enlargedImageContainerClassName="w-85 h-75 mx-4" enlargedImageContainerStyle={{ marginTop: '-55px' }} {...{
                smallImage: {
                  isFluidWidth: true,
                  src: `${imagepath}${image}`
                },
                largeImage: {
                  src: `${imagepath}${image}`,
                  width: 1500,
                  height: 1500,

                }
              }} />
                : imageArr.length > 0 && productArr.length > 0 && <div style={{ width: "609px", height: "619px" }}>
                  <ViewerComponent
                    json="/config.json"
                    glb="/single.glb"
                    primaryMetDmat={'https://cdnfs.optigoapps.com/content-global3/m-test2MHQ32YAG74SWCT86I' + metalColorFile}
                    enable={false}
                    // secondaryMetDmat={"/silver-925.pmat"} 
                    sideDia={'https://cdnfs.optigoapps.com/content-global3/m-test2MHQ32YAG74SWCT86I' + SS_diaColor}
                    diaDmat={'https://cdnfs.optigoapps.com/content-global3/m-test2MHQ32YAG74SWCT86I' + CS_diaColor}
                    diaNameStarts="PART_CS_0001"
                    diaName="PART_CS_0001"
                    sideDiaStarts="PART_SS_0001"
                    metal1NameStarts="Object_1"
                    // metal2NameStarts="Object"
                    isSideDiaAvail={true}
                    sideDiaSame={false}
                    twoTone={false} />
                </div>}
              <p className='text-secondary my-2'>{design_autoCode?.description}</p>


              <h6 className='fw-bold text-secondary'>BUILD NUMBER: {`${design_autoCode?.designCode || params.designno}${buildNo}`}</h6>

            </Col>



            <Col md={7} className="z-0">
              <Row className='justify-content-end'>
                <Col md={3}>
                  <p className='fw-semibold fs-6 text-primary text-right'>CHOOSE ANOTHER STYLE</p>
                </Col>
                <Col md={3}>
                  <input type="text" className='w-100 h-100' onChange={(e) => setSearch(e.target.value)} value={searchValue} />
                </Col>
                <Col md={2}>
                  <div className='btn btn-secondary w-100' onClick={() => searching()}>Search</div>
                </Col>
              </Row>
              <Row className="border border-start-0 border-end-0 border-secondary py-1 my-5">
                <Col md={12}>
                  <p className='fs-3 text-left'>{data[0]?.TitleLine}</p>
                </Col>
              </Row>
              <Row className='mt-3 align-items-center'>
                <Col md={2}>CHOOSE YOUR HEAD STYLE</Col>
                <Col md={10}>
                  <Row>
                    {head.map((r, i) => (
                      <Col md={2} key={i}>
                        <img src={require(`../${r.headimagepath}`)} className="w-100" style={headimage === r.headcode ? { border: '0.5px solid #ddd' } : {}} onClick={() => changeHead(r.headcode, i)} />
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
              <Row className='my-3'>
                <Col md={2}>PICK YOUR CENTER SHAPE</Col>
                <Col md={10}>
                  <Row>
                    {shape && shape.map((r, i) => (
                      <Col md={1} key={i} className="d-flex flex-column" style={shapeimage === r.shapecode ? { border: '0.5px solid #ddd' } : {}}>
                        <img src={require(`../${r.shapeimage}`)} className="w-100" onClick={() => changeShape(r.shapecode)} />
                        <p className='m-0 p-0'>{r.shapename}</p>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
              <Row className='mt-5'>
                <Col md={6}>
                  <p>METAL TYPE</p>
                  <Form.Item name="Metal_Type">

                    <Select defaultValue={`GOLD ${MetalType}`} onChange={changeMetalType} className='z-0' options={metalPurity.map((m) => ({
                      "label": m,
                      "value": m.slice(4)
                    }))} />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <p>RING SIZE</p>
                  <Form.Item name="Ring_Size">
                    <Select defaultValue={ringSize} onChange={changeRingSize}>
                      <Select.Option value="4">4</Select.Option>
                      <Select.Option value="4.25">4.25</Select.Option>
                      <Select.Option value="4.5">4.5</Select.Option>
                      <Select.Option value="4.75">4.75</Select.Option>
                      <Select.Option value="5">5</Select.Option>
                      <Select.Option value="5.25">5.25</Select.Option>
                      <Select.Option value="5.5">5.5</Select.Option>
                      <Select.Option value="5.75">5.75</Select.Option>
                      <Select.Option value="6">6</Select.Option>
                      <Select.Option value="6.25">6.25</Select.Option>
                      <Select.Option value="6.5">6.5</Select.Option>
                      <Select.Option value="6.75">6.75</Select.Option>
                      <Select.Option value="7">7</Select.Option>
                      <Select.Option value="7.25">7.25</Select.Option>
                      <Select.Option value="7.5">7.5</Select.Option>
                      <Select.Option value="7.75">7.75</Select.Option>
                      <Select.Option value="8">8</Select.Option>
                      <Select.Option value="8.25">8.25</Select.Option>
                      <Select.Option value="8.50">8.50</Select.Option>
                      <Select.Option value="8.75">8.75</Select.Option>
                      <Select.Option value="9">9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <p>METAL COLOR</p>
                  <Form.Item name="Metal_Type">
                    {metalColor !== "" && <Select defaultValue={metalColor} onChange={changeMetalColor} options={metalColorArr} />}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <p>CENTER CARAT WEIGHT:</p>
                  <Form.Item name="Metal_Type">

                    {CARAT && <Select defaultValue={CARAT} onChange={changeCarat} options={metalCaratArr.map((m) => ({ "label": m, "value": m }))} />}
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row>
                <Col md={6}>
                  <p>CENTER STONE Diamond</p>
                  <Form.Item name="CS_Diamond">
                    <Select defaultValue="diamond-black" onChange={changeCSDiaColor}>
                      <Select.Option value="diamond-white-1">Diamond White</Select.Option>
                      <Select.Option value="diamond-black">Diamond Black</Select.Option>
                      <Select.Option value="diamond-blue">Diamond Blue</Select.Option>
                      <Select.Option value="diamond-brown">Diamond Brown</Select.Option>
                      <Select.Option value="diamond-green">Diamond Green</Select.Option>
                      <Select.Option value="diamond-pink-light">Diamond Light Pink</Select.Option>
                      <Select.Option value="diamond-pink">Diamond Pink</Select.Option>
                      <Select.Option value="diamond-red">Diamond Red</Select.Option>
                      <Select.Option value="diamond-yellow">Diamond Yellow</Select.Option>
                      <Select.Option value="sapphire-pink">Sapphire Pink</Select.Option>
                      <Select.Option value="sapphire-green">Sapphire Green</Select.Option>
                      <Select.Option value="sapphire-yellow">Sapphire Yellow</Select.Option>
                      <Select.Option value="emerald-1">Emerald</Select.Option>
                      <Select.Option value="morganit">Morganit</Select.Option>
                      <Select.Option value="peridot">Peridot</Select.Option>
                      <Select.Option value="rhodolite-garnet">Rhodolite Garnet</Select.Option>
                      <Select.Option value="tourmalin-green">Tourmalin Green</Select.Option>
                      <Select.Option value="tourmalin-rose">Tourmalin Rose</Select.Option>
                      <Select.Option value="tsavorit">Tsavorit</Select.Option>
                      <Select.Option value="zircon-blue">Zircon Blue</Select.Option>
                      <Select.Option value="zircon-brown">Zircon Brown</Select.Option>
                      <Select.Option value="zircon-cinnamon">Zircon Cinnamon</Select.Option>
                      <Select.Option value="zircon-green">Zircon Green</Select.Option>
                      <Select.Option value="zircon-red">Zircon Red</Select.Option>
                      <Select.Option value="zircon-turquoise">Zircon Turquoise</Select.Option>
                      <Select.Option value="zircon-white">Zircon White</Select.Option>
                      <Select.Option value="zircon-yellow">Zircon Yellow</Select.Option>

                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <p>SIDE STONE Diamond</p>
                  <Form.Item name="SS_Diamond">
                    <Select defaultValue="diamond-white-1" onChange={changeSSDiaColor}>
                      <Select.Option value="diamond-white-1">Diamond White</Select.Option>
                      <Select.Option value="diamond-black">Diamond Black</Select.Option>
                      <Select.Option value="diamond-blue">Diamond Blue</Select.Option>
                      <Select.Option value="diamond-brown">Diamond Brown</Select.Option>
                      <Select.Option value="diamond-green">Diamond Green</Select.Option>
                      <Select.Option value="diamond-pink-light">Diamond Light Pink</Select.Option>
                      <Select.Option value="diamond-pink">Diamond Pink</Select.Option>
                      <Select.Option value="diamond-red">Diamond Red</Select.Option>
                      <Select.Option value="diamond-yellow">Diamond Yellow</Select.Option>
                      <Select.Option value="sapphire-pink">Sapphire Pink</Select.Option>
                      <Select.Option value="sapphire-green">Sapphire Green</Select.Option>
                      <Select.Option value="sapphire-yellow">Sapphire Yellow</Select.Option>
                      <Select.Option value="emerald-1">Emerald</Select.Option>
                      <Select.Option value="morganit">Morganit</Select.Option>
                      <Select.Option value="peridot">Peridot</Select.Option>
                      <Select.Option value="rhodolite-garnet">Rhodolite Garnet</Select.Option>
                      <Select.Option value="tourmalin-green">Tourmalin Green</Select.Option>
                      <Select.Option value="tourmalin-rose">Tourmalin Rose</Select.Option>
                      <Select.Option value="tsavorit">Tsavorit</Select.Option>
                      <Select.Option value="zircon-blue">Zircon Blue</Select.Option>
                      <Select.Option value="zircon-brown">Zircon Brown</Select.Option>
                      <Select.Option value="zircon-cinnamon">Zircon Cinnamon</Select.Option>
                      <Select.Option value="zircon-green">Zircon Green</Select.Option>
                      <Select.Option value="zircon-red">Zircon Red</Select.Option>
                      <Select.Option value="zircon-turquoise">Zircon Turquoise</Select.Option>
                      <Select.Option value="zircon-white">Zircon White</Select.Option>
                      <Select.Option value="zircon-yellow">Zircon Yellow</Select.Option>

                    </Select>
                  </Form.Item>
                </Col>
              </Row> */}
              <Row>
                <Col md={6}>
                  <p className='text-left'>Center stone not included.</p>
                  <p className='text-left'>Talk to our diamond experts to find your perfect center stone or to set your existing stone in your new mounting.</p>
                </Col>
                <Col md={6}>
                  <p className='fs-3 text-right fw-bold text-secondary'>${parseFloat(price).toFixed(2)}</p>
                </Col>
              </Row>
            </Col>
          </Row>

        </>

      </Container>

      <Container fluid>
        <Row>
          <div className="header d-flex align-items-center justify-content-center"><h3 className='text-secondary'>CHOOSE YOUR BRAND</h3></div>
          <p>Click a Wedding Band to select</p>
        </Row>
        <Row>
          {simiband && simiband.length > 0 && simiband.map((s, i) => (
            <Col md={3} key={i} onClick={() => setSelectedBand(i)}>
              <div className="w-75">

                <img src={`${imagepath}${s.OriginalImagePath}`} className={selectedBand === i ? "w-100" : "w-85 opacity-25"} />
              </div>
              <div className={selectedBand === i ? "mt-0" : "mt-3_2"}>
                <p className='text-secondary'>#{s.autocode}</p>
                <p className='text-secondary'>{s.designno}</p>
                <p className='text-secondary'>Stone count:- {s.diapcs}</p>
                <p className='text-secondary'>DIA WT :- {s.diawt}</p>
                <p className='text-secondary'>{MetalType}</p>
                <p className='text-secondary'>Recommended Band</p>
              </div>
            </Col>
          ))}

          <Col md={3} className="d-flex justify-content-end align-items-center">
            <h3 className='text-secondary'>$100.00</h3>
          </Col>
        </Row>
        <Row>
          <div className="header d-flex align-items-center justify-content-center mt-4"><h3 className='text-secondary'>MAKE IT PERSONAL!</h3></div>
          <p>Engrave your Initials, Special Date, or Secret Message - up to 10 Characters</p>
        </Row>
        <Row>
          <Col md={3}>
            <img src={`${imagepath}${productArr[0]?.MediumImagePath.split(',')[1]}`} className="w-75" />

          </Col>
          <Col md={5} className="d-flex justify-content-center flex-column">
            <Row>
              <p className='text-secondary text-left'>Optional</p>
            </Row>
            <Row className='w-100'>
              <Col md={6}>
                <input type="text" maxLength="10" onChange={(e) => { setFInput(e.target.value); e.target.value !== "" ? setFInputPrice(25) : setFInputPrice(0) }} value={fInput} className="w-100 p-2" placeholder='Enter Your Personal Message' />
              </Col>
              <Col md={6}>
                <select onChange={(e) => setFInputStyle(e)} defaultValue="helvetica" className="w-100 p-2" style={{ backgroundColor: "#f5f5f4", border: "1px solid #cdcdcd", fontSize: "19px" }}>
                  <option value="helvetica" selected={fInputStyle === "helvetica"}>Helvetica</option>
                  <option value="Scheherazade" selected={fInputStyle === "Scheherazade"}>Scheherazade</option>
                  <option value="English Script" selected={fInputStyle === "English Script"}>English Script</option>
                </select>
              </Col>
            </Row>
            <Row className='mt-5'><p className={fInputStyle === "English Srcipt" ? "seoge" : fInputStyle === "helvetica" ? "helvetica" : "normal"}>{fInput}</p></Row>
          </Col>
          <Col md={2} className="d-flex justify-content-end align-items-center">
            <h3 className='text-secondary'>${fInputPrice}</h3>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col md={3}>

            <img src={`${imagepath}${simiband && simiband[selectedBand]?.OriginalImagePath}`} className="w-75" />

          </Col>
          <Col md={5} className="d-flex justify-content-center flex-column">
            <Row>
              <p className='text-secondary text-left'>Optional</p>
            </Row>
            <Row className='w-100'>
              <Col md={6}>
                <input type="text" maxLength="10" onChange={(e) => { setSInput(e.target.value); e.target.value !== "" ? setSInputPrice(25) : setSInputPrice(0) }} value={sInput} className="w-100 p-2" placeholder='Enter Your Personal Message' />
              </Col>
              <Col md={6}>
                <select onChange={(e) => setSInputStyle(e)} defaultValue="helvetica" className="w-100 p-2" style={{ backgroundColor: "#f5f5f4", border: "1px solid #cdcdcd", fontSize: "19px" }}>
                  <option value="helvetica" selected={sInputStyle === "helvetica"}>Helvetica</option>
                  <option value="Scheherazade" selected={sInputStyle === "Scheherazade"}>Scheherazade</option>
                  <option value="English Script" selected={sInputStyle === "English Script"}>English Script</option>
                </select>
              </Col>
            </Row>
            <Row className='mt-5'><p className={sInputStyle === "English Srcipt" ? "seoge" : sInputStyle === "helvetica" ? "helvetica" : "normal"}>{sInput}</p></Row>
          </Col>
          <Col md={2} className="d-flex justify-content-end align-items-center">
            <h3 className='text-secondary'>${sInputPrice}</h3>
          </Col>
        </Row>
        <Row className='mt-5 justify-content-end'>
          <Col md={3}>
            <Row>
              <Col md={12} className="d-flex justify-content-end align-items-center">
                {finalPrice !== 0 && <h3 className='text-secondary'><span className="mx-5">TOTAL:</span>${finalPrice}</h3>}
              </Col>
              <Col md={12} className="d-flex justify-content-end align-items-center">
                <button className='border-0 mt-3 p-2 fw-semibold bg-info' onClick={saveRingModel}>SAVE THIS RING</button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='mt-5 justify-content-end'>

        </Row>
      </Container>

      <Modal size="lg" onHide={saveRingModel} backdrop="static" keyboard={false} show={saveRing} >
        <Modal.Header closeButton />
        <Modal.Body>

          <Container fluid>
            <Row className='justify-content-end'>
              <Col md={6} className="py-1 border border-end-0 border-start-0 border-secondary border-opacity-50 fs-4">{data[0]?.TitleLine}</Col>
            </Row>
            <Row>
              <Col md={3}>
                <img src={`${imagepath}${productArr[0]?.MediumImagePath.split(',')[1]}`} className="w-100" />
              </Col>
              <Col md={3}>
                <img src={`${imagepath}${simiband && simiband[selectedBand]?.OriginalImagePath}`} className="w-100" />
              </Col>

              <Col md={6}>
                <p className='text-secondary'>{design_autoCode?.description?.slice(0, 1).toUpperCase() + design_autoCode?.description?.slice(1)}</p>
                <p className='text-secondary'>Your Build Number: <span className="fw-bold">{`${design_autoCode?.designCode}${buildNo}`}</span></p>
                <p className='text-secondary'>Matching Band Selected: <span className="fw-bold">{simiband && simiband[selectedBand]?.designno}</span></p>
                <p className='text-secondary'>Finger Size: <span className="fw-bold">{ringSize}</span></p>
              </Col>
            </Row>
            {formSuccess &&
              <>
                <div className={!saveLoading && saveSuccess.length === 0 ? "visible d-flex justify-content-center" : saveSuccess.length === 0 ? "visible" : "invisible"}>
                  <div className="spinner-border" role="status">
                    <span class="sr-only">.</span>
                  </div>
                </div>
                <div className={saveSuccess.length === 0 ? "invisible" : !saveLoading && saveSuccess.length > 0 && "visible flex-column d-flex justify-content-center align-items-center my-2"}>
                  <p>Email Sent Successfully</p>
                  <p className='mt-1'>Thank You</p>
                </div>
              </>
            }

            <div className={saveLoading ? "invisible" : saveSuccess.length > 0 ? "invisible" : "visible"}>
              <Row className='mt-5'>
                <p>Fill out the form below to have this ring and it's details emailed to you.</p>
              </Row>
              <Form initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Row className='mt-3'>
                  <Col md={6}>
                    <Form.Item name="fname" rules={[{ required: true, message: "First name is required" }]}><Input placeholder="* First name" /></Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item name="lname" rules={[{ required: true, message: "Last name is required" }]}><Input placeholder="* Last name" /></Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Item name="email" rules={[{ required: true, message: "Email is required" }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "this is not valid email" }]}>
                      <Input placeholder='* Email Address' />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item name="salesRep" >
                      <Input placeholder='Sales Representative' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Item name="phNumber" rules={[
                      { pattern: /^(\+\d{1,3}[- ]?)?\d{10,15}$/, message: "Phone number length should be between 10 to 15" }
                    ]}><InputNumber placeholder="Phone Number" className='w-100' controls={false} /></Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item name="zipcode" rules={[
                      { pattern: /^(\+\d{1,3}[- ]?)?\d{6}$/, message: "Zip code is not valid" }
                    ]}><Input placeholder="Zip Code" /></Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Item name="notes">
                      <Input.TextArea rows={4} placeholder="Notes" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Item name="contactSales">
                      <Checkbox checked={checked} onChange={onChange} >Please have a sales representative contact me</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <p>By clicking Save This Ring you agree to be contacted by a sales representative to assist with any inquiries about this item.</p>
                  </Col>
                </Row>
                <Row className={formSuccess ? (!saveLoading && saveSuccess.length > 0 ? 'my-0' : saveLoading && 'my-2_5') : !formSuccess && 'justify-content-center my-5'}>
                  <Col md={4}>
                    <Button type="primary" htmlType="submit" className='text-dark fw-semibold px-4 py-2' style={{ backgroundColor: 'rgb(245, 245, 244)', border: 'rgb(245, 245, 244)' }}>Save the Ring</Button>
                  </Col>
                </Row>
              </Form>
            </div>


          </Container>

        </Modal.Body>

      </Modal>

      {/* 3D image in a model view */}
      {/* <Modal
        onHide={showModal}
        backdrop="static"
        keyboard={false}
        show={modal} >
        <Modal.Header closeButton>
          <Modal.Title>3D Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={showModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default Product