from PluginReturn.PluginReturn import PluginReturn
import time


def getContent() -> PluginReturn:
    assert(True == False)
    return PluginReturn('', 60)


def getDefaultContent() -> PluginReturn:
    assert(True == False)
    return PluginReturn('DefaultContent', 60)
