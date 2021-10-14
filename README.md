# anticovid

INTRO:

UI:

PREDICTION:

1. Difine problem:
   - How many new cases are confirmed tomorrow?
   - In order to answer the above question. We use a basic Machine Learning Algorithm that is Linear Regression.
2. Our data:

   - Data's description here: https://github.com/owid/covid-19-data/tree/master/public/data
   - Covid19 Dashboard here: https://datastudio.google.com/s/sR3DrBad-v8
   - Because the data collection has a large noise, we will use the smoothing data (7-day smoothed) to be `target` feature.

   ![Covid19 data of United States](https://user-images.githubusercontent.com/48504388/137137839-db9bd5bc-d59e-43bd-95c0-ce80433f1f62.jpg)

3. Feature selection:
   ![heatmap](https://user-images.githubusercontent.com/48504388/137139543-b9bafbde-a434-4651-b878-69a820c3b376.jpg)

   - We choose some `train` features that have high correlation metrics and we'll use data of 14 days previous to train model.

4. Model evaluation:

SETUP-
REQUIREMENT/
RUN/
