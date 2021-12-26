import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.EnumMap;
import java.util.Map;

public class QRGenerator {

    public static void main(String[] args) {
        String myCodeText = "ℳ";
        // String myCodeText = "www.google.fr";
        String filePath = "./qr1.png";
        int size = 2048;
        String FileType = "PNG";
        File file = new File(filePath);
        try {

            Map<EncodeHintType, Object> HintType = new EnumMap<EncodeHintType, Object>(EncodeHintType.class);
            HintType.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            HintType.put(EncodeHintType.MARGIN, 1);
            Object put = HintType.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);

            QRCodeWriter MyQr = new QRCodeWriter();
            BitMatrix Matrix = MyQr.encode(myCodeText, BarcodeFormat.QR_CODE, size, size, HintType);

            int Width = Matrix.getWidth();

            BufferedImage Image = new BufferedImage(Width, Width, BufferedImage.TYPE_INT_RGB);

            Image.createGraphics();
            Graphics2D graphics = (Graphics2D) Image.getGraphics();
            graphics.setColor(Color.WHITE);
            graphics.fillRoundRect(0, 0, Width, Width, 0, 0);

            graphics.setColor(Color.BLACK);

            //On parcourt la matrice et on colorie les pixels
            for (int i = 0; i < Width; i++) {
                for (int j = 0; j < Width; j++) {
                    if (Matrix.get(i, j)) {
                        graphics.fillRect(i, j, 1, 1);

                    }
                }
            }
            //On écrit l'image sur le fichier
            ImageIO.write(Image, FileType, file);

            System.out.println("QrCode printed");
        } catch (WriterException e) {
            System.out.println("Writing Exception");
        } catch (IOException e) {
            System.out.println("IO Exception");
        }

    }
}
