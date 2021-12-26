
from PluginReturn.PluginReturn import PluginReturn
import datetime


def getContent() -> PluginReturn:
    expiryTime = datetime.datetime(2021, 3, 12, 16, 29, 10)
    content = 'This is my secret message, only scannable until '
    content += str(expiryTime)
    refreshTime = 60
    return PluginReturn(content, refreshTime, expiryTime)


def getDefaultContent() -> PluginReturn:
    return PluginReturn('Hello?', 60)
