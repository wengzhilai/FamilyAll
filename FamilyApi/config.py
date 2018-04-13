'''配制文件'''
import os

BASE = os.path.abspath(os.path.dirname(__file__))

CSRF_ENABLED = True
# Flask-WTF 使用这个密钥生成加密令牌
SECRET_KEY = 'you-will-never-guess'
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://FA:abcdef123@47.254.16.126:3306/fa'
# 追踪对象的修改并且发送信号
SQLALCHEMY_TRACK_MODIFICATIONS = True
# 我们执行文件的时候会提示相应的文字
SQLALCHEMY_ECHO = False
# 设定连接池的连接超时时间。默认是10
SQLALCHEMY_POOL_TIMEOUT=1
# 多少秒后自动回收连接。这对MYSQL是必要的，它默认移除闲置多余8小时的连接。注意，如果使用了MYSQL， SQLALCHEMY自动设置这个值为2小时
SQLALCHEMY_POOL_RECYCLE=1

# SQLALCHEMY_MIGRATE_REPO = os.path.join(BASE, 'db_repository')

# 密码复杂度
PASSWORD_COMPLEXITY = 2
# 短信验证码
VERIFY_CODE = True
