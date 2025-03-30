import pandas as pd
import numpy as np
from sklearn.neighbors import BallTree
COL_LAT = 'latitude'
COL_LON = 'longitude'
NAME = 'dummy_name'

ST_PLACE = 'Starting'
END_PLACE = 'Destination'
MR  = 'Main'
SOC = 'Social'
REF = 'Referred'

def calculate_score(main_rating, social_ratings, referral_rating):
    MAIN_WEIGHT = 0.5
    REFERRAL_WEIGHT = 0.3
    INTRO_WEIGHT = 0.2

    main_score = (main_rating / 5) if main_rating is not None else 0
    social_avg = (sum(social_ratings)/len(social_ratings)/5) if social_ratings else 0
    ref_score = referral_rating / 5

    return (main_score * MAIN_WEIGHT) + (social_avg * REFERRAL_WEIGHT) + (ref_score * INTRO_WEIGHT)

def preprocess_proximal_points(csv_path):
    df = pd.read_csv(csv_path)
    
    df['latitude_rad'] = np.radians(df[COL_LAT])
    df['longitude_rad'] = np.radians(df[COL_LON])
    
    tree = BallTree(
        df[['latitude_rad', 'longitude_rad']].values, 
        metric='haversine'
    )
    
    distances, indices = tree.query(
        df[['latitude_rad', 'longitude_rad']].values, 
        k=len(df)
    )
    
    earth_radius_miles = 3958.8
    df['proximal_rank'] = [{df.iloc[i][NAME] :  d*earth_radius_miles 
         for i, d in zip(row_indices, row_dists) }
        for idx, (row_indices, row_dists) in enumerate(zip(indices, distances))
    ]
    df.drop(columns=['latitude_rad', 'longitude_rad', COL_LAT, COL_LON], inplace=True)
    df.set_index(NAME, inplace=True)
    return df

def preprocess_users(csv_path):
    df = pd.read_csv(csv_path)
    scores = []
    for idx,row in df.iterrows():
        main_rating = row[MR]
        social_ratings = row[SOC].split(',') if pd.notna(row[SOC]) else []
        referral_rating = row[REF]

        social_ratings = [float(rating) for rating in social_ratings]

        score = calculate_score(main_rating, social_ratings, referral_rating)
        
        scores.append(score)
    df['Score'] = scores
    df.drop(columns=[MR, SOC, REF], inplace=True)
    return df



