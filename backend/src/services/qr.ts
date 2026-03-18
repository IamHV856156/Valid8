import QRCode from "qrcode";
export const qr = async(id:string, slung:string,token:string) : Promise<string>=>{
try{
    const data = JSON.stringify({
        i:id,
        s:slung,
        t:token
    });

    const Generateqr = await QRCode.toDataURL(data,{
        errorCorrectionLevel:'M',
        margin:2,
        scale:8,
        color:{
            dark:'#000000',
            light:'#ffffff',
        },
    });
    return Generateqr;
} catch(err){
    console.error(' QR genration error', err);
    throw new Error('Failed to generate QR code');
}
};