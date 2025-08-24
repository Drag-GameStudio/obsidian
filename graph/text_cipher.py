from sealpy.cipher import Enigma
from menu.authorization import get_sha


def content_cipher(content, password):
    key = Enigma.generate_key_from_hash(get_sha(password, 224))
    en = Enigma(key=key)
    cipher_content = en.cipher_text(content)
    return cipher_content


def content_anticipher(cipher_content, password):
    key = Enigma.generate_key_from_hash(get_sha(password, 224))
    en = Enigma(key=key)
    anticipher_content = en.anti_cipher_text(cipher_content)
    return anticipher_content