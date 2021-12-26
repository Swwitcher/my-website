import enum


class PhoneTypes(enum.Enum):
    home = 'HOME,VOICE'
    work = 'WORK,VOICE'
    cell = 'CELL'
    pager = 'PAGER'
    homeFax = 'HOME,FAX'
    workFax = 'WORK,FAX'


class EmailTypes(enum.Enum):
    home = 'HOME'
    work = 'WORK'


class AddressTypes(enum.Enum):
    home = 'HOME'
    work = 'WORK'


class Contact:

    def __init__(self,
                 firstName: str,
                 lastName: str,
                 prefix: str = '',
                 middleName: str = ''):

        self.firstName = firstName
        self.lastName = lastName
        self.prefix = prefix
        self.middleName = middleName

        self.workOrganization = ''
        self.workTitle = ''
        self.workURL = ''

        self.emails = []
        self.phones = []
        self.addresses = []

    def setWork(self,
                workOrganization: str = '',
                workTitle: str = '',
                workURL: str = ''):

        self.workOrganization = workOrganization
        self.workTitle = workTitle
        self.workURL = workURL

    def addEmail(self,
                 email: str = '',
                 emailType: EmailTypes = EmailTypes.home):

        self.emails += [[email, emailType]]

    def addPhone(self,
                 phone: str = '',
                 phoneType: PhoneTypes = PhoneTypes.home):

        self.phones += [[phone, phoneType]]

    def addAddress(self,
                   street: str = '',
                   city: str = '',
                   state: str = '',
                   postalCode: str = '',
                   country: str = '',
                   addressType: AddressTypes = AddressTypes.home):

        self.addresses += [[street,
                            city,
                            state,
                            postalCode,
                            country,
                            addressType]]

    def __str__(self):

        result = ''
        result += 'BEGIN:VCARD' + '\n'
        result += 'VERSION:3.0' + '\n'
        result += 'N;CHARSET=UTF-8:' + self.lastName + ';' + self.firstName
        result += ';' + self.middleName + ';' + self.prefix + ';' + '\n'

        if (self.workOrganization != ''):
            result += 'ORG;CHARSET=UTF-8:' + self.workOrganization + '\n'

        if (self.workTitle != ''):
            result += 'TITLE;CHARSET=UTF-8:' + self.workTitle + '\n'

        if (self.workURL != ''):
            result += 'URL;type=WORK;CHARSET=UTF-8:' + self.workURL + '\n'

        if (self.emails != []):
            for email, emailType in self.emails:
                result += 'EMAIL;CHARSET=UTF-8;type=' + emailType.value
                result += ',INTERNET:' + email + '\n'

        if (self.phones != []):
            for phone, phoneType in self.phones:
                result += 'TEL;TYPE=' + phoneType.value + ':' + phone + '\n'

        if (self.addresses != []):
            for street, city, state, postalCode, country, addressType in self.addresses:
                result += 'ADR;CHARSET=UTF-8;TYPE=' + addressType.value + ':;;'
                result += street + ';' + city + ';' + state + ';'
                result += postalCode + ';' + country + '\n'

        result += 'END:VCARD'

        return result


if __name__ == "__main__":

    e = Contact('Thomas', 'Barillot', 'Dr.', 'Super')
    e.setWork('Sma33', 'Director', 'https://sma33.fr')
    e.addEmail('tom@tom.fr')
    e.addEmail('tom@work.com', EmailTypes.work)
    e.addPhone('0601010101')
    e.addPhone('0602020202', PhoneTypes.work)
    e.addPhone('0603030303', PhoneTypes.workFax)
    e.addPhone('0604040404', PhoneTypes.cell)

    e.addAddress('52 rue de la fontaine',
                 'Marcheprime',
                 'Aquitaine',
                 '33380',
                 'France')

    e.addAddress('20 rue mon boulot',
                 'Merignac',
                 'Aquitaine',
                 '33000',
                 'France',
                 AddressTypes.work)

    print(e)
