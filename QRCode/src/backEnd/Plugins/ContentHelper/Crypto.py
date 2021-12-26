import enum


class CryptoTypes(enum.Enum):
    bitcoin = 'bitcoin'
    ether = 'ether'
    bitcoinCash = 'bitcoinCash'
    ripple = 'ripple'
    litecoin = 'litecoin'
    omiseGo = 'omiseGo'
    maidSafeCoin = 'maidSafeCoin'
    dash = 'dash'
    dogecoin = 'dogecoin'
    monero = 'monero'
    factom = 'factom'
    bitShares = 'bitShares'
    peercoin = 'peercoin'
    namecoin = 'namecoin'
    lisk = 'lisk'
    solarCoin = 'solarCoin'
    deepOnion = 'deepOnion'
    domRaiderToken = 'domRaiderToken'
    bitcoinTop = 'bitcoinTop'
    g1 = 'g1'
    manna = 'manna'
    electra = 'electra'


class Crypto:

    def __init__(self, cryptoType: CryptoTypes, cryptoAddress: str):

        if not isinstance(cryptoType, CryptoTypes):
            message = 'The parameter cryptoType should be of type <enum '
            message += '\'cryptoTypes\'> (i.e use "cryptoTypes.bitcoin").'
            raise TypeError(message)

        self.cryptoType = cryptoType
        self.cryptoAddress = cryptoAddress

    def __str__(self):
        return self.cryptoType.name + ':' + self.cryptoAddress
