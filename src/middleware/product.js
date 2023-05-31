import axios from 'axios';
import { getProductLoading, getProductSuccess, getProductError, getPriceLoading, getPriceSuccess, getPriceError, saveOrderLoading, saveOrderSuccess, saveOrderError, colorImageRequest, colorSuccess, colorError } from '../slice/product.slice'
import { auth, encode, payloadAssemble } from '../utils/encoding';

const baseUrl = process.env.REACT_APP_API_KEY;

//payloadAssemble(value,mode,v)

export function getProductWare(payload) {

    return (dispatch) => {
        dispatch(getProductLoading())
        axios.post(baseUrl, payloadAssemble(payload.frontEncoding, payload.mode), { headers: auth("V2", "") })
            .then((res) => {
                let metalCarat = []
                const { rd } = JSON.parse(res.data.d)
                rd.map((r, i) => {
                    if (r['diawt']) {
                        !metalCarat.includes(r['diawt']) && metalCarat.push(r['diawt'])
                    }
                })

                dispatch(getProductSuccess({ rd, metalCarat }))
            })
            .catch((error) => {
                dispatch(getProductError())
            })
    }
}

export function getPDstorePrice(payload) {
    return (dispatch) => {
        dispatch(getPriceLoading())
        axios.post(baseUrl, payloadAssemble(payload.frontEncoding, payload.mode), { headers: auth("V2", "") })
            .then((res) => {
                const { rd } = JSON.parse(res.data.d);
                let metalColor = [], metalPurity = [], metalColorObj = []

                rd.forEach((r) => {

                    if (r['metalcolor']) {
                        if (!metalColor.includes(r['metalcolor'])) {
                            let a = r['metalcolor'].replaceAll(" ", "_")
                            let obj = {}
                            obj['label'] = r['metalcolor'];
                            obj['value'] = a
                            metalColorObj.push(obj)
                            metalColor.push(r['metalcolor'])
                        }
                    }
                    if (r['metalpurity']) {
                        let a = 'GOLD ' + r['metalpurity']
                        !metalPurity.includes(a) && metalPurity.push(a)
                    }
                })
                dispatch(getPriceSuccess({ "pdprice": rd, metalPurity, "metalColor": metalColorObj }))
            })
    }
}

export function saveOrder(payload) {
    return (dispatch) => {
        dispatch(saveOrderLoading())
        axios.post(baseUrl, payloadAssemble(payload.data, payload.mode), { headers: auth("V2", "") })
            .then((resp) => {
                const { rd } = JSON.parse(resp.data.d)
                // console.log(rd)
                dispatch(saveOrderSuccess(rd))
            })
            .catch((error) => dispatch(saveOrderError(error)))
    }
}

export function colorImage(payload) {
    return (dispatch)=>{
        dispatch(colorImageRequest());
        axios.post(baseUrl,payloadAssemble(payload.frontEncoding, payload.mode), { headers: auth("V2", "") })
        .then((res)=>{
            const { rd } = JSON.parse(res.data.d)
            console.log(rd);
            dispatch(colorSuccess(rd))
        })
        .catch((error)=>{
            dispatch(colorError(error))
        })
    }
}