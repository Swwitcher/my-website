class Phone:

    def __init__(self, phoneNumber):
        self.phoneNumber = phoneNumber

    def __str__(self):
        return 'tel:' + self.phoneNumber
