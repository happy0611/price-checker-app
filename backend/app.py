from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin

app = Flask(__name__)
CORS(app)

amazonurl = "https://www.amazon.co.jp/gp/bestsellers/books/ref=zg_bs_books_sm"

def fetch_books():
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    books_data = []

    try:
        driver.get(amazonurl)
        driver.implicitly_wait(10)

        imagetags = driver.find_elements(By.CSS_SELECTOR, "img.a-dynamic-image.p13n-sc-dynamic-image.p13n-product-image")
        span_tags = driver.find_elements(By.CSS_SELECTOR, "span._cDEzb_p13n-sc-price_3mJ9Z")

        for i in range(min(6, len(imagetags), len(span_tags))):
            image = imagetags[i]
            span = span_tags[i]

            img_url = image.get_attribute('src')
            if img_url and not img_url.startswith(('http://', 'https://')):
                img_url = urljoin(amazonurl, img_url)

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

@app.route("/setting", methods=["GET", "POST"])
def save_settings():
    if request.method == "GET":
        # デフォルト設定を返す
        return jsonify({"period": 24, "interval": 1})
    elif request.method == "POST":
        # リクエストからデータを取得
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        period = data.get("period")
        interval = data.get("interval")

        if period is None or interval is None:
            return jsonify({"error": "Invalid data"}), 400
        
        # ここで設定データを保存する処理を追加します
        print(f"Settings saved: period={period}, interval={interval}")

        # データ保存処理の成功レスポンスを返す
        return jsonify({"message": "Settings saved successfully", "period": period, "interval": interval})

if __name__ == '__main__':
    app.run(debug=True)
