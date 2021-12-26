import enum


class WifiTypes(enum.Enum):
    wep = 'WEP'
    wpa = 'WPA'
    wpa2 = 'WPA2-EAP'
    nopass = 'nopass'


class Wifi:

    def __init__(self, ssid: str, wifiType: WifiTypes, password: str = None):

        if not isinstance(wifiType, WifiTypes):
            message = 'The parameter wifiType should be of type'
            message += ' <enum \'WifiTypes\'> (i.e use "WifiTypes.wpa").'
            raise TypeError(message)

        if wifiType not in WifiTypes:
            raise ValueError('The value given for wifiType is not correct')

        if wifiType == WifiTypes.nopass and password is not None:
            message = 'When the wifi type is "nopass", '
            message += 'no password should be given in parameter.'
            raise ValueError(message)

        if wifiType != WifiTypes.nopass and password is None:
            message = 'When the wifi type isn\'t "nopass", '
            message += 'a password should be given in parameter.'
            raise ValueError(message)

        self.ssid = ssid
        self.wifiType = wifiType
        self.password = password

    def __str__(self):

        result = 'WIFI:T:' + self.wifiType.value
        if self.wifiType == WifiTypes.nopass:
            return result + ';S:' + self.ssid + ';;'
        else:
            return result + ';S:' + self.ssid + ';P:' + self.password + ';;'
