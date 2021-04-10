import mysql.connector
import pandas as pd

class Crud:


    def __init__(self):
        """Creating a new class to perform CRUD operations and insert the keywords
        into a table in the MySQL database

         """
        pass

    def initialize_db(self, host, user, passwd, database):
        """This is a function that initializes the MySQL database to perform
        CRUD operations on for this task

           Args:
               host: where the MySQL database is hosted on
               user: username to access the database
               passwd: password to access the MySQL database
               database: name of database to perform CRUD operations with

           Returns:
               mycursor: A cursor connecting to the MySQL database

           """
        mydb = mysql.connector.connect(host=host,user=user,
                                       passwd=passwd, database=database)
        mycursor = mydb.cursor()
        return mycursor, mydb

    def read_data(self, mycursor):
        """This is a function that reads the data in from the MySQL database

           Args:
               mycursor: cursor connecting to the MySQL database

           Returns:
               initial_df: A dataframe containing all the articles and
               user_ids from the table.

           """
        mycursor.execute('Select article, userID from SavedArticles')
        myresult = mycursor.fetchall()
        rows = []
        for row in myresult:
            rows.append(row)
        article_urls = []
        user_ids = []
        for entry in rows:
            article_urls.append(entry[0])
            user_ids.append(entry[1])
        initial_df = pd.DataFrame({"article_links": article_urls,
                                   "user_id": user_ids})
        return initial_df

    def create_table(self, table_name, mycursor):
        """This is a function that creates the keyword extraction table
        in the MySQL database and returns the table_name which will be
        fed into the populate table function below.

           Args:
               table_name: the name of the table to be created
               mycursor: cursor connecting to the MySQL database

           Returns:
               table_name: name of table to be created

           """
        mycursor.execute("Create table"+ table_name + "(user_id int(20), article_url varchar(200),"
                                                      "keyphrases varchar(200)) ")
        return table_name

    def populate_table(self, mycursor, table_name, urllist,
                       user_id_list, keywords_list, mydb):
        """This is a function that populates the table created in the create_table function

           Args:
               mycursor: cursor connecting to the MySQL database
               table_name: the name of the table to be created
               urllist: list of article urls
               user_id_list: list of user_ids linked to the article urls
               keywords_list: list of keywords generated for the articles
               mydb: the database that's being connected to

           Returns:
               None

           """
        for url, user_id, keywords in zip(urllist, user_id_list, keywords_list):
            sqlform = "Insert into" + table_name + "(user_id, article_url, keyphrases) values(%s,%s,%s)"
            insert = [(user_id, url, keywords)]
            mycursor.execute(sqlform, insert)
            mydb.commit()
