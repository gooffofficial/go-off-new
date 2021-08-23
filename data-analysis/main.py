import mysql.connector
from flask import Flask, request
from flask_cors import CORS
from waitress import serve

app= Flask(__name__)#FastAPI()
CORS(app)

def createDBConnection():
    try:
        mydb = mysql.connector.connect(
        host="new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com",
        user="admin",
        password="password1",
        database="test_server1"
        )
    except Exception as e:
        return print(f'Error connecting to db: {e}')
    return mydb
    

print('connected to FlaskAPI')

@app.route("/", methods=["GET"])
def home():
    #*! i need help I dont think my commitmessage function is committing the messages to chat. because I should be able to fetch them here. 
    mydb = createDBConnection()
    cursor = mydb.cursor()
    sql = 'SELECT * FROM chatsdata WHERE roomid != NULL'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(result)
    mydb.close()
    print('something')
    return {"message":"Welcome to home"}

@app.route('/commitmessages', methods=["POST"])
def commitMessage():
    data = request.get_json(force=True)
    mydb = createDBConnection()
    cursor = mydb.cursor()

    messages = data["messages"]
    if not data["messages"]:
        return {"message":"no messages"}
    
    try:
        roomid = messages[0]['roomid']
        sqlCheck = f'SELECT * FROM convodata WHERE roomid={roomid}'
        cursor.execute(sqlCheck)
        result = cursor.fetchone()
        if result:
            return {"message":"messages have already been commited"}
    except:
        pass

    for message in messages:
        print(message)
        if message['message']=='':
            break     
        messageid = message["mongoid"]
        text = message['message']
        user_id = message["user_id"]
        username = message['username']
        createdat = message['createdat']
        updatedat = message['updatedat']
        roomid = message['roomid']
        sql ='INSERT INTO convodata (messageid, message, userid, username, createdat, updatedat, roomid) VALUES(%s,%s,%s,%s,%s,%s,%s)'
        values = (messageid,text,user_id,username,createdat,updatedat,roomid)
        cursor.execute(sql,values)
        print('executed')
    mydb.commit()
    mydb.close()
    print('committed messages')
    return{"message":"messages have been committed"}

@app.route("/commitconvo", methods=["POST"])
def commitConvo():
    data = request.get_json(force=True)
    
    if not data:
        return {"message":"no data was given"}
    if not data['convo']:
        return {"message":"no metadata in conversation"}
    
    mydb = createDBConnection()
    cursor = mydb.cursor()
    
    try:
        convo = data["convo"]
        article = convo['article']
        time = convo['time']
        host = convo['host']
        roomid = convo['roomid']
        title = convo['title']
        description =convo['description']
        created_at = convo['createdAt']
        updated_at = convo['updatedAt']
        tz = convo['tz']
    except:
        return {"message":"Improper data form"}
    sql = 'INSERT INTO Convos (article, time, host, roomid, title, description, createdAt, updatedAt, tz) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)'
    values = (article, time, host, roomid, title, description, created_at, updated_at, tz) 
    cursor.execute(sql,values)
    mydb.commit()
    mydb.close()
    print('committed conversation')
    return {"message":"committed conversation data to db"}

@app.route("/getHost/<id>", methods=["GET"])
def getHost(id):
    mydb=createDBConnection()
    cursor = mydb.cursor()
    dictionary = {}
    sql = f'SELECT * FROM Profiles WHERE UserId={id}'
    sql2 = f'SELECT * FROM Users WHERE id={id}'
    cursor.execute(sql)
    user = cursor.fetchone()
    try:
        dictionary.update({id:{"ppic":user[2]}})
        print(dictionary)
    except :
        print(user)
        return {"user":user}   
    cursor.execute(sql2)
    user = cursor.fetchone()
    try:
        dictionary[id].update({"name":user[3]})
    except:
        return {"user":user}  
    return {"user":dictionary}
    
    
@app.route("/execanalytics/<id>", methods=["GET"])
def executeAnalytics(id):
    return {"message":f"Analytics executed for {id}"}

if __name__=="__main__":
    serve(app,port='8080', host='localhost') 
    