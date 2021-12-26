import datetime
import sys
import time


class PluginReturn:

    def __init__(self,
                 content: str,
                 refreshTime: int = None,
                 expiryTime: datetime.date = None):

        if expiryTime is None:
            expiryTime = sys.maxsize
        else:
            # Convert datetime into unix epoch
            expiryTime = time.mktime(expiryTime.timetuple())

        if refreshTime is None:
            refreshTime = sys.maxsize

        self.content = str(content)
        self.refreshTime = refreshTime
        self.expiryTime = expiryTime
