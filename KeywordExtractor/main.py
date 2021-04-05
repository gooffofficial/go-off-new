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
import keyword_extractor
from keyword_extractor import scraper


def main():
    url_list = [
        'https://www.vox.com/the-goods/2021/3/23/22345407/what-did-david-dobrik-do-vlog-squad-cancelled-youtube',
        'https://www.billboard.com/articles/columns/pop/9545592/miley-cyrus-pens-thoughtful-letter-hannah-montana-15th-anniversary/',
        'https://www.ctvnews.ca/health/coronavirus/if-you-feel-angry-name-it-experts-offer-help-to-those-traumatized-by-anti-asian-hate-1.5362545',
    'https://www.forbes.com/sites/abigailfreeman/2021/03/14/grammys-2021-the-winners-list/?sh=74a29c957548',
    'https://www.bu.edu/articles/2021/bu-administrators-add-two-wellness-days-to-this-semesters-calendar/']
    extractor = scraper()
    extractor.run(url_list)



if __name__ == '__main__':
    main()



