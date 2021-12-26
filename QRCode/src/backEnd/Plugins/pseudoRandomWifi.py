from PluginReturn.PluginReturn import PluginReturn
from ContentHelper.Wifi import *

from datetime import date
import random

'''
This plugin could be used to create a dynamic QR code displayed in a store or
company. The goal is to have a different random password for the guest
WiFi hotspot every day. Please note that we are using our ContentHelper class
for WiFi which remove the need to know how WiFi QR code are encoded.
'''


def getContent() -> PluginReturn:

    # The pseudo random sequence of numbers will be
    # the same throughout the same day
    random.seed(str(date.today()))

    availableCharacters = 'abcdefghijklmnopqrstupwxyz'
    availableCharacters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    availableCharacters += '0123456789'

    passwordLength = 7

    ssid = "MyWifiSSID"
    password = ''.join(random.choices(availableCharacters, k=passwordLength))

    content = Wifi(ssid, WifiTypes.wpa, password)
    refreshTime = 24 * 60 * 60

    return PluginReturn(content, refreshTime)


def getDefaultContent() -> PluginReturn:
    content = Wifi('DefaultWiFi', WifiTypes.wpa, 'MyStrongPassword')
    return PluginReturn(content, 60)
