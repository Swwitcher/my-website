from PluginReturn.PluginReturn import PluginReturn
import time


def getContent() -> PluginReturn:
    content = time.strftime("%H:%M:%S")
    refreshTime = 5  # in s
    return PluginReturn(content, refreshTime)


def getDefaultContent() -> PluginReturn:
    return PluginReturn('12:00:00', 60)
