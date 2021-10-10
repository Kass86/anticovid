import pandas as pd
import os
import requests
from datetime import datetime
import plotly.express as px
from PyConnectDatabase import Querydata
from LinearRegression_Model import PredictNewCases

# Get the current working directory
path = os.getcwd()

# Preprocessing data and save .csv file on local directory
def get_data_csv():
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    df = pd.read_csv(url)
    req = requests.get(url)
    url_contend = req.content
    csv_file = open('covid19_data.csv', 'wb')
    csv_file.write(url_contend)
    csv_file.close()
    date = datetime.now()
    print('Data will be updated at %s' % date)
    return df

def clean_data():
    df = pd.read_csv('covid19_data.csv', encoding= 'ISO-8859-1')
    cols = ['iso_code', 'continent', 'location', 'date','population', 'total_cases', 'new_cases','new_cases_smoothed', 'total_deaths', 'new_deaths','new_deaths_smoothed', 'total_vaccinations',
        'reproduction_rate','stringency_index']
    df = df[cols].fillna(0)
    df.to_csv(r'%s\covid19_data_cleaned.csv' % path)
    return df
    
def get_data_tuan():
    #df = Querydata()
    df = get_data_csv()
    cols = ['iso_code', 'continent', 'location', 'date','population', 'total_cases', 'new_cases','new_cases_smoothed', 'total_deaths', 'new_deaths','new_deaths_smoothed', 'total_vaccinations']
    df = df[cols]
    df = df.loc[(df.location == 'United States') | (df.location == 'United Kingdom') | (df.location == 'Vietnam') | (df.location == 'Brazil')
            | (df.location == 'India') | (df.location == 'Italy') | (df.location == 'Germany') | (df.location == 'France')]
    df = df[df.date >= '2021-01-01']
    df = df.reset_index()
    df['new_cases_predict'] = df.new_cases_smoothed + 5000
    df.to_json(r'%s\covid19_data_cleaned.json' % path)
    covid19_data = df.to_json()
    return covid19_data

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
    data['location'] = data['location'].replace('Czechia', 'Czech')
    data.iloc[:,4:] = data.iloc[:,4:].fillna(0)
    # Save Cleaned data in .csv file
    data.to_json(r'%s\covid19_data_cleaned.json' % path)
    #covid19_data = df.to_json()
    return print('Cleaned data has been updated at %s' %date_update)


def get_data(country,data):
    df = clean_data()
    df = df[df['location'] == country]
    return df.to_numpy()


# Data visualizations

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
    '''Update data'''
    #update_data()
    #clean_data()

    '''Line chart'''
    #country = ['United State', 'Vietnam', 'United Kingdom', 'India', 'China']
    #column = 'new_cases_smoothed'
    #line_chart(country, column)

    '''Map chart'''
    #area = 'iso_code'
    #column = 'new_cases'
    #map_chart(area, column)
    
    #np = get_data('Vietnam','new_cases')
    #print(np)

    #df = get_data_tuan()
    # Tuan lay data dinh dang json nay nha
    data = get_data_json()