import os
import sys
import subprocess
import tkinter
import json
import time
from PIL import Image, ImageTk

# Absolute path of the folder which contains this file
selfFolderPath = os.path.abspath(os.path.dirname(__file__))

# /////// CONFIG ///////

imageFolder = selfFolderPath + '/qrcodes/'
backEndFolder = selfFolderPath + '/../../backEnd/'
backEndImageFolder = backEndFolder + 'Redirection/'
errorImage = 'error.png'
font = 'times 15'
backgroundColor = 'white'
foregroundColor = 'black'
windowTitle = 'Afficheur standalone'
minWindow = (350, 300)  # in px
startMaximize = True

# ///// END CONFIG /////


# Open a json file
def loadJSON(filePath):
    with open(filePath, 'r') as file:
        return json.load(file)


def Orchestrator(options=''):
    command = ' "' + backEndFolder + 'OrchestratorFunction.py"'
    e = subprocess.call('python3' + command + ' ' + options, shell=True)
    if (e != 0):
        e = subprocess.call('python ' + command + ' ' + options, shell=True)
    return e


# Get all files ending with ".py" inside the Plugins folder (not recursively)
def getPluginsNames():
    files = os.listdir(backEndFolder + 'Plugins/')
    # file[-3:] correspond to the last 3 characters of the filename
    # file[:-3] correspond to the filename without its extension
    # Here we are listing all files in /Plugins that have '.py' as
    # their extension.
    return [file[:-3] for file in files if file[-3:] == '.py']


class Standalone:

    def __init__(self):
        window = tkinter.Tk()
        window.minsize(minWindow[0], minWindow[1])
        window.configure(bg=backgroundColor)
        window.option_add('*Font', font)
        window.option_add('*Background', backgroundColor)
        window.option_add('*Foreground', foregroundColor)
        window.title(windowTitle)
        window.bind('<Escape>', lambda _: window.destroy())

        initialWidth = int(window.winfo_screenwidth() / 2)
        initialHeight = int(window.winfo_screenheight() / 2)
        window.geometry(str(initialWidth) + 'x' + str(initialHeight))

        if startMaximize:
            try:
                window.state('zoomed')
            except:
                window.attributes('-zoomed', True)

        frame = tkinter.Frame(window)
        frame.pack()

        pluginsNames = getPluginsNames()
        self.pluginName = pluginsNames[0]
        options = tkinter.StringVar(window)
        options.set(self.pluginName)

        self.checkboxChecked = tkinter.IntVar()

        tkinter.OptionMenu(
            frame,
            options,
            *pluginsNames,
            command=self.userInput).pack(side=tkinter.LEFT)

        tkinter.Checkbutton(
            frame,
            text='Redirection',
            variable=self.checkboxChecked,
            padx=30,
            command=self.userInput).pack(side=tkinter.RIGHT)

        self.timer = tkinter.Label(window, pady=10)
        self.timer.pack()

        self.canvas = tkinter.Canvas(window)
        self.canvas.pack(fill="both", expand=1)
        self.canvas.bind('<Configure>', lambda _: self.displayImage())

        self.updateImage()

        window.mainloop()

    # Call updateImageOnce and setup a new update in TTL seconds
    def updateImage(self):

        timerText = ''

        # If the redirection checkbox is checked
        if (self.checkboxChecked.get()):

            # We call Fonction Orchestratrice to make sure
            # the redirection QR code have been generated
            if Orchestrator():
                self.qrImage = Image.open(imageFolder + errorImage)
            else:
                self.qrImage = Image.open(
                    backEndImageFolder + self.pluginName + '.png')

        else:

            # We call OrchestratorFunction to generate
            # the latest QR code image for this plugin.
            # If there is a problem while running the command
            options = self.pluginName + ' "' + imageFolder + '"'
            if Orchestrator(options):
                self.qrImage = Image.open(imageFolder + errorImage)
            else:
                self.qrImage = Image.open(
                    imageFolder + self.pluginName + '.png')

            # Load the json file corresponding to the image
            imageJson = loadJSON(imageFolder + self.pluginName + '.json')

            # Calculate the next refreshTime in seconds.
            # Makes  refreshTime is at least 1s long (safety measures).
            if imageJson['refreshTime'] != sys.maxsize:
                refreshTime = max(imageJson['refreshTime'] - time.time(), 1)

                timerText = 'Next refresh: '
                timerText += time.ctime(imageJson['refreshTime'])

                # Set a new timer for the next refresh time (in ms)
                self.canvas.after(int(refreshTime * 1000), self.updateImage)

        self.timer.config(text=timerText)
        self.displayImage()

    # Event handler when the OptionMenu selected option is changed
    def userInput(self, selectedElement=None):

        if selectedElement:
            self.pluginName = selectedElement

        self.canvas.after_cancel(self.updateImage)
        self.updateImage()

    def displayImage(self):

        width = self.canvas.winfo_width()
        height = self.canvas.winfo_height()
        size = min(width, height)

        # Adapt the size of the image with the size of the viewport
        self.qrImageResized = self.qrImage.resize((size, size))
        self.qrImageResized = ImageTk.PhotoImage(self.qrImageResized)
        self.canvas.create_image(width / 2,
                                 height / 2,
                                 anchor='center',
                                 image=self.qrImageResized)


c = Standalone()
