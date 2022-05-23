let currentProgress=[];
const RES_ARR=[];

async function readFileData(file){
    const FILEREADER=new FileReader();
    FILEREADER.readAsDataURL(file);
    return new Promise((resolve,reject)=>{
        FILEREADER.onerror=(evt)=>{
            console.error(evt);
            console.error("Error occured reading files");
            alert("Error occured reading files.\nPlease try again.");
            reject("Error occured reading files")
        }   

        FILEREADER.onloadend=()=>{
            resolve(FILEREADER.result);
        }
    });
}

function validateFormat(fileName){
    return /\.(jpeg|jpg|png|gif)$/g.test(fileName);
}

export async function handleInputData(files){
        const IMAGES=[];
        if(files.length>3)
        {
            alert("You can only upload three images at a time.");
            return IMAGES;
        }

        for(let file of files)
        {
            if(!validateFormat(file.name))
            {
                alert("We only allow images of format: jpeg,jpg,png or gif.\nPlease choose the right format and try again.");
                break;
            }

            const NAME=file.name.replace(/\b\.(jpeg|jpg|png|gif)$/g,"");
            IMAGES.push({url:await readFileData(file),name:NAME});
        }

        return IMAGES;
}

function handleProgress(evt,identifier,numberOfImages,setProgress,isLoading){
    const ISPRESENT=currentProgress.findIndex(({imgId})=>{
        return imgId===identifier;
    });

    const PROGRESS=Math.round((evt.loaded*100.0)/evt.total);

    if(isFinite(PROGRESS)&&ISPRESENT>=0)
    {
        currentProgress=currentProgress.map((value)=>{
            if(value.imgId===identifier){
                value.progress=PROGRESS;
                return value;
            }else
            {
                return value;
            }
        });
    }else
    {
        currentProgress.push({imgId:identifier,progress:PROGRESS});
    }

    const CURRENT_PROGRESS_ARR=currentProgress.map(({progress})=>{
        return progress;
    });

    if(currentProgress.length===numberOfImages)
    {
        isLoading("no");
        setProgress(Math.min.apply(null,CURRENT_PROGRESS_ARR));
    }
}

function handleLoad(url,UPLOAD_RES,noOfValuesToUpload,setResults,RES_ARR){
    if(/\b\.cloudinary\.\b/g.test(url)){
        let public_id=JSON.parse(UPLOAD_RES).public_id;
        let userName=JSON.parse(localStorage.getItem("userData")).userName;
        RES_ARR.push({
            public_id:public_id,
            ownerName:userName,
            name:`${userName}_${public_id}_weird`
        });
        if(RES_ARR.length===noOfValuesToUpload)
        {
            setResults(RES_ARR);
        }
        return;
    }
    return UPLOAD_RES;
}

export async function makeReq(url,method,data,identifier,noOfValuesToUpload,setProgress,isLoading,setResults){
    return new Promise((succeed,fail)=>{

        isLoading("yes");
        const XHR=new XMLHttpRequest();

        XHR.open(method,url,true);

        if(/\b\.cloudinary\.\b/g.test(url)==="false")
        {
            XHR.setRequestHeader("Req-Name",identifier);
            XHR.setRequestHeader("Content-Type","application/json");
        }

        XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        XHR.upload.onprogress=(evt)=>{
            handleProgress(evt,identifier,noOfValuesToUpload,setProgress,isLoading);
        }

        XHR.onerror=()=>{
            isLoading("no")
            alert(`Error occured making the ${identifier} request`);
        }

        XHR.onabort=()=>{
            isLoading("no")
            alert("request was not aborted");
        }

        XHR.onload=()=>{
            if(XHR.status>=500)
            {
                alert("Couldn't upload image due to an internal server error.")
                isLoading("no");
                fail("Server error");
            }

            const UPLOAD_RES=XHR.response;

            if(XHR.readyState===XMLHttpRequest.DONE)
            {
                handleLoad(url,UPLOAD_RES,noOfValuesToUpload,setResults,RES_ARR);
                //save the response publicId in an array of ids then send them to backEnd to be saved in the dataBase
                succeed(UPLOAD_RES);
            }
        }

        if(data.toString().length>0)
        {
            
            var sendData=JSON.stringify(data);

            if(/\b\.cloudinary\.\b/g.test(url))
            {
                sendData=new FormData();
                sendData.append("file",data.file);
                sendData.append("api_key",data.api_key);
                sendData.append("timestamp",data.timestamp);
                sendData.append("signature",data.signature);
                sendData.append("upload_preset","weird");
                sendData.append("detection","lvis_v1");
            }

            console.log(sendData);
            XHR.send(sendData);
        }else
        {
            XHR.send();
        }

    });
}

export async function generateSignature(setProgress,isLoading){
    let {data}=JSON.parse(await makeReq("/generateSignature","get","","gen_Sig",0,setProgress,isLoading).then(res=>res,err=>err))
    return data;
}

export async function sendToCloudinary(data){
    const {file,identifier,numberOfImages,signatureObj,setProgress,isLoading,setResults}=data;

    const UPLOAD_DATA={},
        CLOUDINARY_URL="https://api.cloudinary.com/v1_1/karerisspace/image/upload";

    UPLOAD_DATA.timestamp=signatureObj.timestamp;
    UPLOAD_DATA.api_key=signatureObj.api_Key;
    UPLOAD_DATA.signature=signatureObj.signature;
    UPLOAD_DATA.file=file;

    // UPLOAD_DATA.append("file",file);
    // UPLOAD_DATA.append("timestamp",signatureObj.timestamp);
    // UPLOAD_DATA.append("api_key",signatureObj.api_key);
    // UPLOAD_DATA.append("signature",signatureObj.signature);
    // UPLOAD_DATA.append("upload_preset","weird");
    // UPLOAD_DATA.append("detection","lvis_v1");

    makeReq(CLOUDINARY_URL,"post",UPLOAD_DATA,identifier,numberOfImages,setProgress,isLoading,setResults);
    // const RESULTS=await makeReq("/storeImageRef","post",UPLOAD_DATA,identifier,numberOfImages,setProgress,isLoading);
    // return setResults(currentResults.concat(RESULTS));
}

export function storeInDb(data,setProgress,isLoading,setDoneStatus,setResults){

    const URL="/storeImageRef"

    makeReq(URL,"post",data,"storeImgRefs",`${URL}_${data[0].public_id}`,1,setProgress,isLoading)
    .then((data)=>{
        let res=JSON.parse(data);

        if(res.msg==="saved")
        {
            setResults([res.msg]);
            setDoneStatus("yes");
        }
    },(err)=>{
        setResults(err);
        setDoneStatus("no");
        RES_ARR.splice(0,RES_ARR.length);
    });
}

/**
 * Take an array of objects to store in the localStorage
 * @param {*} data 
 */
export function saveToLocalStorage (data){
    for(let item of data){
        window.localStorage.setItem(item.key,item.value);
        window.dispatchEvent(new Event("storage"));
    };
}