import sys
import os
import json
import importlib
import time
from QrCode_Generation import QRCode
from shutil import copyfile
from filelock import Timeout, FileLock


# ///////// CONFIG /////////
redirectionFolder = "Redirection/"
pluginFolder = "Plugins/"
redirectionURL = "https://dynqr.r-entries.com/redirection.php?plugin="
# /////// END CONFIG ///////


# Because this function can be called from anywhere, the folder
# Plugins is added to the PATH. Without it, the imports inside the
# plugin file will not work as the folder Plugins isn't included.
absolutePath = os.path.abspath(os.path.dirname(__file__))
sys.path.append(absolutePath + '/' + pluginFolder)

from PluginReturn.PluginReturn import PluginReturn


def loadJSON(filePath):
    lock = FileLock(filePath + ".lock")
    with lock:
        with open(filePath, 'r') as file:
            return json.load(file)


def saveJSON(filePath, data):
    lock = FileLock(filePath + ".lock")
    with lock:
        with open(filePath, 'w') as file:
            json.dump(data, file)


def deleteCache():
    if os.path.isfile(absolutePath + '/cache.json'):
        os.remove(absolutePath + '/cache.json')


def createOrUpdateCacheEntry(cacheFile, pluginName, pluginReturn):
    cacheFile[pluginName] = {
        'content': pluginReturn.content,
        'refreshTime': time.time() + pluginReturn.refreshTime,
        'expiryTime': pluginReturn.expiryTime
    }


# Get all files ending with ".py" inside the Plugins folder (not recursively)
def getPluginsNames():
    files = os.listdir(absolutePath + '/' + pluginFolder)
    # file[-3:] correspond to the last 3 characters of the filename
    # file[:-3] correspond to the filename without its extension
    # Here we are listing all files in /Plugins that have '.py' as
    # their extension.
    return [file[:-3] for file in files if file[-3:] == '.py']


def main(pluginName, folderName):

    cachePath = absolutePath + '/cache.json'
    # Create the file if it doesn't exist.
    if not os.path.isfile(cachePath):
        saveJSON(cachePath, {})

    # Reset the cache file if it is incorrectly formatted.
    try:
        cacheFile = loadJSON(cachePath)
    except:
        saveJSON(cachePath, {})
        cacheFile = loadJSON(cachePath)

    returnImgPath = folderName + pluginName + '.png'
    returnJsonPath = folderName + pluginName + '.json'
    returnFile = {}

    firstTime = pluginName not in cacheFile.keys()

    # If the QR code hasn't reached its expiryTime
    if firstTime or time.time() < cacheFile[pluginName]['expiryTime']:

        # If the refreshTime is expired
        if firstTime or cacheFile[pluginName]['refreshTime'] < time.time():

            # Imports the appropriate plugin and get the content for the
            # QR code. If there is an exception while running getContent,
            # retrieve the default content instead.
            errorWithPlugin = False
            plugin = importlib.import_module(pluginName)
            try:
                pluginReturn = plugin.getContent()
            except:
                try:
                    pluginReturn = plugin.getDefaultContent()
                except:
                    errorWithPlugin = True
                    content = 'Error with plugin ' + pluginName
                    pluginReturn = PluginReturn(content, 60)

            if not errorWithPlugin:

                if not firstTime:
                    oldContent = cacheFile[pluginName]['content']

                createOrUpdateCacheEntry(cacheFile, pluginName, pluginReturn)

                if not firstTime:
                    # If the last generated image content isn't the same as
                    # this one generates the QR code with this content and
                    # save the file in the folder given in parameter.
                    if oldContent != cacheFile[pluginName]['content']:
                        QRCode(pluginReturn.content).toPNG(returnImgPath)

                # If the QR code hasn't reached its expiryTime
                elif time.time() < cacheFile[pluginName]['expiryTime']:
                    QRCode(pluginReturn.content).toPNG(returnImgPath)
            else:
                createOrUpdateCacheEntry(cacheFile, pluginName, pluginReturn)
                copyfile(absolutePath + '/error_qrcode.png', returnImgPath)

    # If the QR code has reached its expiryTime
    if time.time() > cacheFile[pluginName]['expiryTime']:
        cacheFile[pluginName]['refreshTime'] = sys.maxsize
        cacheFile[pluginName]['content'] = 'Le QR code n\'est plus disponible'
        copyfile(absolutePath + '/expired_qrcode.png', returnImgPath)

    returnFile['content'] = cacheFile[pluginName]['content']
    returnFile['refreshTime'] = cacheFile[pluginName]['refreshTime']

    saveJSON(cachePath, cacheFile)
    saveJSON(returnJsonPath, returnFile)


# Generate the PNG static QR code pointing towards the website.
def generateRedirectionQRcodes():
    for plugin in getPluginsNames():
        redirectionImgPath = absolutePath + '/'
        redirectionImgPath += redirectionFolder + plugin + '.png'
        if not os.path.isfile(redirectionImgPath):
            QRCode(redirectionURL + plugin).toPNG(redirectionImgPath)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        # Gets the parameters from the command line parameters
        pluginName = sys.argv[1]
        folderName = sys.argv[2]

        main(pluginName, folderName)

    else:

        generateRedirectionQRcodes()
