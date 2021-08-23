"""
tutorial used: 
https://www.digitalocean.com/community/tutorials/how-to-perform-sentiment-analysis-in-python-3-using-the-natural-language-toolkit-nltk
"""
import nltk
nltk.download('vader_lexicon')
nltk.download('twitter_samples')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('punkt')

from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import twitter_samples, stopwords
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import FreqDist, classify, NaiveBayesClassifier
import pandas as pd
import re, string, random
import matplotlib.pyplot as plt


import io
import boto3
import sys

s3 = boto3.resource(
    service_name='s3',
    aws_access_key_id='AKIA4OTKLUMMRQ3KBRB4',
    aws_secret_access_key='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'
)

bucket = s3.Bucket('gooff')
sid = SentimentIntensityAnalyzer()

def remove_noise(tweet_tokens, stop_words = ()):

    cleaned_tokens = []

    for token, tag in pos_tag(tweet_tokens):
        token = re.sub('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|'\
                       '(?:%[0-9a-fA-F][0-9a-fA-F]))+','', token)
        token = re.sub("(@[A-Za-z0-9_]+)","", token)

        if tag.startswith("NN"):
            pos = 'n'
        elif tag.startswith('VB'):
            pos = 'v'
        else:
            pos = 'a'

        lemmatizer = WordNetLemmatizer()
        token = lemmatizer.lemmatize(token, pos)

        if len(token) > 0 and token not in string.punctuation and token.lower() not in stop_words:
            cleaned_tokens.append(token.lower())
    return cleaned_tokens

def get_all_words(cleaned_tokens_list):
    for tokens in cleaned_tokens_list:
        for token in tokens:
            yield token

def get_tweets_for_model(cleaned_tokens_list):
    for tweet_tokens in cleaned_tokens_list:
        yield dict([token, True] for token in tweet_tokens)

def run_sentiment_analysis(roomid):
    #grabbing the tweets
    positive_tweets = twitter_samples.strings('positive_tweets.json')
    negative_tweets = twitter_samples.strings('negative_tweets.json')
    text = twitter_samples.strings('tweets.20150430-223406.json')
    tweet_tokens = twitter_samples.tokenized('positive_tweets.json')[0]
    stop_words = stopwords.words('english')

    #creating the positive/negative tweet tokens 
    positive_tweet_tokens = twitter_samples.tokenized('positive_tweets.json')
    negative_tweet_tokens = twitter_samples.tokenized('negative_tweets.json')

    positive_cleaned_tokens_list = []
    negative_cleaned_tokens_list = []

    #list of clean pos/neg tweet tokens
    for tokens in positive_tweet_tokens:
        positive_cleaned_tokens_list.append(remove_noise(tokens, stop_words))
    for tokens in negative_tweet_tokens:
        negative_cleaned_tokens_list.append(remove_noise(tokens, stop_words))

    all_pos_words = get_all_words(positive_cleaned_tokens_list)
    freq_dist_pos = FreqDist(all_pos_words)
    print(freq_dist_pos.most_common(10))

    positive_tokens_for_model = get_tweets_for_model(positive_cleaned_tokens_list)
    negative_tokens_for_model = get_tweets_for_model(negative_cleaned_tokens_list)
    positive_dataset = [(tweet_dict, "Positive")
                         for tweet_dict in positive_tokens_for_model]

    negative_dataset = [(tweet_dict, "Negative")
                         for tweet_dict in negative_tokens_for_model]

    dataset = positive_dataset + negative_dataset

    random.shuffle(dataset)

    train_data = dataset[:7000]

    #data used to test 
    test_data = dataset[7000:]

    classifier = NaiveBayesClassifier.train(train_data)

    #print("Accuracy is:", classify.accuracy(classifier, test_data))

    #print(classifier.show_most_informative_features(10))
    
    #go OFF messages
    from csv import DictReader

    # TODO test the below change
    df = pd.read_csv('https://gooff.s3.us-east-2.amazonaws.com/transcripts/' + roomid + '_chat.csv')
    a1 = df.message.tolist()

    # with open(r"https://gooff.s3.us-east-2.amazonaws.com/transcripts/"+roomid+"_chat.csv", 'r') as f:
    #     a1 = [row["message"] for row in DictReader(f)]

    
    custom_chat_list = a1
    custom_tokens_list = [remove_noise(word_tokenize(chat)) for chat in custom_chat_list]

    cleaned_cus = []
    for tokens in custom_tokens_list:
        cleaned_cus.append(remove_noise(tokens, stop_words))

    all_words = get_all_words(cleaned_cus)
    freq_dist = FreqDist(all_words)
    most_com = freq_dist.most_common(20)
    #print(most_com)

    #find values for most common words
    top_five = []
    freq_of_word = []
    for word,val in most_com: 
        while len(top_five) < 6: 
            if "'`" not in word and len(word) > 3:
                top_five.append(word)
                freq_of_word.append(val) 
            break
    #CREATE BAR GRAPH FOR MOST COMMON WORDS
    x_pos = [i for i, _ in enumerate(top_five)]

    plt.barh(x_pos, freq_of_word, color='blue')

    plt.yticks(x_pos, top_five)
    
    #Upload figure to S3
    img_data = io.BytesIO()
    plt.savefig(img_data, format="svg")
    img_data.seek(0)
    bucket.put_object(Body=img_data, ContentType='image/svg+xml', Key='images/graphs/'+roomid+'_top5Bar.svg')
    #plt.show()
    plt.clf()

    #for tok in custom_tokens_list:
    #    print(tok, classifier.classify(dict([token, True] for token in tok)))

    #ANALYSIS STATS FOR THE DONUT CHART
    #posneglist = [classifier.classify(dict([token, True] for token in tok)) for tok in custom_tokens_list]
    #print(posneglist)
    new_mess = []
    for message in a1:
        message = str(message)
        new = re.sub('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|["+.!*\(\),]|'\
                       '(?:%[0-9a-fA-F][0-9a-fA-F]))+','', message)
        new = re.sub("(@[A-Za-z0-9_]+)","", message)
        new_mess.append(new)
    
    #Gather information from analysis 
    numPos = 0
    numSlightP = 0
    numNeg = 0
    numSlightN = 0
    numNeu = 0 
    total = len(new_mess)
    comp = [] 
    for sentence in new_mess:
            #print(sentence)
            scores = sid.polarity_scores(sentence)
            #for key in sorted(scores):
            #       print('{0}: {1}, '.format(key, scores[key]), end='')
            comp.append(scores['compound'])
            if (scores['compound'] >= 0.5): 
                numPos += 1
            elif (scores['compound'] <= -0.5): 
                numNeg += 1
            elif (scores['compound'] > -0.25 and scores['compound'] < 0.25): 
                numNeu += 1
            elif (scores['compound'] >= 0.25 and scores['compound'] < 0.5):
                numSlightP += 1
            elif (scores['compound'] <= -0.25 and scores['compound'] > -0.5):
                numSlightN += 1

    #for val in posneglist: 
    #   if val == 'Positive':
    #        posNum += 1
    #    elif val == 'Negative': 
    #        negNum += 1
    #print(posNum)
    #print(negNum)
    #print(len(posneglist))

    #CALCULATIONS FOR CHART
    #positives = posNum/(len(posneglist)) * 100
    #negatives = negNum/(len(posneglist)) * 100 
    #DONUT CHART
    percentPos = (numPos/total) * 100
    percentNeg = (numNeg/total) * 100
    percentNeu = (numNeu/total) * 100
    percentSPos = (numSlightP/total) * 100
    percentSNeg = (numSlightN/total) * 100

    #LABELS AND DATA
    #labels = ["Positive", "Negative"]
    #sizes = [positives, negatives]
    labels = ["Positive", "Negative", "Slightly Positive", "Slightly Negative", "Neutral"]
    sizes = [percentPos, percentNeg, percentSPos, percentSNeg, percentNeg]
    #CREATE PIE CHART
    plt.pie(sizes, labels=labels, autopct = '%1.1f%%')
    plt.axis('equal')

    #CREATE CIRCLE ONTO PIECHART TO MAKE DONUT
    circle = plt.Circle(xy=(0,0), radius=0.75, facecolor='white')
    plt.gca().add_artist(circle)
    img_data = io.BytesIO()
    plt.savefig(img_data, format="svg")
    img_data.seek(0)
    bucket.put_object(Body=img_data, ContentType='image/svg+xml', Key='images/graphs/'+roomid+'_sentimentDonut.svg')
    #plt.show()

    print('analysis complete')

    #testing code
    #custom_tweet = "I ordered just once from TerribleCo, they screwed up, never used the app again."
    #custom_tokens = remove_noise(word_tokenize(custom_tweet))
    #print(custom_tweet, classifier.classify(dict([token, True] for token in custom_tokens)))"""

if __name__ == '__main__':
    run_sentiment_analysis("123")
