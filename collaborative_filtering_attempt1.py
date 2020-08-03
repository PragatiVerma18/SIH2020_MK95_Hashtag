from surprise import Reader, Dataset, SVD

from surprise.model_selection import cross_validate

import pandas as pd

reader = Reader()

ratings = pd.read_csv('ratings_smal.csv')

ratings.head()

data = Dataset.load_from_df(ratings[['userId', 'jobid', 'rating']], reader)

svd = SVD()

cross_validate(svd, data, measures=['RMSE', 'MAE'])

trainset = data.build_full_trainset()

svd.fit(trainset)

svd.predict(26, 1)
