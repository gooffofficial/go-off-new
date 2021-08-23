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
    cursor.execute(f"SELECT * FROM convodata WHERE roomid={room_id}")

    rows = cursor.fetchall()
    columns = [i[0] for i in cursor.description]

    csv_buffer = StringIO()

    df = pd.DataFrame(data=rows, columns=columns)
    df.to_csv(csv_buffer)

    s3 = boto3.resource(
        service_name='s3',
        aws_access_key_id='AKIA4OTKLUMMRQ3KBRB4',
        aws_secret_access_key='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'
    )

    object = s3.Object('gooff', f'transcripts/{room_id}_chat.csv')
    object.put(Body=csv_buffer.getvalue())
    cursor.close()
    cnx.close()
