import enum


class MapTypes(enum.Enum):
    Geo = ['geo:', ',']
    GoogleMaps = ['https://maps.google.com/maps?q=', ',', '']
    GoogleEarth = ['https://earth.google.com/web/search/', ',', '']
    Bing = ['https://bing.com/maps/default.aspx?cp=', '~', '']
    OpenStreetMap = ['https://www.openstreetmap.org/#map=16/', '/', '']
    Apple = ['https://maps.apple.com/?daddr=', ',', '']
    ZoomEarth = ['https://zoom.earth/#view=', ',', ',16z']
    Here = ['https://wego.here.com/?map=', ',', ',15']


class Map:

    def __init__(self,
                 latitude: str,
                 longitude: str,
                 mapType: MapTypes = MapTypes.Geo):

        if not isinstance(wifiType, WifiTypes):
            message = 'The parameter mapType should be of type '
            message += '<enum \'MapTypes\'> (i.e use "MapTypes.GoogleMaps").'
            raise TypeError(message)

        self.latitude = latitude
        self.longitude = longitude
        self.mapType = mapType

    def __str__(self):
        result = self.mapType.value[0]
        result += self.latitude
        result += self.mapType.value[1]
        result += self.longitude
        result += self.mapType.value[2]
        return result

# e = Map('44.832913', '-0.647989', MapTypes.Yandex)
# print(e)
