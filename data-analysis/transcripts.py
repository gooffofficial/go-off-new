import pandas as pd
import mysql.connector
import boto3
import os
from io import StringIO


def create_transcript(room_id: str):
    config = {
        'user': 'admin',
        'password': 'password1',
        'host': 'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com',
        'database': 'test_server1',
        'raise_on_warnings': True,
    }

    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()
    cursor.execute(f"SELECT * FROM chatsdata WHERE roomid={room_id}")

    rows = cursor.fetchall()
    columns = [i[0] for i in cursor.description]

    csv_buffer = StringIO()

    df = pd.DataFrame(data=rows, columns=columns)
    df.to_csv(csv_buffer)

    s3 = boto3.resource(
        's3',
        aws_access_key_id=ACCESS_ID,
        aws_secret_access_key=ACCESS_KEY
    )
    object = s3.Object('gooff', f'transcripts/{room_id}.csv')
    object.put(Body=csv_buffer.getvalue())
    cursor.close()
    cnx.close()


create_transcript('123')
