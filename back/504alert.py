from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime



gmailId = "samleach2018@gmail.com";
password = "GL2005-11!gj";
recipient = "samleach2018@gmail.com";

now = datetime.now()

current_time = now.strftime("%H:%M:%S")
time = "Current Time =" + current_time
try:

    driver = webdriver.Chrome(ChromeDriverManager().install())
    console.log("test")
    driver.get(r'https://accounts.google.com/signin/v2/identifier?continue='+\
    'https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1'+\
    '&flowName=GlifWebSignIn&flowEntry = ServiceLogin')
    console.log("test1")
    driver.implicity_wait(30)
    console.log("test2")

    loginBox = driver.find_element_by_xpath('//*[@id ="identifierId"]')
    loginBox.send_keys(gmailId)

    nextButton = driver.find_elements_by_xpath('//*[@id = "identifierNext"]')
    nextButton[0].click()

    passwordBox = driver.find_element_by_xpath('//*[@id ="password"]/div[1]/div / div[1]/input')
    passwordBox.send_keys(passWord)

    nextButton = driver.find_elements_by_xpath('//*[@id = "passwordNext"]')
    nextButton[0].click()

    print('Login Successful...!!')

    draftButton = driver.find_elements_by_xpath('//*[@id =":kr"]')
    draftButton[0].click()

    recipientinput = driver.find_element_by_xpath('//*[@id= ":11f"]')
    recipientinput.send_keys(recipient)

    textbutton = driver.find_elements_by_xpath('//*[@id= ":xv"]')
    textbutton.send_keys(time)


    composeButton = driver.find_element_by_xpath('//*[@id= ":wg"]')
    composeButton[0].click()

    print('Email Sent!')
except:
    print('Login Failed')
