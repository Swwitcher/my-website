const INTERMEDIAIRE_URL = 'web_Intermediary.php';
const GENERATED_URL = 'qrcodes/';

window.onload = function() {

  let x = document.getElementsByClassName('qrCodeDyn');
  for (var i = 0; i < x.length; i++) {
    elem = x[i];
    var img = document.createElement("img");
    elem.appendChild(img);
    fetchQrCodes(elem, false);
  }

  let y = document.getElementsByClassName('qrCodeDynRedirection');
  for (var i = 0; i < y.length; i++) {
    elem = y[i];
    var p = document.createElement("p");
    elem.appendChild(p);
    fetchQrCodes(elem, true);
  }
};

function fetchQrCodes(elem, redirection) {

  fetch(INTERMEDIAIRE_URL + '?plugin=' + elem.getAttribute('pluginName'))
    .then(response => {

      if (!redirection) {

        var elemImg = elem.getElementsByTagName('img')[0];

        elemImg.src = GENERATED_URL + elem
          .getAttribute('pluginName') + '.png?' + Date.now();

        elemImg.onclick = function(){
          fetch(GENERATED_URL + elem.getAttribute('pluginName') + '.json')
                .then(response => response.json())
                .then(data => {
                  alert(data.content);
                });
        };

        elemImg.onerror = function() {
          console.log("Image had an error while loading");
          setTimeout(() => {
            elemImg.src = GENERATED_URL + elem
              .getAttribute('pluginName') + '.png?' + Date.now();
          }, 1000);
        }
      }

      fetch(GENERATED_URL + elem.getAttribute('pluginName') + '.json')
        .then(response => response.json())
        .then(data => {
          const timestamp = Date.now();
          const interval = Math.max(data.refreshTime * 1000 - timestamp, 1000);

          if (redirection) {
            elem.getElementsByTagName('p')[0].innerHTML = data.content;
          }

          setTimeout(function() {
            fetchQrCodes(elem, redirection)
          }, Math.floor(interval));
        })

        .catch(error => {
          setTimeout(function() {
            console.log("JSON had an error while loading"); 
            fetchQrCodes(elem, redirection)
          }, 10000);
        });

    });

}
