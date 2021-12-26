import os
import unittest
import sys
import random
from jsonschema import validate
import uuid
import time
import pyzbar.pyzbar
from PIL import Image
import hashlib

# Because this function can be called from anywhere, the folder
# Plugins is added to the PATH. Without it, the imports inside the
# plugin file will not work as the folder Plugins isn't included.
absolutePath = os.path.abspath(os.path.dirname(__file__))
sys.path.append(absolutePath + '/../backEnd')
from OrchestratorFunction import *


# Browse the keys of the two dictionaries
# and check if their values are the same
def compareDicts(dict1, dict2):
    return all(k in dict2 and dict1[k] == dict2[k]
               for k in dict1) \
        and all(k in dict1 and dict1[k] == dict2[k]
                for k in dict2)


class TestJson(unittest.TestCase):

    # Initialization of a random data which is saved on a Json file
    # and immediatly loaded in order to verify its content
    def testSaveAndLoadJson(self):

        for i in range(100):
            t = time.time()
            randomData = {
                'content': t,
                'refreshTime': t,
                'expiryTime': t+3600*24
            }

            saveJSON('test.json', randomData)
            dict = loadJSON('test.json')
            try:
                validate(dict, randomData)
                bool = compareDicts(randomData, dict)
                assert(bool)
            except Exception as valid_err:
                print('Validation KO: {}'.format(valid_err))
                raise valid_err
            os.remove('test.json')
        return

    def testCompareDicts(self):

        # Comparing 100 dictionnaries with the same keys and values
        for i in range(100):
            t1 = time.time()
            t2 = time.time() + random.randint(1, 1000)

            dict1 = {
                        'content': t1,
                        'refreshTime': t1,
                        'expiryTime': t1 + 3600 * 24
                    }

            dict2 = {
                        'content': t1,
                        'refreshTime': t1,
                        'expiryTime': t1 + 3600 * 24
                    }

            assert(compareDicts(dict1, dict2))

            # Comparing dictionnaries with the same keys but
            # not the same values
            dict3 = {
                        'content': t2,
                        'refreshTime': t2,
                        'expiryTime': t2 + 3600 * 24
                    }

            assert(not compareDicts(dict1, dict3))

            # Comparing dictionnaries with differents keys
            dict4 = {
                        'content2': t1,
                        'refreshTime2': t1,
                        'expiryTime2': t1 + 3600 * 24
                    }

            assert(not compareDicts(dict1, dict4))

    def testClock(self):
        deleteCache()

        pluginName = 'clock'
        folderName = ''
        main(pluginName, folderName)

        self.assertTrue(os.path.exists('clock.json'))
        self.assertTrue(os.path.exists('clock.png'))

        oldDict = loadJSON('clock.json')

        # We wait 1 second before calling back the main
        # in order to see if the json has been changed or not
        # (it should not change)
        time.sleep(1)
        main(pluginName, folderName)

        newDict = loadJSON('clock.json')
        assert(compareDicts(oldDict, newDict))

        # We wait 4 second before calling back the main
        # in order to see if the json has been changed or not
        # (it should change)
        time.sleep(4)

        main(pluginName, folderName)
        newDict = loadJSON('clock.json')
        assert(not compareDicts(oldDict, newDict))

        os.remove('clock.json')
        os.remove('clock.png')

    def testExpired(self):
        deleteCache()

        # We test if, when the QrCode is expired,
        # we have the expired_qrcode Image
        pluginName = '__test_expired'
        folderName = ''
        main(pluginName, folderName)

        content = 'Le QR code n\'est plus disponible'
        Dict = loadJSON('__test_expired.json')
        assert (Dict['content'] == content)

        with open('__test_expired.png', 'rb') as f:
            bytes = f.read()  # read file as bytes
            hash1 = hashlib.md5(bytes).hexdigest()

        with open(absolutePath + '/expired_qrcode.png', 'rb') as f:
            bytes = f.read()  # read file as bytes
            hash2 = hashlib.md5(bytes).hexdigest()
        assert(hash1 == hash2)

        os.remove('__test_expired.json')
        os.remove('__test_expired.png')

    def test_error(self):
        deleteCache()

        pluginName = '__test_error'
        folderName = ''

        main(pluginName, folderName)

        self.assertTrue(os.path.exists('__test_error.json'))
        self.assertTrue(os.path.exists('__test_error.png'))

        Dict = loadJSON('__test_error.json')

        assert(Dict['content'] == 'DefaultContent')

        os.remove('__test_error.json')
        os.remove('__test_error.png')

    def test_error_severe(self):
        deleteCache()

        pluginName = '__test_error_severe'
        folderName = ''

        main(pluginName, folderName)

        content = 'Error with plugin ' + pluginName
        Dict = loadJSON('__test_error_severe.json')
        assert (Dict['content'] == content)

        os.remove('__test_error_severe.json')
        os.remove('__test_error_severe.png')

    def testGenerateRedirectionQRcodes(self):
        generateRedirectionQRcodes()
        existingPlugins = ['clock', 'pseudoRandomWifi',
                           'secret', '__test_error_severe', '__test_error']

        for i in existingPlugins:
            path = absolutePath + '/Redirection/' + i + '.png'
            self.assertTrue(os.path.exists(path))
            expectedURL = 'https://dynqr.r-entries.com/'
            expectedURL += 'redirection.php?plugin=' + i

            decodedURL = pyzbar.pyzbar.decode(Image.open(path))[0]
            decodedURL = decodedURL.data.decode('utf-8')
            assert(expectedURL == decodedURL)
            os.remove(path)

    # We test getPluginsNames with the existing files: clock.py,
    # pseudoRandomWifi.py, Secret.py,
    # __test_error_severe.py and __test_error.py
    def testGetPluginsNames(self):
        existingPlugins = []
        existingPlugins += ['__test_error_severe']
        existingPlugins += ['__test_error']
        existingPlugins += ['__test_expired']
        pluginsList = getPluginsNames()
        assert(len(pluginsList) != 0)
        for i in existingPlugins:
            assert(i in pluginsList)


if __name__ == '__main__':
    unittest.main()
