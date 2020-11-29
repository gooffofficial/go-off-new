from pymongo import MongoClient
import csv
import sys
from bson.objectid import ObjectId

client: MongoClient = MongoClient("mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")
db = client.test
rooms = db.rooms
chats = db.chats

def run():
    global db
    global rooms
    global chats
    if len(sys.argv) != 2:
        raise Exception("Supply 1 url as a parameter")


    url: str = sys.argv[1]
    cur_room = rooms.find_one({"url":url})

    message_ids = cur_room["messages"]
    messages: [] = []
    for message in message_ids:
        messages.append(chats.find_one({"_id":message}))

    with open(("transcripts/"+str(cur_room["_id"])+"_chat.csv"), 'w+') as csvfile:
        chat_writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        chat_writer.writerow(["messageId", "userId", "username", "message", "timestamp"])
        for message in messages:
            chat_writer.writerow([message["_id"], message["user"], message["name"], message["message"], message["createdAt"]])

def create_transcript(room_id: str):
    global db
    global rooms
    global chats
    cur_room = rooms.find_one({"_id":ObjectId(room_id)})

    message_ids = cur_room["messages"]
    messages: [] = []
    for message in message_ids:
        messages.append(chats.find_one({"_id":message}))
    
    #TODO: upload csvs to amazon s3 instead of saving locally or just do everything from vanity.py
    with open(("transcripts/"+str(cur_room["_id"])+"_chat.csv"), 'w+') as csvfile:
        chat_writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        chat_writer.writerow(["messageId", "userId", "username", "message", "timestamp"])
        for message in messages:
            chat_writer.writerow([message["_id"], message["user"], message["name"], message["message"], message["createdAt"]])
    return 'transcripts/'+str(cur_room["_id"])+"_chat.csv"

if __name__ == '__main__':
    run()