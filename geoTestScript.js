let map;
let findButton = document.getElementById(`findButton`);
let latInp = document.getElementById(`Lat`);
let lonInp = document.getElementById(`Lon`);
require([
  "esri/map", "esri/tasks/locator", "esri/graphic",
  "esri/geometry/webMercatorUtils",
  "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
  "esri/InfoTemplate", "esri/Color",
  "dojo/number", "dojo/parser", "dojo/dom", "dijit/registry",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!","esri/layers/GraphicsLayer"
], function(
  Map, Locator, Graphic,
  webMercatorUtils,
  SimpleMarkerSymbol, SimpleLineSymbol,
  InfoTemplate, Color,
  number, parser, dom, registry
) {
  parser.parse();

  map = new Map("map", {
    basemap: "streets",
    center: [-100, 40],
    zoom: 14
  });

  let locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

  let infoTemplate = new InfoTemplate("Location", "Address: ${Address}");
  let symbol = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_CIRCLE,
    15,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([0, 0, 255, 0.5]),
      8
    ),
    new Color([0, 0, 255])
  );

  locator.on("location-to-address-complete", function(evt) {
    if (evt.address.address) {
      let address = evt.address.address;
      let location = webMercatorUtils.geographicToWebMercator(evt.address.location);
      //this service returns geocoding results in geographic - convert to web mercator to display on map
      // let location = webMercatorUtils.geographicToWebMercator(evt.location);
      let graphic = new Graphic(location, symbol, address, infoTemplate);
      map.graphics.add(graphic);

      map.infoWindow.setTitle(graphic.getTitle());
      map.infoWindow.setContent(graphic.getContent());

      //display the info window with the address information
      let screenPnt = map.toScreen(location);
      map.infoWindow.resize(200,100);
      map.infoWindow.show(screenPnt, map.getInfoWindowAnchor(screenPnt));
    }
  });

  findButton.addEventListener(`click`,function(event){
    event.preventDefault();
    console.log(latInp.value.toString());
    console.log(lonInp.value.toString());
    console.log(typeof map._params.center.x);
    console.log(map._params.center.x);
    console.log(map._params.center.y);
    console.log(map._params.zoom);
    console.log(map);
    map._params.center.x = Number(latInp.value);
    console.log(map._params.center.x);
  })

  map.on("click", function(evt) {
    map.graphics.clear();
    locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 100);
    console.log(evt.mapPoint);
    console.log(webMercatorUtils.webMercatorToGeographic(evt.mapPoint));
    console.log(locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 100));
  });
});