var APY_KEY='a5a47c18197737e8eeca634cd6acb581';

if (typeof jQuery != 'undefined') {  
    // jQuery is loaded => print the version
    console.log(jQuery.fn.jquery);
}else{
    console.log('jquery not loaded');
}

$(function(){

    console.log('JQuery loaded succesfully');
    $('#srch_btn').on('click',function(){
        $('#citySelector').show();
        
        var tst2Search=$('#txtSearch').val();
        searchCity(tst2Search)
    });

    $('#citySel').on('change',function(){
        var citySel=$('#citySel option:selected');
        var lat=citySel.data("lat");
        var lon=citySel.data("long");
        var city_name=citySel.html();
        getCityForecast(lat,lon,city_name)
    });
});

function searchCity(tst2Search){
    $('.loader').show();
    $.ajax({
        url:"https://search.reservamos.mx/api/v2/places?q="+tst2Search,
        method:"GET",
        success:function(data){
            $.each(data,function(index,element){
                var opt='<option data-lat="'+element.lat+'" data-long="'+element.long+'">'+element.display+","+element.state+'</option>'
                $('#citySel').append(opt);
            });
            $('.loader').hide();
        },
        error:function(xhr, msg, err){
            $('.loader').hide();
            console.log(xhr,msg,err);
        }
    }

    );    
}

function getCityForecast(lat,lon,city_name){
    $('.loader').show();
    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&appid="+APY_KEY,
        method:"GET",
        success:function(data){
            cityForecastCards=createHeader(city_name,data.daily);
            $('#contryResult').append(cityForecastCards);
            $('.loader').hide();
        },
        error:function(xhr, msg, err){
            $('.loader').hide();
            console.log(xhr,msg,err);
        }
    });
}

function createHeader(title,data){
    var retStr='';
    
    retStr+='<div class="card bg-primary mb-3 mt-3">';
        retStr+='<div class="card-header">';
        retStr+='<p class="text-center text-light">'+title+'</p>';
        retStr+='</div>';
        retStr+='<div class="card-body bg-info">';
            retStr+='<div class="row">';
            $.each(data,function(index,element){
                var dayData={
                    dt:element.dt,
                    cloud:element.clouds,
                    temp:element.temp.day,
                    min:element.temp.min,
                    max:element.temp.max,
                    pressure:element.pressure,
                    humidity:element.rain
                }
                retStr+=createDayCard(dayData);
            });
            retStr+='</div>';
        retStr+='</div>';
    retStr+='</div>';

    return retStr;
}

function createDayCard(dayData){
    var humidity='';
    if(dayData.humidity==undefined){
        humidity='n/a';
    }else{
        humidity=dayData.humidity;
    }
    console.log(dayData.dt);
    var date = new Date(dayData.dt * 1000);
    console.log(date);
    dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
    console.log(dateFormat);
    retStr='';
    retStr+='<div class="col-2 mb-3">';
        retStr+='<div class="card">';
            retStr+='<div class="card-header">'+dateFormat+'</div>';
            retStr+='<div class="card-body">';
                retStr+='<div class="row">';
                    retStr+='<div class="col"><i class="fa-solid fa-cloud-sun"></i> '+dayData.cloud+'</div>';
                    retStr+='<div class="col"><i class="fa-solid fa-temperature-three-quarters"></i> '+dayData.temp+'</div>';
                retStr+='</div>';
                retStr+='<div class="row">';
                    retStr+='<div class="col"><i class="fa-solid fa-circle-minus"></i> '+dayData.min+'</div>';
                    retStr+='<div class="col"><i class="fa-solid fa-circle-plus"></i> '+dayData.max+'</div>';
                retStr+='</div>';
                retStr+='<div class="row">';
                    retStr+='<div class="col"><i class="fa-solid fa-gauge"></i> '+dayData.pressure+'</div>';
                    retStr+='<div class="col"><i class="fa-solid fa-droplet"></i> '+ humidity +'</div>';
                retStr+='</div>';
            retStr+='</div>';
        retStr+='</div>';
    retStr+='</div>';
    return retStr;
}

