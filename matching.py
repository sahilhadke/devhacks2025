from datetime import datetime, timedelta
import numpy as np
from geopy.distance import great_circle
from collections import defaultdict

from sklearn.neighbors import BallTree

#processed_df_i = P_i = [s_i, e_i, r_i, ref_i, intro_i]
COL_ST = 'Starting'
COL_END = 'Destination'
RATING = 'Score'

DIST = 'proximal_rank'

CRITERIA_WEIGHTS = {
    'start_proximity': 0.2,
    'end_proximity': 0.2,
    'rating_weight': 0.6
}


def get_proximal_dist(st_1, st_2, end_1, end_2, dist_df):
    return dist_df.loc[st_1][DIST][st_2], dist_df.loc[end_1][DIST][end_2]

def compute_matching_score(st_dist, end_dist, rating):
    return CRITERIA_WEIGHTS['start_proximity'] * st_dist + CRITERIA_WEIGHTS['end_proximity'] * end_dist + CRITERIA_WEIGHTS['rating_weight'] * rating


def find_companions(st_place, end_place, arrival_time, processed_df, dist_df, k=5):
    """
    st_place: starting place 
    end_place: ending place
    arrival_time: datetime object
    preprocessed_df: DataFrame with preprocessed data
    k: number of companions to find
    """
    
    
    matches = defaultdict()
    for idx, person in processed_df.iterrows():
        st_dist,end_dist = get_proximal_dist(st_place, person[COL_ST], end_place, person[COL_END], dist_df)

        match_score = compute_matching_score(st_dist, end_dist, person[RATING])
        matches[person['person_id']] = match_score
        
    
    ans = sorted(matches.items(), key=lambda x: x[1])
    ans = [person_id for person_id, score in ans]
    return ans[:k]
