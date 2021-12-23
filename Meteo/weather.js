/**
 * @author Théo EL HOULALI
 */
let map, toCollect, values, layer

map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([3.106255531311035, 47.03213884031304]),
        zoom: 6
    })
});

map.on('click', function (evt) {
    let click = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
    toCollect = "lat=" + click[1] + "lng=" + click[0]

    map.removeLayer(layer)
    layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([click[0], click[1]]))
                })
            ]
        })
    });
    map.addLayer(layer);
    displayInfos()
});

/**
 * @param {string} tag The tag of the day we want to collect data
 * @returns {string} HTML content to display the list of the day's temperatures
 */
function hoursString(tag) {
    let toAdd = "<div class=\"container\">"

    toAdd += "<div class=\"row\">"
    for (let i = 0; i < 10; ++i)
        toAdd += "<div class=\"col\">0" + i + "h00</div>"
    for (let i = 10; i < 12; ++i)
        toAdd += "<div class=\"col\">" + i + "h00</div>"
    toAdd += "</div>"

    toAdd += "<strong><div class=\"row\">"
    for (let i = 0; i < 12; ++i)
        toAdd += "<div class=\"col\">" + values[tag]["hourly_data"][i.toString() + "H00"]["TMP2m"] + "°C</div>"
    toAdd += "</div></strong>"

    toAdd += "<div class=\"row\">"
    for (let i = 12; i < 24; ++i)
        toAdd += "<div class=\"col\">" + i + "h00</div>"
    toAdd += "</div>"

    toAdd += "<strong><div class=\"row\">"
    for (let i = 0; i < 12; ++i)
        toAdd += "<div class=\"col\">" + values[tag]["hourly_data"][i.toString() + "H00"]["TMP2m"] + "°C</div>"
    toAdd += "</div></strong>"

    toAdd += "</div>"
    return toAdd
}

/**
 * @description Display on the website the city and country name, or the latitude & longitude if we don't have city name
 */
function displayCity() {
    let city = values["city_info"]["name"]
    let country = values["city_info"]["country"]
    let lat = values["city_info"]["latitude"]
    let lng = values["city_info"]["longitude"]

    if (city != "NA" && country != "--")
        document.querySelector("#ville").innerHTML = city + ", " + country
    else {
        fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+lat+"&longitude="+lng+"&localityLanguage=fr")
            .then(response => response.json())
            .then((data) => {
                city = data.locality
                country = data.countryName
                document.querySelector("#ville").innerHTML = city + (country != "" ? ", " + country : "") //Do not put the comma if we have no country name (ex: Golfe du Lion  - instead of - Golfe du Lion,)
            }).catch(err => {
                console.log(err)
                document.querySelector("#ville").innerHTML = lat + ", " + lng
            });
    }
}

/**
 * @description Display on the website the current day, temperature and conditions
 */
function displayCurrent() {
    document.querySelector("#date").innerHTML = values["current_condition"]["hour"] + ", " + values["current_condition"]["date"]
    document.querySelector("#temperature").innerHTML = "<strong>" + values["current_condition"]["tmp"] + "°C" + "</strong>"
    document.querySelector("#condition").innerHTML = values["current_condition"]["condition"] + "<img src=\"" + values["current_condition"]["icon"] + "\"</img>"
}

/**
 * @param {string} day The day we want to display conditions
 * @description Display on the website the day given, temperatures and conditions
 */
function displayJ(day) {
    let tag = "fcst_day_" + day
    document.querySelector("#date").innerHTML = values[tag]["date"]
    document.querySelector("#temperature").innerHTML = hoursString(tag)
    document.querySelector("#condition").innerHTML = values[tag]["condition"] + "<img src=\"" + values[tag]["icon"] + "\"</img>"
}

/**
 * @description Get the city name in the headder and display current conditions from it
 */
function getInput() {
    toCollect = document.querySelector("#input").value
    displayInfos()
}

/**
 * @description Collect data from the city and display current conditions
 */
function displayInfos() {
    fetch("https://www.prevision-meteo.ch/services/json/" + toCollect)
        .then(response => response.json())
        .then((out) => {
            values = out
            if (values['errors'] != undefined) {
                alert(values['errors']['0']['text'] + ". " + values['errors']['0']['description'])
            } else {
                displayCity(values)
                displayCurrent(values)
                document.querySelector("#affichage").hidden = false;
            }
        }).catch(err => {
            alert("Un problème est survenu, veuillez réessayer.")
            console.error(err)
        });
}