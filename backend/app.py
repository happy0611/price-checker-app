from flask import Flask, jsonify, request
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import requests
from urllib.parse import urljoin

import datetime
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

amazonurl = "https://www.amazon.co.jp/gp/bestsellers/books/ref=zg_bs_books_sm"

# Firebase Admin SDK の初期化
cred = credentials.Certificate('/Users/souma0826manu/Desktop/hibikiLab/React学習/Otoya/price-checker-app/frontend/src/price-checker-app-34a47-firebase-adminsdk-3s43g-a30c4e7b57.json')  # サービスアカウントキーのパス
# cred = credentials.Certificate('/mnt/c/Users/user/Documents/Otoya/price-checker-app/frontend/src/price-checker-app-34a47-firebase-adminsdk-3s43g-a30c4e7b57.json')  # サービスアカウントキーのパス
firebase_admin.initialize_app(cred)

db = firestore.client()

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

@app.route('/settings', methods=['GET', 'POST'])
def save_settings():
    if request.method == 'GET':
        # Firestore から現在の設定を取得して返す
        settings_ref = db.collection('settings').document('app_settings')
        doc = settings_ref.get()
        if doc.exists:
            settings = doc.to_dict()
            return jsonify(settings)
        else:
            return jsonify({'period': 24, 'interval': 1})
    else:
        data = request.get_json()  # JSON形式でリクエストボディを取得
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        period = data.get('period')
        interval = data.get('interval')
        image = data.get('image')
        alt_text = data.get('alt_text')
        price = data.get('price')
        start_date = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))

        if period is None or interval is None or not image or not alt_text or not price:
            return jsonify({'error': 'Invalid data'}), 400
        
        remaining_days = period  # periodから残りの日数を計算

        print(f'Settings saved: period={period}, interval={interval}, image={image}, alt_text={alt_text}, price={price}')

        # Firestore に設定を保存
        settings_ref = db.collection('tracked_items').document()  # ドキュメントIDは自動生成
        settings_ref.set({
            'start_date': start_date,
            'remaining_days': remaining_days,
            'interval': interval,
            'image': image,
            'alt_text': alt_text,
            'price': price
        })

        return jsonify({
            'message': 'Settings saved successfully',
            'period': period,
            'interval': interval,
            'remaining_days': remaining_days,
            'image': image,
            'alt_text': alt_text,
            'price': price
        })

if __name__ == '__main__':
    app.run(debug=True)
