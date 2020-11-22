try {

  const successCallback = (position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    // latDisp.innerHTML = position.coords.latitude.toFixed(2);
    // lonDisp.innerHTML = position.coords.longitude.toFixed(2);

    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], function(Map, MapView, Graphic, GraphicsLayer) {
    
      let map = new Map({
        basemap: "topo-vector"
      });
    
      let view = new MapView({
        container: "viewDiv",
        map: map,
        center: [position.coords.longitude, position.coords.latitude], // longitude, latitude
      zoom: 14
      });
      let graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      let deltaPoint1 = 0.025*Math.random();
      let deltaPoint2 = 0.025*Math.random();
      let plusMinus1 = Math.random();
      let plusMinus2 = Math.random();
      let plusMinus3 = Math.random();
      let plusMinus4 = Math.random();
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      
      let latP1; 
      let lonP1;  
      let latP2;  
      let lonP2;  
      
      if (plusMinus1>0.5){
        latP1 = lat+deltaPoint1;
      }else{
        latP1 = lat-deltaPoint1;
      }
      
      if (plusMinus2>0.5){
        lonP1 = lon+deltaPoint1;
      }else{
        lonP1 = lon-deltaPoint1;
      }
      
      if (plusMinus3>0.5){
        latP2 = lat+deltaPoint2;
      }else{
        latP2 = lat-deltaPoint2;
      }
      
      if (plusMinus4>0.5){
        lonP2 = lon+deltaPoint2;
      }else{
        lonP2 = lon-deltaPoint2;
      }

      
      
      let point = {
        type: "point",
        longitude: lonP1,
        latitude: latP1
      };



      let point2 = {
        type: "point",
        longitude: lonP2,
        latitude: latP2
      };

    
      let simpleMarkerSymbol = {
        type: "simple-marker",
         color: [226, 119, 40],  // orange
        outline: {
           color: [255, 255, 255], // white
          width: 1
        }
      };

      let simpleMarkerSymbol2 = {
        type: "simple-marker",
         color: [50, 226, 100],  // orange
        outline: {
           color: [255, 255, 255], // white
          width: 1
        }
      };
    

    
      // let pointGraphic = new Graphic({
      //   geometry: point,
      //   symbol: simpleMarkerSymbol
      // });
      // let pointGraphic2 = new Graphic({
      //   geometry: point2,
      //   symbol: simpleMarkerSymbol2
      // });
    

    
      // graphicsLayer.add(pointGraphic);
      // graphicsLayer.add(pointGraphic2);
      // console.log(view);
    });


  };

  const errorCallback = (error) => {
    console.error(error);
    alert("Geolocation required. Please reload page with Geolocation active");
    // latLonDisp.innerHTML = ``;
  };


  if(`geolocation` in navigator) {
    /* geolocation is available */
    console.log(`Geolocation Available`);

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    /* geolocation IS NOT available */
    console.log(`Geolocation Not Available`);
    // latLonDisp.innerHTML = ``;
  }



} catch (error) {
  console.error(error);
  alert(error);
}