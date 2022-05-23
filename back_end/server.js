"use strict";

import http from "http";
import routeMap from "./lib/routes.js";
import handlers from "./lib/handlers.js";
import { StringDecoder } from "string_decoder";
import helpers from "./lib/helpers.js";

const Port=3001||process.env.port;

const server=http.createServer();

server.on("request",(req,res)=>{
    
    const decoder=new StringDecoder("utf-8"),
        parsedUrl=new URL(req.url,`http://${req.headers.host}`),
        method=req.method,
        path=parsedUrl.pathname,
        reqIdentifier=req.headers["req-name".toLowerCase()],
        reqReceivedStatus=helpers.checkIfReqIsDuplicate(reqIdentifier);

    console.log(reqIdentifier);
    let payLoad="";

    res.setHeader("Access-Control-Allow-Origin","http://localhost:8080");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers",["Content-Type","Req-Name"]);

    if(reqReceivedStatus.receiveStatus=="not received")
    {
        req.on("data",(chunk)=>{
            payLoad+=decoder.write(chunk);
        });
    
        req.on("end",()=>{
            //finish assembling the payload from the request
            payLoad+=decoder.end();
    
            const choosenRouteHandler=Object.keys(routeMap).includes(path)?routeMap[path]:handlers.notFound,
                reqData={
                    method,
                    reqIdentifier,
                    payLoad:payLoad.length>0?JSON.parse(payLoad):{}};
    
            choosenRouteHandler(reqData,function(statusCode,resData){
                //if statusCode is provided use it if not default to 204
                typeof statusCode == "number"?statusCode:204;
    
                //if resData ie responseData is provide use it if not default to an empty object
                typeof resData == "object" && !( Array.isArray(resData) ) ?resData:{};
    
                resData=JSON.stringify(resData);
    
                res.setHeader("Content-Type","application/json");
                res.writeHead(statusCode);
                res.write(resData);
                res.end();
    
                //the response shown
                // console.log(`StatusCode is: ${statusCode} with responseData: ${resData}`);
            });
        });
    };

    if(reqReceivedStatus.receiveStatus=="received")
    {
        let resData={msg:"Request was already received await reponse."};
        res.write(JSON.stringify(resData));
        res.end();
    };
});

server.listen(Port,()=>{
    console.log(`Server listening on http://localhost:${Port}`);
});