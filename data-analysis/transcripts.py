import pandas as pd
import mysql.connector
import boto3
from io import StringIO

def create_transcript(room_id: str):

    s3 = boto3.resource('s3')
    bucket = s3.Bucket('gooff')

    config = {
        'user': 'admin', 
        'password':'password1',
        'host':  'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com' ,
        'database': 'test_server1',
        'raise_on_warnings': True,
        }

    cnx = mysql.connector.connect(**config)    
    
    cur_room = "SELECT mongoid, message, user_id, usernames, createdat FROM chatsdata;"
    
    cursor = cnx.cursor()
    x = cursor.execute(cur_room,  params=None, multi=True)

    rows =  cursor.fetchall()

    df = pd.DataFrame(data=rows)

    df = df[df['room_id']==room_id]  # TODO fix room_id in SQL to get this working

    csv_buffer = StringIO()
    df.to_csv(csv_buffer)

    bucket.put_object(Body=csv_buffer.getvalue(), ContentType='text/csv', Key='transcripts/'+room_id+'.csv')
