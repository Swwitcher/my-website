import pyqrcode
import time

start = time.time()

for i in range(50):
    QR = pyqrcode.create("Ceci est un test de QR code", "H", 40)
    QR.png("output/QRcode" + str(i) + ".png", scale=5)

end = time.time()

print(end - start)


