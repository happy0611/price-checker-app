from flask import Flask, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import requests
from urllib.parse import urljoin

app = Flask(__name__)
CORS(app)

amazonurl = "https://www.amazon.co.jp/gp/bestsellers/books/ref=zg_bs_books_sm"

def fetch_books():
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")  # サンドボックスを無効にする（特定の環境で必要な場合あり）
    chrome_options.add_argument("--disable-dev-shm-usage")  # ディスクの共有メモリ使用を無効にする
    # chrome_options.add_argument("--headless")  # ヘッドレスモードをコメントアウトしてUIを表示（デバッグ用）

    # ChromeDriverのパスを自動的に管理する
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    books_data = []

    try:
        driver.get(amazonurl)
        driver.implicitly_wait(10)  # ページが完全に読み込まれるまで待機

        imagetags = driver.find_elements(By.CSS_SELECTOR, "img.a-dynamic-image.p13n-sc-dynamic-image.p13n-product-image")
        span_tags = driver.find_elements(By.CSS_SELECTOR, "span._cDEzb_p13n-sc-price_3mJ9Z")

        for i in range(min(5, len(imagetags), len(span_tags))):
            image = imagetags[i]
            span = span_tags[i]

            img_url = image.get_attribute('src')
            if img_url and not img_url.startswith(('http://', 'https://')):
                img_url = urljoin(amazonurl, img_url)

            # 画像の情報を保存しない代わりに、URLを含める
            book_data = {
                'image_url': img_url,
                'alt_text': image.get_attribute("alt"),
                'price': span.text.strip()
            }
            books_data.append(book_data)

    finally:
        driver.quit()

    return books_data

@app.route('/books', methods=['GET'])
def get_books():
    books = fetch_books()
    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)
