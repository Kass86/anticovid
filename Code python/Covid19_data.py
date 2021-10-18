import pandas as pd
import os
from pandas.core.dtypes.missing import notnull
import requests
from datetime import datetime
import plotly.express as px
from PyConnectDatabase import Querydata
from LinearRegression_Model import PredictNewCases, new_case_nextday

# Get the current working directory
path = os.getcwd()

# Preprocessing data and save .csv file on local directory
def get_data_csv():
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    req = requests.get(url)
    url_contend = req.content
    csv_file = open('covid19_data.csv', 'wb')
    csv_file.write(url_contend)
    csv_file.close()
    date = datetime.now()
    print('Data will be updated at %s' % date)


def get_data_json():    
    # Download data
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    df = pd.read_csv(url)

    # Convert date format
    df['date'] = pd.to_datetime(df['date'])
    df = df[df.date >= '2021-01-01']
    df['date'] = df['date'].dt.strftime("%d-%m-%Y")
    date_update = datetime.now()

    # Choose some columns of data table
    cols = ['iso_code', 'continent', 'location', 'date','population', 'total_cases', 'new_cases','new_cases_smoothed', 'total_deaths', 'new_deaths','new_deaths_smoothed', 'total_vaccinations']
    df = df[cols]

    # Total case conirmed ranking by country
    country_ranking = pd.DataFrame(df[df['continent'].notnull()].groupby('location')['new_cases'].sum().sort_values(ascending=False).head(50))
    country_ranking = country_ranking.index.to_list()
    data = pd.DataFrame()
    for country in country_ranking:
        df1 = df[df['location'] == country]
        data = data.append(df1)
    data = data.reset_index()
    data.iloc[:,4:] = data.iloc[:,4:].fillna( 0)
    data['location'] = data['location'].replace('Czechia', 'Czech')
  
    data['next_day_predict'] = 0
    for country in country_ranking:
        newcase = new_case_nextday(14, country)
        data.loc[data['location'] == country,'next_day_predict'] = newcase

    # Save Cleaned data in .csv file
    data.to_csv(r'%s\covid19_data_cleaned.csv' % path)
    print('Cleaned data has been updated at %s' %date_update)
    return data

# Data visualizations
def clean_data():
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    df = pd.read_csv(url)
    cols = ['iso_code', 'continent', 'location', 'date','population', 'total_cases', 'new_cases','new_cases_smoothed', 'total_deaths', 'new_deaths','new_deaths_smoothed', 'total_vaccinations',
        'reproduction_rate','stringency_index']
    df = df[cols]
    df.iloc[:, 4:] = df.iloc[:,4:].fillna(0)
    df.to_csv(r'%s\covid19_data_cleaned.csv' % path)
    return df

def line_chart(countries,column):
    df = clean_data()
    data = pd.DataFrame()
    for country in countries:
        data = data.append(df[df['location'] == country])
    fig = px.line(data, x= data['date'], y=data[column], color = data['location'])
    fig.show()

def map_chart(area, column):
    df = clean_data()
    df = df.sort_values(by='date')
    fig = px.choropleth(df,
                    locations = area,
                    color=df[column],
                    color_continuous_scale='amp',
                    hover_name=df['location'],
                    animation_frame=df['date'])
    fig.update_layout(title = "Daily new confirmed COVID-19 cases, Jan 28, 2020")
    fig.show()

if __name__ == "__main__":
    df = get_data_json()

