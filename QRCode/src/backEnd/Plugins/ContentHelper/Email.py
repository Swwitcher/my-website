import re


class Email:

    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

    def __init__(self, mailTo, subject='', body=''):

        if not re.search(self.regex, mailTo):
            raise ValueError('The value given for mailTo is not correct.')

        self.mailTo = mailTo
        self.subject = subject
        self.body = body

    def __str__(self):
        result = 'mailto:' + self.mailTo
        result += '?subject=' + self.subject + '&body=' + self.body
        return result


if __name__ == "__main__":

    myMail = Email("dimitri2311@gmail.com",
                   "test",
                   "Hello, \n this is a test")

    print(myMail)
