from flask import Flask, request, jsonify
from preprocessing import preprocess_proximal_points, preprocess_users
from matching import find_companions

import pandas as pd

app = Flask(__name__)

LANDMARKS_CSV = 'test.csv'
USER_CSV = 'landmarks.csv'



@app.route('/match-companions', methods=['GET'])
def process_json():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No query parameters provided"}), 400

    # Process the JSON payload (example: print and return it)
    # try:
    start_landmark = data.get('start_place')
    end_landmark = data.get('end_place')
    arrival_time = data.get('arrival_time')

    landmarks_df = preprocess_proximal_points(LANDMARKS_CSV)
    users_df = preprocess_users(USER_CSV)

    suggestion_list = find_companions(
        start_landmark,
        end_landmark,
        arrival_time,
        users_df,
        landmarks_df
    )
    user_data = pd.read_csv(USER_CSV, index_col=0)
    suggestion_list = user_data.loc[suggestion_list].to_dict(orient='records')


    return jsonify({"message": "Success", "data": suggestion_list}), 200

if __name__ == '__main__':
    app.run(debug=True)
