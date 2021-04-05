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

class scraper:


    def __init__(self):
        """Creating a new class to build a Keyword Extractor that takes article links,
        scrapes them for text and returns the keywords of the text.

         """
        pass

    def initialize_driver(self): #driver.manage: delete all cookies.
        """This is a function that initializes the Selenium webdriver

           Args:
               None

           Returns:
               The configured Selenium Webdriver

           """
        options = wb.ChromeOptions()
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--no-sandbox')
        #options.add_experimental_option("prefs", {"profile.default_content_settings.cookies": 2})
        #options.add_argument("--headless")
        #options.add_argument("start-maximized")
        #options.add_argument("--headless")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_experimental_option("prefs", {"profile.default_content_setting_values.cookies": 2})
        #options.add_argument(
            #"user-agent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36")
        chrome = wb.Chrome(executable_path = 'chromedriver.exe')
        return chrome

    def initialize_browser(self):
        """This function opens up the Chrome Browser and returns the Selenium Webdriver.
        This becomes important for scraping as the scraper can scrape all the links in
        the same tab instead of opening new tabs for each link

           Args:
               None

           Returns:
               The configured Selenium Webdriver

           """
        driver = self.initialize_driver()
        WebDriverWait(driver, 30).until(  # wait until document loads. No explicit wait.
            lambda driver: driver.execute_script('return document.readyState') == 'complete')
        return driver

    def get_outer_html(self,url_list, driver):
        """This is a function that goes to each news article link and scrapes the outer
        html of each news article link. Returns the raw outerhtml text of these links.

           Args:
               url_list: list of news article links to scrape
               driver: the selenium webdriver to use to scrape the link

           Returns:
                pages: raw outerhtml content of each news article link
                page.

           """
        driver.delete_all_cookies()
        pages = []
        for url in url_list:
            driver.execute_script("window.open('" + url + "','_self');")#replace lins 40-41 with the snippet on slack. move line 40 to the start function.
            WebDriverWait(driver, 10).until( #wait until document loads. No explicit wait.
                lambda driver: driver.execute_script('return document.readyState') == 'complete')
            driver.implicitly_wait(20)
            '''chrome.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")'''
            object = driver.find_element_by_tag_name("body").get_attribute('outerHTML')
            sleep(randint(10, 11))
        driver.close()
        return pages

    def parser(self,pagelist):
        """This is a function that given the raw outerhtml data
        will convert the raw outerhtml data to a form that can be
        fit for parsing.

           Args:
               pagelist: raw outerhtml data gathered from the get_outer_html method

           Returns:
               parsed: the raw outerhtml data that's able to be parsed using BeautifulSoup.

           """
        parsed = []
        for description in pagelist:
            soup = BeautifulSoup(description, "html.parser")
            parsed.append(soup)
        return parsed

    def get_text(self,pages, urllist):
        """This is a function that gets the article text using BeautifulSoup

           Args:
               pages: parsed raw outerhtml
               urllist: link to news article

           Returns:
               descriptions: the text of the news article
               page: the link to the news article.

           """
        descriptions = []
        page = []
        for item, url in zip(pages, urllist):
            vendor_div = item.find_all('p')
            for div in vendor_div:
                descriptions.append(div.text)
                page.append(url)
        return descriptions, page

    def aggregator(self,articles, urls):
        """I noticed that the get_text method does not return all the article text at once,
        but in chunks. This aggregator function aggregated the chunks retrieved from the
        get_text method.

           Args:
               articles: Chunks of article text to be aggregated
               urls: article links associated with each chunk of article text.

           Returns:
               Pandas Dataframe containing full article and its associated link

           """
        articles_df = pd.DataFrame({"articles": articles,
                                    "links": urls})
        articles_df = articles_df.groupby(articles_df['links']).aggregate({"articles": 'sum'})
        return articles_df

    def keybert(self,df):
        """This is a function that given the full articles dataframe
         generated in the aggregator method, will use the article text
         and generate keywords. Also, this function appends the keyword
         to the articles dataframe and returns it.

           Args:
               df: The articles_df containing the text of the article and
               its link.

           Returns:
               df: The articles_df appended with a keywords column containing
               the top 5 bi/trigrams of each article

           """
        texts = df['articles'].tolist()
        keywords = []
        for string in texts:
            model = KeyBERT('distilbert-base-nli-mean-tokens')
            extracted = [model.extract_keywords(string, keyphrase_ngram_range=(2, 3), stop_words='english'
                                                , use_maxsum=True, top_n=5)]
            keywords.append(extracted)
        df['keywords'] = keywords
        return df

    def run(self, url_list):
        """This is a function that given the list of article links to scrape
        will combine all the methods above and generate a csv of the final
        articles_df created in the keybert method

           Args:
               url_list

           Returns:
               Reshaped train and test set data that has a 3-D shape. This data
               is what's fed into the model.

           """
        driver = self.initialize_browser()
        pages = self.get_outer_html(url_list, driver)
        parsed = self.parser(pages)
        text, page = self.get_text(parsed, url_list)
        articles_df = self.aggregator(text, page)
        articles_df = self.keybert(articles_df)
        articles_df.to_csv('keyword_extraction_poc.csv')



