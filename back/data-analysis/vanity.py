# imports
import mysql.connector
import pandas as pd
# from nltk.corpus import stopwords
# from wordcloud import WordCloud
import matplotlib.pyplot as plt
import seaborn as sns
# import os.path
from transcripts import create_transcript
# from bson.objectid import ObjectId
from datetime import datetime
from statistics import mean
from collections import Counter
import io
import boto3
# import sys
import botocore

#https://www.gormanalysis.com/blog/connecting-to-aws-s3-with-python/
s3 = boto3.resource(
    service_name='s3',
    aws_access_key_id='AKIA4OTKLUMMRQ3KBRB4',
    aws_secret_access_key='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'
)

bucket = s3.Bucket('gooff')

color = sns.color_palette()

# client: MongoClient = MongoClient("mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")

config = {
    'user': 'admin',
    'password': 'password1',
    'host': 'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com',
    'database': 'test_server1',
    'raise_on_warnings': True,
}


# get metrics
def vanity(room_id: str):
    cnx = mysql.connector.connect(**config)
    mycursor = cnx.cursor()

    mycursor.execute('SELECT * FROM convodata WHERE roomid = ' + room_id)
    r_rows = mycursor.fetchall()

    a = (mycursor.description)
    col = []
    for i in range(len(a)):
        col.append(a[i][0])
    df = pd.DataFrame(data=r_rows)
    df.columns = col

    users = df['userid']
    usernames = []
    user_ages = []
    user_genders = []
    user_part = {}
    user_loc = []
    for u in users:
        mycursor.execute("SELECT username FROM test_server1.Users U WHERE U.id=" + u)
        myresult = mycursor.fetchone()
        usernames.append(myresult[0])
        user_part[str(myresult[0])] = 0
        mycursor.execute("SELECT age FROM test_server1.Users as U WHERE U.id=" + u)
        a = mycursor.fetchone()
        if a != None:
            user_ages.append(int(a[0]))
        mycursor.execute("SELECT gender FROM test_server1.Users as U WHERE U.id=" + u)
        g = mycursor.fetchone()
        if g != None and str(g[0]) != "N/A":
            user_genders.append(str(g[0]))
        mycursor.execute("SELECT location FROM test_server1.Users AS U WHERE U.id=" + u)
        l = mycursor.fetchone()
        if l != None:
            user_loc.append(str(l[0]))
        for index, location in enumerate(user_loc):
            if "Boston" in location or "boston" in location:
                user_loc[index] = "Boston, MA"
            if (location == "nyc") or ("New York City" in location) or ("New york city" in location) or (
                    "new york city" in location):
                user_loc[index] = "New York, NY"
            if ("United States".casefold() in location.casefold()):
                user_loc[index] = "USA"
        location_counts = Counter(user_loc)
        location_list = sorted(location_counts, key=location_counts.get, reverse=True)

    # age donut chart
    num_13_18 = 0
    num_19_21 = 0
    num_22_25 = 0
    num_26_30 = 0
    num_31_40 = 0
    num_41_plus = 0
    for index, age in enumerate(user_ages):
        if age >= 13 and age <= 18:
            num_13_18 += 1
        elif age > 18 and age <= 21:
            num_19_21 += 1
        elif age > 21 and age <= 25:
            num_22_25 += 1
        elif age > 25 and age <= 30:
            num_26_30 += 1
        elif age > 30 and age <= 40:
            num_31_40 += 1
        else:
            num_41_plus += 1

    total = len(user_ages)
    percent_1318 = 0
    percent_1921 = 0
    percent_2225 = 0
    percent_2630 = 0
    percent_3140 = 0
    percent_41p = 0

    if (total > 0):
        percent_1318 = num_13_18 / total
        percent_1921 = num_19_21 / total
        percent_2225 = num_22_25 / total
        percent_2630 = num_26_30 / total
        percent_3140 = num_31_40 / total
        percent_41p = num_41_plus / total

    labels = ["13-18", "19-21", "22-25", "26-30", "31-40", "41+"]
    sizes = [percent_1318, percent_1921, percent_2225, percent_2630, percent_3140, percent_41p]
    plt.pie(sizes, labels=labels, autopct='%1.1f%%')
    plt.axis('equal')

    circle = plt.Circle(xy=(0, 0), radius=0.75, facecolor='white')
    plt.gca().add_artist(circle)
    label = plt.gca().annotate("Average Age: " + str(round(mean(user_ages), 1)), xy=(0, 0), fontsize="10", ha="center")
    age_donut_chart = io.BytesIO()
    plt.savefig(age_donut_chart, format="svg")
    age_donut_chart.seek(0)
    bucket.put_object(Body=age_donut_chart, ContentType='image/svg+xml',
                      Key="images/graphs/" + room_id + "_ageDonut.svg")
    plt.clf()

    # gender donut chart
    # TODO: expand beyond binary male and female
    num_male = 0
    num_female = 0
    for index, gender in enumerate(user_genders):
        if gender.casefold() == "HeHim".casefold():
            user_genders[index] = "Male"
            num_male += 1
        elif gender.casefold() == "SheHer".casefold():
            user_genders[index] = "Female"
            num_female += 1
        else:
            user_genders[index] = "Male"
            num_male += 1
    total = len(user_genders)
    percent_male = 0
    percent_female = 0

    if (total > 0):
        percent_male = num_male / len(user_genders)
        percent_female = num_female / len(user_genders)
    labels = ["Male", "Female"]
    sizes = [percent_male, percent_female]
    plt.pie(sizes, labels=labels, autopct='%1.1f%%')
    plt.axis('equal')

    circle = plt.Circle(xy=(0, 0), radius=0.75, facecolor='white')
    plt.gca().add_artist(circle)
    gender_donut_chart = io.BytesIO()
    plt.savefig(gender_donut_chart, format="svg")
    gender_donut_chart.seek(0)
    bucket.put_object(Body=gender_donut_chart, ContentType='image/svg+xml',
                      Key="images/graphs/" + room_id + "_genderDonut.svg")
    plt.clf()
    # message vanity metrics
    try:
        s3.Object('gooff', 'transcripts/' + room_id + '_chat.csv').load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            # The object does not exist. 
            create_transcript(room_id)

    df = pd.read_csv('https://gooff.s3.us-east-2.amazonaws.com/transcripts/' + room_id + '_chat.csv')
 
    for usern in df.username:
        user_part[str(usern)] += 1

    labels = ["User " + str(i + 1) for i in range(len(user_part))]
    data = [float(v) for v in user_part.values()]
    plt.pie(data, labels=labels, autopct='%1.1f%%')
    plt.axis('equal')
    circle = plt.Circle(xy=(0, 0), radius=0.75, facecolor='white')
    plt.gca().add_artist(circle)
    part_donut_chart = io.BytesIO()
    plt.savefig(part_donut_chart, format="svg")
    part_donut_chart.seek(0)
    bucket.put_object(Body=part_donut_chart, ContentType='image/svg+xml',
                      Key="images/graphs/" + room_id + "_partDonut.svg")
    plt.clf()

    # Time and date analysis
    df = df.sort_values('createdat', ascending=True)
    timestamps = df.createdat

    tlast = datetime.strptime(timestamps[len(timestamps) - 1], '%Y-%m-%d %H:%M:%S')
    tfirst = datetime.strptime(timestamps[0], '%Y-%m-%d %H:%M:%S')

    t_delta = (tlast - tfirst).total_seconds() / 60  # convo time in mins.
    convo_date = tfirst.date()
    convo_time = tfirst.time()
    # get average number of words per message
    messages = df.message[0:]
    # print("Total number of messages: " + str(len(messages)))
    total_words = 0
    for message in messages:
        total_words += len(str(message).split())
    avg_words = total_words / len(messages)
    # print("Total number of words: " + str(total_words))
    # print("Average number of words: "+ str(avg_words))

    # get average number of characters per message
    total_chars = 0
    for message in messages:
        total_chars += len(str(message))
    avg_chars = total_chars / len(messages)

    # create message over time graph
    times = []
    for time in df.createdat:
        times.append(datetime.strptime(time, '%Y-%m-%d %H:%M:%S'))
    df.insert(0, "count", 1)
    df.insert(0, "time", pd.to_datetime(times))
    df['min'] = df.time.dt.minute
    df1 = df[['message', 'min']]
    message_counts = df1.groupby(by=['min']).count()
    message_counts.plot()
    plt.ylabel("Number of messages")
    img_data = io.BytesIO()
    plt.savefig(img_data, format="svg")
    img_data.seek(0)
    bucket.put_object(Body=img_data, ContentType='image/svg+xml', Key="images/graphs/" + room_id + "_activityChart.svg")
    plt.clf()
    # print("Total number of characters: " + str(total_chars))
    # print("Average number of characters: "+str(avg_chars))

    # Create stopword list:
    # print(df.columns)
    # stop_words = set(stopwords.words('english'))
    # textt = " ".join(str(review) for review in df.message[0:])

    # wordcloud = WordCloud(stopwords=stop_words).generate(textt)
    # plt.imshow(wordcloud, interpolation='bilinear')
    # plt.axis("off")
    # img_data = io.BytesIO()
    # plt.savefig(img_data, format="png")
    # img_data.seek(0)
    # bucket.put_object(Body=img_data, ContentType='image/png', Key='images/graphs/'+room_id+'_wordCloud.svg')
    mycursor.execute("INSERT INTO test_server1.Analytics (id, totalMessages, totalWords, totalLetters, averageWordsMessage, averageLettersMessage, numUsers, convoLength, convoTime, convoDate, locations)\
        VALUES ('" + room_id + "'," + str(len(messages)) + "," + str(total_words) + "," + str(total_chars) + "," + str(
        avg_words) + "," + str(avg_chars) + "," + str(len(usernames)) + "," + str(t_delta) + ",'" + str(
        convo_time) + "','" + str(convo_date) + "','" + str(location_list).replace("'", '"') + "')")

    cnx.commit()
    # plt.show()
    plt.clf()

    print(str({'total_chars': total_chars, 'avg_chars': avg_chars, 'total_words': total_words, 'avg_words': avg_words,
               'num_users': len(usernames)}))

    mycursor.close()
    cnx.close()


if __name__ == '__main__':
    vanity('1234')
