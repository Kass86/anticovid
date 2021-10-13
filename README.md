# anticovid

INTRO:
- Data's description here: https://github.com/owid/covid-19-data/tree/master/public/data
- Covid19 Dashboard here: https://datastudio.google.com/s/sR3DrBad-v8

UI:

PREDICTION:
- How many new cases are confirmed tomorrow?
- In order to answer the above question. We use a basic Machine Learning Algorithm that is Linear Regression.
- We choose some `train` features that have high correlation metrics and we'll use data of 14 days previous to train model.
- Because the data collection has a large noise, we will use the smoothing data (7-day smoothed) to be `target` feature.
- Feature selection: Look at the heatmap
![image](https://user-images.githubusercontent.com/48504388/137135581-21a23d94-fd99-4e82-9751-702a971a46c3.png)


SETUP-
REQUIREMENT/
RUN/
