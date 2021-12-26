import unittest
import os
import sys
import pyzbar.pyzbar
from PIL import Image

# Because this function can be called from anywhere, the folder
# Plugins is added to the PATH. Without it, the imports inside the
# plugin file will not work as the folder Plugins isn't included.
absolutePath = os.path.abspath(os.path.dirname(__file__))
sys.path.append(absolutePath + '/../backEnd')

from QrCode_Generation import QRCode, ErrorCorrection


class TestStringMethods(unittest.TestCase):

    # Attempts to create a QRCode with a invalid error correction type
    # Expects a ValueError exception
    def test_init_errorCorrection_ValueError(self):
        with self.assertRaises(TypeError):
            myQR = QRCode('QRCode', errorCorrection='Z')

    # Attempts to create a QRCode with two invalid sizes (too low, too high)
    # Expects a ValueError exception
    def test_init_size_ValueError(self):
        with self.assertRaises(ValueError):
            myQR = QRCode('QRCode', size=-2)
        with self.assertRaises(ValueError):
            myQR = QRCode('QRCode', size=50)

    # Attempts to create a QRCode with a valid size.
    # The selected size should be the same as the given one
    def test_init_size(self):
        myQR = QRCode('QRCode', size=5)
        self.assertEqual(myQR.getSize(), 5)

    # # Attempts to create a QRCode without giving a size.
    # # The selected size should be None
    def test_init_size_default(self):
        myQR = QRCode('QRCode')
        self.assertEqual(myQR.getSize(), None)

    # Create a QRCode with a size too small for the amount of content given
    # If the given size is too small, it will use the default size instead.
    # The QRCode should be generated successfully nonetheless
    def test_auto_correction_size(self):
        path = 'unit_testing_autocorrection_size.png'
        content = 'a' * 100
        myQR = QRCode(content, size=1)
        myQR.toPNG(path)
        self.__checkQRFileExists(path)
        # Remove the generated file once done
        os.remove(path)

    def test_mode_kanji(self):
        path = 'unit_testing_kanji.png'
        content = '昨日すき焼きを食べました'
        myQR = QRCode(content)
        myQR.toPNG(path)
        self.__checkQRFileExists(path)
        # Remove the generated file once done
        os.remove(path)

    def test_mode_url(self):
        path = 'unit_testing_url.png'
        content = 'http://www.example.com/d%C3%BCsseldorf'
        content += '?neighbourhood=L%C3%B6rick'
        myQR = QRCode(content)
        myQR.toPNG(path)
        self.__checkQRFileExists(path)
        # Remove the generated file once done
        os.remove(path)

    def test_mode_unicode(self):
        path = 'unit_testing_unicode.png'
        content = 'ĚĀ⛔ⶾᦖʫ㧈ʫѼ⸨ℳ'
        myQR = QRCode(content)
        myQR.toPNG(path)
        self.__checkQRFileExists(path)
        # Remove the generated file once done
        os.remove(path)

    def test_mode_bug_with_single_unicode(self):
        path = 'unit_testing_unicode.png'
        # Āℳ would work
        content = 'ℳ'
        myQR = QRCode(content)
        myQR.toPNG(path)
        self.__checkQRFileExists(path)
        # Remove the generated file once done
        os.remove(path)

    def test_mode_bug_with_contentGrec(self):
        path = 'unit_testing_contentGrec.png'
        # test caractere Alphabet Grec => ok
        contentGrec = ['α', 'β', 'γ', 'Γ', 'δ', 'Δ', 'ε', 'Ε', 'Μ', 'Ξ', 'Ω']
        for content in contentGrec:
            myQR = QRCode(content)
            myQR.toPNG(path)
            self.__checkQRFileExists(path)
            # Remove the generated file once done
            os.remove(path)

    def test_mode_bug_with_contentChanges(self):
        path = 'unit_testing_contentChanges.png'
        # test caractere Des monnaies => OK
        contentOk = ['$', '¢', '£']
        # test caractere Des monnaies => FAILLED
        contentFailed = ["50€"]
        for content in contentFailed:
            myQR = QRCode(content)
            myQR.toPNG(path)
            self.__checkQRFileExists(path)
            # Remove the generated file once done
            os.remove(path)

    def test_mode_bug_with_contentSciences(self):
        path = 'unit_testing_contentSciences.png'
        contentSciences = ['°', 'µ', '<', '>', '≤', '≥', '=']
        for content in contentSciences:
            myQR = QRCode(content)
            myQR.toPNG(path)
            self.__checkQRFileExists(path)
            # Remove the generated file once done
            os.remove(path)

    def test_mode_bug_with_contentList(self):
        path = 'unit_testing_contentList.png'
        contentList = ['"', '«', '»', '‹', '›', '!', '?']
        for content in contentList:
            myQR = QRCode(content)
            myQR.toPNG(path)
            self.__checkQRFileExists(path)
            # Remove the generated file once done
            os.remove(path)

    def test_mode_bug_with_contentAlphabetical(self):
        path = 'unit_testing_contentAlphabetical.png'
        contentAlphabetical = ['á', 'Á', 'â', 'Â', 'à', 'À', 'å']
        for content in contentAlphabetical:
            myQR = QRCode(content)
            myQR.toPNG(path)
            self.__checkQRFileExists(path)
            # Remove the generated file once done
            os.remove(path)

    def __checkQRFileExists(self, path: str):
        # Check if the file exists
        self.assertTrue(os.path.exists(path))

    def __checkQRFileContent(self, path: str, content: str):
        self.__checkQRFileExists(self, path)
        # Check if the content is correct
        tmp = pyzbar.pyzbar.decode(Image.open(path))[0]
        self.assertTrue(tmp.data.decode('utf-8') == content)


if __name__ == '__main__':
    unittest.main()
