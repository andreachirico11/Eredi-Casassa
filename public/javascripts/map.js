const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}&callback=initMap`;
script.defer = true;
document.body.appendChild(script);

let gmap;
const coo = {
  lat: 44.3177348,
  lng: 9.3241951,
};
const url =
  'https://www.google.it/maps/place/Casassa+Eredi+(S.A.S.)/@44.317653,9.3219863,17z/data=!3m1!4b1!4m5!3m4!1s0x12d4987fc9d96917:0x20c2196c4468ac76!8m2!3d44.317653!4d9.324175';
function initMap() {
  gmap = new google.maps.Map(document.getElementsByClassName('gMap')[0], {
    center: coo,
    zoom: 16,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
  });
  const mk = new google.maps.Marker({
    position: coo,
    map: gmap,
    title: 'Eredi Casassa',
  });
  google.maps.event.addListener(mk, 'click', () => {
    window.location = url;
  });
}
