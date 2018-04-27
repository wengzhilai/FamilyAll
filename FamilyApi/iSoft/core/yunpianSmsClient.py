import http.client
import ssl
import urllib
import json
#服务地址
sms_host = "sms.yunpian.com"
voice_host = "voice.yunpian.com"
#端口号
port = 443
#版本号
version = "v2"
#查账户信息的URI
user_get_uri = "/" + version + "/user/get.json"
#智能匹配模板短信接口的URI
sms_send_uri = "/" + version + "/sms/single_send.json"
#模板短信接口的URI
sms_tpl_send_uri = "/" + version + "/sms/tpl_single_send.json"
#语音短信接口的URI
sms_voice_send_uri = "/" + version + "/voice/send.json"
#语音验证码
voiceCode = 1234

def get_user_info(apikey):
    """
    取账户信息
    """
    ssl._create_default_https_context = ssl._create_unverified_context
    
    conn = http.client.HTTPSConnection(sms_host , port=port)
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "text/plain"
    }
    print(111)
    print(urllib.parse.urlencode( {'apikey' : apikey}))

    conn.request('POST',user_get_uri,urllib.parse.urlencode( {'apikey' : apikey}))
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def send_sms(apikey, text, mobile):
    """
    通用接口发短信
    """
    ssl._create_default_https_context = ssl._create_unverified_context
    
    params = urllib.urlencode({'apikey': apikey, 'text': text, 'mobile':mobile})
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "text/plain"
    }
    conn = http.client.HTTPSConnection(sms_host, port=port, timeout=30)
    conn.request("POST", sms_send_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str
def send_verify_code(mobile,code):
    #修改为您的apikey
    apikey = "51f88df9eedd2e9565f5f3a9417c45df"
    #修改为您要发送的手机号码，多个号码用逗号隔开
    tpl_id = 1323633 #对应的模板内容为：您的验证码是#code#【#company#】
    tpl_value = {'#code#':code}
    msg = tpl_send_sms(apikey, tpl_id, tpl_value, mobile)
    msg = json.loads(msg)
    if msg["code"]==0:
        return True;
    print(msg)
    return False

def tpl_send_sms(apikey, tpl_id, tpl_value, mobile):
    """
    模板接口发短信
    """

    ssl._create_default_https_context = ssl._create_unverified_context

    params = urllib.parse.urlencode({
        'apikey': apikey,
        'tpl_id': tpl_id,
        'tpl_value': urllib.parse.urlencode(tpl_value),
        'mobile': mobile
    })
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "text/plain"
    }
    conn = http.client.HTTPSConnection(sms_host, port=port, timeout=30)
    conn.request("POST", sms_tpl_send_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def send_voice_sms(apikey, code, mobile):
    """
    通用接口发短信
    """
    params = urllib.parse.urlencode({'apikey': apikey, 'code': code, 'mobile':mobile})
    headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "text/plain"
    }
    conn = http.client.HTTPSConnection(voice_host, port=port, timeout=30)
    conn.request("POST", sms_voice_send_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

if __name__ == '__main__':
    msg =send_verify_code("18180770313",'abde')
    print(msg)

    #修改为您的apikey.可在官网（http://www.yunpian.com)登录后获取
    # apikey = "51f88df9eedd2e9565f5f3a9417c45df"
    # #修改为您要发送的手机号码，多个号码用逗号隔开
    # mobile = "18180770313"
    # #修改为您要发送的短信内容
    # text = "【云片网】您的验证码是1234"
    # #查账户信息
    # print(get_user_info(apikey))
    #调用智能匹配模板接口发短信
    # print send_sms(apikey,text,mobile)

    #调用模板接口发短信
    # tpl_id = 1323633 #对应的模板内容为：您的验证码是#code#【#company#】
    # tpl_value = {'#code#':'1234'}
    # print(tpl_send_sms(apikey, tpl_id, tpl_value, mobile))
    #调用模板接口发语音短信
    # print send_voice_sms(apikey,voiceCode,mobile)