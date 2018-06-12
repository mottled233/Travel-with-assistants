$(document).ready(function(){
  zoom_scale= [0,  0,0,0,0,0,0,0,0,0,0,0,0,0,[1.428571e-04,1.190476e-04], [7.272727e-05,5.714286e-05], [3.614458e-05, 2.884615e-05], [1.798561e-05,1.492537e-05], [9.009009e-06,7.246376e-06]];
  $("#map").click(function(e){ 
      var zoom = parseInt($("#now_zoom").val());
      var longitude = parseFloat($("#now_longitude").val());
      var latitude = parseFloat($("#now_latitude").val());
      var height = parseInt($("#now_height").val());
      var width = parseInt($("#now_width").val());
      var x = e.pageX - $('#map').offset().left-width/2;
      var y = e.pageY - $('#map').offset().top-height/2; 
      var click_longitude = longitude+x*zoom_scale[zoom][0];
      var click_latitude = latitude-y*zoom_scale[zoom][1];
      getNewMap(click_longitude,click_latitude,zoom);
  });
  
  $(".direction").click(function(){
    var id = $(this).attr('id');
    var longitude = parseFloat($("#now_longitude").val());
    var latitude = parseFloat($("#now_latitude").val());
    var zoom = parseInt($("#now_zoom").val());
    var step = 0.001*((19-zoom));
    switch(id){
      case "up":
        latitude+=step*0.5;
        break;
      case "down":
        latitude-=step*0.5;
        break;
      case "right":
        longitude+=step;
        break;
      case "left":
        longitude-=step;
        break;
    }
    
    getNewMap(longitude, latitude, zoom);
  });
  
  $("#my_pos").click(function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("该浏览器不支持定位功能！");
    }
  });
  
  $("#jump_to").click(function(){
    var longitude = $("#longitude").val();
    var latitude = $("#latitude").val();
    var zoom = parseInt($("#now_zoom").val());
    if(isNull(longitude) || isNull(latitude))return;
    
    getNewMap(longitude, latitude, zoom);
  });
  
  $(".zoom").click(function(){
    var longitude = $("#now_longitude").val();
    var latitude = $("#now_latitude").val();
    var zoom = $("#now_zoom").val();
    if(isNull(longitude) || isNull(latitude) || isNull(zoom))return;
    id = $(this).attr("id");
    if(id == "zoom_minus") zoom=parseInt(zoom)-1;
    else if(id == "zoom_plus") zoom=parseInt(zoom)+1;
    
    if(zoom>=3&&zoom<=18){
      getNewMap(longitude, latitude, zoom);
    }
  });
  
  function updateMap(img_url){
    $("#map").attr("src",img_url);
  }
  
  function getNewMap(longitude=116.403874,latitude=39.914888,zoom=11,width=800,height=600){
    var url = "/static_maps/" + longitude + "/" + latitude +"?format=json";
    url += "&height="+height + "&width"+width;
    url += "&zoom="+zoom;
    $.get(url,function(data,status){
      var map = data["map"];
      map = map.replace(/&amp;(\w+)=/g, "&$1=");
      updateMap(map);
      $("#longitude").val(longitude);
      $("#latitude").val(latitude);
      $("#now_longitude").val(longitude);
      $("#now_latitude").val(latitude);
      $("#now_height").val(height);
      $("#now_width").val(width);
      $("#now_zoom").val(zoom);
    });
  }
  
  function showPosition(position) {
    getNewMap(position.coords.longitude,position.coords.latitude,17);
  }
  
  function showError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("用户拒绝对获取地理位置的请求。");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("位置信息是不可用的。");
      break;
    case error.TIMEOUT:
      alert("请求用户地理位置超时。");
      break;
    case error.UNKNOWN_ERROR:
      alert("未知错误。");
      break;
    }
  }
  function isNull( str ){
    if ( str==null || str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  }
  
  
  
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      alert("该浏览器不支持定位功能！");
      updateMap();
  }
  
});