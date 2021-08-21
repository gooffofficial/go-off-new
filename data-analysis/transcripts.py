import pandas as pd
import mysql.connector
import boto3
from io import StringIO
def create_transcript(room_id: str):
    config = {
        'user': 'admin', 
        'password':'password1',
        'host':  'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com' ,
        'database': 'test_server1',
        'raise_on_warnings': True,
        }
    cnx = mysql.connector.connect(**config)    
    cursor = cnx.cursor()
    cursor.execute("SELECT mongoid, message, user_id, usernames, createdat,roomid FROM chatsdata")
    rows =  cursor.fetchall()
    a=(cursor.description)
    col=[]
    for i in range(len(a)):
        col.append(a[i][0])
    df = pd.DataFrame(data=rows)
    df.columns=col
    
    df1=(df.loc[lambda df: df['roomid'] == room_id])
    csv_buffer = StringIO()
    df1.to_csv(csv_buffer)
    s3 = boto3.resource('s3')
    object = s3.Object('gooff','transcripts/'+room_id+'.csv')
    object.put(Body=csv_buffer.getvalue())
    cursor.close()
    cnx.close()
