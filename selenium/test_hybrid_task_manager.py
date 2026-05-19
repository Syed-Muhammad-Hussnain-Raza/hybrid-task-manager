# Selenium Test Suite - Hybrid Task Manager

import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


BASE_URL = "http://68.210.41.55"

DEMO_MODE = True
SLEEP_TIME = 2

def pause(message=""):
    if message:
        print(message)
    if DEMO_MODE:
        time.sleep(SLEEP_TIME)


def get_driver():
    options = Options()

    options.add_argument("--start-maximized")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    driver.implicitly_wait(10) # wait up to 10 seconds for elements to appear
    return driver


class TC01_HomepageLoad(unittest.TestCase):

    def setUp(self):
        print("\nTC01: Homepage Load")
        self.driver = get_driver()

    def tearDown(self):
        pause("Closing browser")
        self.driver.quit()

    def test_homepage_title(self):
        print("Opening homepage")
        self.driver.get(BASE_URL)
        pause("Page loaded")

        print("Checking page title")
        self.assertEqual(self.driver.title, "Hybrid Task Manager")
        pause("Title verified")

class TC03_PersonalTaskForm(unittest.TestCase):

    def setUp(self):
        print("\nTC03: Personal Task Form")
        self.driver = get_driver()

    def tearDown(self):
        pause("Closing browser")
        self.driver.quit()

    def test_personal_task_input(self):
        print("Opening application")
        self.driver.get(BASE_URL)
        pause("Page loaded")

        print("Filling personal task form")

        title = self.driver.find_element(By.ID, "personalTitle")
        desc = self.driver.find_element(By.ID, "personalDesc")
        assigned = self.driver.find_element(By.ID, "personalAssigned")

        title.send_keys("Demo Task")
        pause("Title entered")

        desc.send_keys("Demo description")
        pause("Description entered")

        assigned.send_keys("Test User")
        pause("Assigned entered")

        print("Form input completed")

class TC05_DemoFlow(unittest.TestCase):

    def setUp(self):
        print("\nTC05: Full Demo Flow")
        self.driver = get_driver()

    def tearDown(self):
        pause("Closing browser")
        self.driver.quit()

    def test_add_task_flow(self):
        print("Opening application")
        self.driver.get(BASE_URL)
        pause("Page loaded")

        print("Entering task details")

        self.driver.find_element(By.ID, "personalTitle").send_keys("Demo Task 1")
        pause("Title entered")

        self.driver.find_element(By.ID, "personalDesc").send_keys("Demo description")
        pause("Description entered")

        self.driver.find_element(By.ID, "personalAssigned").send_keys("Selenium Bot")
        pause("Assigned entered")

        print("Clicking Add Personal Task button")

        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        btn = next(b for b in buttons if "Add Personal Task" in b.text)
        btn.click()

        pause("Task submitted")

        print("Verifying task in list")

        task_list = self.driver.find_element(By.ID, "personalTasksList")
        self.assertIn("Demo Task 1", task_list.text)

        pause("Task verified")

        print("Demo completed successfully")


if __name__ == "__main__":
    print("Starting Selenium Demo Suite")
    print("Target:", BASE_URL)
    unittest.main(verbosity=1)