from .models import Client, Session
import hashlib
import time

def get_sha(text: str, bits: int = 256) -> str:
    """
    Возвращает SHA-хэш строки.
    bits может быть 1, 224, 256, 384 или 512.
    """
    algos = {
        1: "sha1",
        224: "sha224",
        256: "sha256",
        384: "sha384",
        512: "sha512"
    }
    
    if bits not in algos:
        raise ValueError(f"Неподдерживаемый размер SHA: {bits}")
    
    return hashlib.new(algos[bits], text.encode()).hexdigest()



def regist(login, password):
    try:
        client = Client.objects.create(login=login, password=get_sha(password))
        return 0
    except:
        return -1

def login(login, password):
    curr_client = Client.objects.filter(login=login).first()
    if curr_client is None:
        return -1
    if curr_client.password != get_sha(password):
        return -1
    

    curr_session = Session.objects.create(
        session_id=get_sha(f"{login}{password}{time.time()}"), 
        client=curr_client)
    return curr_session

def auth(session_id, user_password):
    if session_id is not None and user_password is not None:
        curr_session = Session.objects.filter(session_id=session_id).first()
        if curr_session is not None:
            curr_client = curr_session.client
            if curr_client.password == get_sha(user_password):
                return True
    return False