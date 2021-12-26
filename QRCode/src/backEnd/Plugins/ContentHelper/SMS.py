class SMS:

    def __init__(self, phoneNumber: str, message: str = ''):
        self.phoneNumber = phoneNumber
        self.message = message

    def __str__(self):
        return "SMSTO:" + self.phoneNumber + ":" + self.message
