import axios from 'axios';
import {
    getShapeLoading, getShapeSuccess, getShapeError
} from '../slice/shape.slice'
import { auth, encode, payloadAssemble } from '../utils/encoding';

const baseUrl = process.env.REACT_APP_API_KEY;

 //payloadAssemble(value,mode,v)

 export function getShapeWare(payload) {
    return (dispatch)=>{
        dispatch(getShapeLoading())
        axios.post(baseUrl,payloadAssemble(payload.frontEncoding, payload.mode),{headers:auth("V2","")})
        .then((res)=>{
            const {rd} = JSON.parse(res.data.d)         
            dispatch(getShapeSuccess(rd))
        })
        .catch((error)=>{
            dispatch(getShapeError(error))
        })
    }
 }