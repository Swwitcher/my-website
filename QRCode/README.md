#  QR codes dynamiques 
https://dept-info.labri.fr/~narbel/PdP/Subjects20-21/pdp_chaumette2.html


# Plan :
1. Explication de notre architecture de dossiers/dépendances.
2. Document d'installation utilisateur.


1. # Architecture :

### Ici on retrouve les tests effectués avant le rendu du cahier des besoins ###
data
|_____    tests
|        |____ Java
|        |       |____ src
|        |       |        |____ QRGenerator.java
|        |       |____ qr1.png
|        |
|        |____ Python
|        |       |____ speedtest.py

### Ici on retrouve les slides des audits et le cahier des besoins ###
docs
|_____    report
|_____    requirements
|        |____ Cahier des charges QRCode
|        |____ Cahier des charges QRCode.zip
|_____    slides
|        |____ audits
|        |       |____ 10-02-21
|        |       |        |____ Projet de programmation QrCode Dynamique.pdf
|        |       |____ 17-03-21
|        |       |        |____ Projet de programmation QrCode Dynamique.pdf
|_____    defense

### Ici on retrouve les rapports des tds ###
organiz
|_____    architecture
|_____    backlog_tasks
|_____    meeting_reports
|        |____ 21_01_27-meeting.txt
|        |____ ...

### Ici on retrouve l'architexture de notre code ###
src
|_____    backEnd
|        |____ Plugins
|        |       |____ ContentHelper
|        |       |        |____ Contact.py
|        |       |        |____ ...
|        |       |____ PluginReturn 
|        |       |        |__ PluginReturn.py
|        |       |____ __test_error_severe.py
|        |       |____ __test_error.py
|        |       |____ clock.py
|        |       |____ ...
|        |
|        |____ Redirection
|               |____ ... .png
|        |____ error_qrcode.png
|        |____ expired_qrcode.png
|        |____ OrchestratorFunction.py
|        |____ QrCode_Generation.py
|
|_____    frontEnd
|        |____ GeneratedQrCodes
|               |____ ... .png
|        |____ standalone
|        |       |____ qrcodes
|        |       |       |____ ... .json
|        |       |       |____ ... .png
|        |       |____ StandaloneDisplay.py
|        |____ web
|        |       |____ qrcodes
|        |       |       |____ ... .json
|        |       |       |____ ... .png
|        |       |____ index.html
|        |       |____ redirection.php
|        |       |____ web_Intermediary.php
|        |       |____ WebClientDisplay.js
|
|_____   tests
|        |____ OrchestratorFunction_UT.py
|        |____ QrCode_Generation_UT.py



2. # Documentation utilisateur

- Le dépôt git du projet est le suivant :
  https://services.emi.u-bordeaux.fr/projet/git/qr-pdp-2021
  git clone https://services.emi.u-bordeaux.fr/projet/git/qr-pdp-2021

# Installation nécessaire pour la version Standalone : Python3.6 au minimum.

- Certaines librairies pip3 sont à installer :
    pip3 install pyqrcode
    pip3 install pyzbar
    sudo apt-get install zbar-tools (si problème avec linux)
    pip3 install pypng
    pip3 install Pillow
    pip3 install Tkinter
    sudo apt-get install python-tk (Si pip3 détecte pas Tkinter)
    pip3 install jsonschema
    pip3 install filelock
    
    Sur Windows, il faut utiliser python -m pip install <nom du module>

- Il ne reste plus qu'à aller dans qr-pdp-2021/src/frontEnd/standalone/ et taper cette commande : python3 StandaloneDisplay.py

- S'affiche alors à l'écran l'interface standalone.
    Pour quitter : echap ou fermer manuellement la fenêtre avec la croix.
    Pour changer le plugin affiché : cliquer sur le menu déroulant et choisir en cliquant sur le plugin voulu (au démarrage il est sur secret).
    Pour activer/désactiver le mode redirection : cocher/décocher la boite à cocher.

- Informations supplémentaires :

    Pour ajouter un <nom-plugin.py>, il faut avant de lancer le programme le mettre dans qr-pdp-2021/src/backEnd/Plugins/
    puis lancer l'afficheur standalone.
    L'ajout / retrait d'un plugin en cours d'exécution ne sera pas visible dans le menu déroulant (pas d'actualisation automatique).

    Il est possible de redimensionner la taille de la fenêtre qui au départ est à ScreenWidth/2 x ScreenHeight/2.
    La redimension est bloquée en dessous de la taille limite minimale (sinon ce serait illisible).

    La date et heure du prochain refresh de QR code ne s'affiche pas pour le mode redirection car l'image est statique.


# Installation nécessaire pour la version Web+Redirection :

- Il est nécessaire d'effectuer toutes les étapes de l'installation de la version Standalone pour cette version.
- Il faudra installer en plus un serveur web. Pour ce tutoriel nous considérerons qu'il s'agit d'Apache2.
- Il faut accorder les droits d'accès aux fichiers à www-data, le nom d'utilisateur qu'utilise Apache2 pour fonctionner :
  sudo chmod www-data:www-data -R à la racine  du projet.

- Par défaut, l'affichage des logs sont désactivés (question de sécurité), il est possible de les réactiver dans web_intermediary.php pour du débogage.


- Pour intégrer le système sur son site web, il faut placer le fichier src/frondEnd/web/web_Intermediary.php sur une URL accessible depuis internet,
  de même pour  src frontEnd/web/WebClientDisplay.js.

- Dans le fichier WebClientDisplay.js, il faut changer la constante INTERMEDIAIRE_URL en lui donnant comme valeur l'adresse de web_Intermediary.php.