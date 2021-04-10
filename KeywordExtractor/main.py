from requests import get
import time
from time import sleep
from random import randint
from selenium import webdriver as wb
import random
from selenium.webdriver.support.ui import WebDriverWait
import random
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.common.by import By
import pandas as pd
from bs4 import BeautifulSoup
from keybert import KeyBERT
import mysql.connector
import CRUD
from CRUD import Crud
from tqdm import tqdm
import mysql.connector
import keyword_extractor
from keyword_extractor import scraper


def main():
    db_config = {"host":"new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com","user":"admin",
                 "passwd":"password1", "database":"test_server1"}
    extractor = scraper(db_config)
    extractor.run()



if __name__ == '__main__':
    main()



