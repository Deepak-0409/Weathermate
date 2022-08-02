const express= require("express");
const app = express();
const bodyParser=require("body-parser");
const https= require("https");


app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const airquality=["","Good","Moderate","Unhealthy for sensitive Group","Unhealthy","Very Unhealthy","Hazardous"];
let temper, desc, imageURL, epaCode;
let query="";

app.get("/",function (req,res)
{
    res.render("index");
})

app.post("/",function(req,res)
{
    console.log("Post received");
    query=req.body.city;
    const apiKey="cd597ce594974d5784d103853221803";
    const url="https://api.weatherapi.com/v1/current.json?key="+apiKey+"&q="+query+"&aqi=yes";
    https.get(url,function (response)
    {
        console.log(response.statusCode);
        if(response.statusCode!=200)
        {
           res.render("error",{city: query.toUpperCase() });
        }
        else
        {
            response.on("data",function (data)
            {
                const weatherData=JSON.parse(data);
                temper=weatherData.current.temp_c;
                desc=weatherData.current.condition.text;
                imageURL="https:"+weatherData.current.condition.icon;
                epaCode=weatherData.current.air_quality['us-epa-index'];
                console.log(weatherData);
                
                res.redirect("/results");
            });

        }
    })
} )

app.get("/results",function(req,res)
{
    const cityName=query.toUpperCase();
    res.render("result",{temperature: temper, description: desc, airQuality: airquality[epaCode], imgUrl: imageURL, city: cityName});
})

app.listen(process.env.PORT || 3500,function ()
{
    console.log("Server ported at 3500");
})