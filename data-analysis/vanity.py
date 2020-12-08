#imports
from pymongo import MongoClient
import mysql.connector
import pandas as pd
from nltk.corpus import stopwords
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import seaborn as sns
import os.path
from transcripts import create_transcript
from bson.objectid import ObjectId
from datetime import datetime
import io
import boto3
import sys

s3 = boto3.resource('s3')

bucket = s3.Bucket('gooff')
color = sns.color_palette()

client: MongoClient = MongoClient("mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")

mydb = mysql.connector.connect(
  host="new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com",
  user="admin",
  password="password1"
)

db = client.test
rooms = db.rooms
chats = db.chats

#get metrics
def vanity(room_id: str):
    cur_room = rooms.find_one({"_id":ObjectId(room_id)})
    users = cur_room['users']
    usernames = []
    mycursor = mydb.cursor()
    for user in users:
        mycursor.execute("SELECT username FROM test_server1.Users U WHERE U.id="+user)
        myresult = mycursor.fetchone()
        usernames.append(myresult[0])
    #print(str(len(usernames))+ " users: " + str(usernames))
    #print(os.path.exists('../transcripts/'+room_id+'_chat.csv'))
    if os.path.exists('transcripts/'+room_id+'_chat.csv') == False:
        #print("AHHHHHHH")
        create_transcript(room_id)
    df = pd.read_csv('transcripts/'+room_id+'_chat.csv')
    
    #Time and date analysis
    timestamps = df.timestamp[1:]

    tlast = datetime.strptime(timestamps[len(timestamps)], '%Y-%m-%d %H:%M:%S.%f')
    tfirst = datetime.strptime(timestamps[1], '%Y-%m-%d %H:%M:%S.%f')

    t_delta = (tlast-tfirst).total_seconds()/60
    convo_date = tfirst.date()
    convo_time = tfirst.time()
    #get average number of words per message
    messages = df.message[1:]
    #print("Total number of messages: " + str(len(messages)))
    total_words = 0
    for message in messages:
        total_words += len(str(message).split())
    avg_words = total_words/len(messages)
    #print("Total number of words: " + str(total_words))
    #print("Average number of words: "+ str(avg_words))

    #get average number of characters per message
    total_chars = 0
    for message in messages:
        total_chars += len(str(message))
    avg_chars = total_chars/len(messages)
    #print("Total number of characters: " + str(total_chars))
    #print("Average number of characters: "+str(avg_chars))

    # Create stopword list:
    #print(df.columns)
    stop_words = set(stopwords.words('english'))
    textt = " ".join(str(review) for review in df.message[1:])

    wordcloud = WordCloud(stopwords=stop_words).generate(textt)
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    img_data = io.BytesIO()
    plt.savefig(img_data, format="png")
    img_data.seek(0)
    bucket.put_object(Body=img_data, ContentType='image/png', Key='images/graphs/'+room_id+'_wordcloud.png')
    mycursor.execute("INSERT INTO test_server1.Analytics (id, totalMessages, totalWords, totalLetters, averageWordsMessage, averageLettersMessage, numUsers, convoLength, convoTime, convoDate)\
        VALUES ('"+room_id+"'," + str(len(messages)) + ","+str(total_words)+","+str(total_chars)+","+str(avg_words)+","+str(avg_chars)+","+str(len(usernames))+","+str(t_delta)+",'"+str(convo_time)+"','"+str(convo_date)+"')")
    mydb.commit()
    #plt.show()
    print(str({'total_chars':total_chars,'avg_chars':avg_chars,'total_words':total_words,'avg_words':avg_words, 'num_users':len(usernames)}))

if __name__ == '__main__':
    vanity(sys.argv[1])