
import { useState, useEffect } from 'react';
import QRCode from 'qrcode'

function Collection(props){

    const [qrCode, setQrCode] = useState('');

    const generateQR = text => {
        QRCode.toDataURL(text)
        .then(url => {
            setQrCode({qrCode:url});
        })
        .catch(err => {
            console.error("获取二维码报错", err);
        })
    }

    useEffect(()=>{

        generateQR(props.walletAddress);
    },[]);

    return (
        <div style={{fontSize:'14px', width:'80%', display:'block', wordBreak:'normal', wordWrap:'break-word', textAlign:'center', paddingLeft:'10%'}}>
            <img src={qrCode.qrCode}/>
            <div>{props.walletAddress}</div>
        </div>
    )
}

export default Collection;