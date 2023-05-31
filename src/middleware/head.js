import axios from 'axios';
import {
    getHeadLoading, getHeadSuccess, getHeadError
} from '../slice/head.slice'
import { auth, encode, payloadAssemble } from '../utils/encoding';

const baseUrl = process.env.REACT_APP_API_KEY;

 //payloadAssemble(value,mode,v)

 export function getHeadWare(payload) {
    return (dispatch)=>{
        dispatch(getHeadLoading())
        axios.post(baseUrl,payloadAssemble(payload.frontEncoding, payload.mode),{headers:auth("V2","")})
        .then((res)=>{
            const {rd} = JSON.parse(res.data.d)         
            dispatch(getHeadSuccess(rd))
        })
        .catch((error)=>{
            dispatch(getHeadError())
        })
    }
 }