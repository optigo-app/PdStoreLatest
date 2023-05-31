 import axios from 'axios';
import { getBannerLoading, getBannerSuccess, getBannerError} from '../slice/banner.slice'
import { auth, payloadAssemble } from '../utils/encoding';

 const baseUrl = process.env.REACT_APP_API_KEY;

 //payloadAssemble(value,mode,v)

 export function getBannerWare() {
    return (dispatch)=>{
        dispatch(getBannerLoading())
        axios.post(baseUrl,payloadAssemble("","pdbanner"),{headers:auth("V2","")})
        .then((res)=>{
            const {banner,imagepath,FrontEnd_RegNo,isDataEdit} = JSON.parse(res.data.d).rd[0]
            dispatch(getBannerSuccess({banner,imagepath,isDataEdit,FrontEnd_RegNo:{FrontEnd_RegNo}}))
        })
        .catch((error)=>{
            dispatch(getBannerError())
        })
    }
 }