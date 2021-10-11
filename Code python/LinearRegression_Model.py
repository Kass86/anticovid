# We apply Linear Regression model to predict new_cases infected in next day
import pandas as pd
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
from pandas.core.frame import DataFrame
from scipy.sparse import data
from scipy.sparse.lil import _prepare_index_for_memoryview
from sklearn.linear_model import LinearRegression
from PyConnectDatabase import Querydata

def GetData():
    file_name = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    df = pd.read_csv(file_name)
    cols = ['iso_code', 'continent', 'location', 'date','population', 'total_cases', 'new_cases','new_cases_smoothed', 'total_deaths', 'new_deaths','new_deaths_smoothed', 'total_vaccinations',
        'reproduction_rate','stringency_index','hosp_patients', 'icu_patients','new_tests']
    df = df[cols]
    df = df.set_index('date')
    df.iloc[:,3:] = df.iloc[:,3:].fillna(0)
    return df


def FindDayTrain(country):
    # Read data
    data = GetData()
    data = data[data['location'] == country]
    l = list(range(0,len(data),1))
    data['No.'] = pd.DataFrame(l, index = data.index)

    # Feature
    feature = ['hosp_patients', 'icu_patients','new_tests','new_deaths']
    target = ['new_cases_smoothed']
    
    # Find out day_train
    X= data[feature].values
    y = data[target].values
    
    idd = 0
    day_train_loop = pd.DataFrame(index =['Mean error'])
    for i in range(7,31):
        day_train = i
        pred_day = 300
        y_predict=[]
        y_true=[]
        error =[]
        for k in range(len(data)-pred_day):
                X_train = X[pred_day-day_train-2:pred_day-2,:]
                y_train = y[pred_day-day_train-1:pred_day-1,:]
                regressor = LinearRegression().fit(X_train,y_train)
                y_pred = regressor.predict(X[pred_day,:].reshape(1,-1))
                y_tru = data.iloc[pred_day]['new_cases']
                y_predict.append(y_pred)
                y_true.append(y_tru)
                error.append(abs(y_tru-y_pred))
                pred_day +=1
                X_train =[]
                y_train =[]

        # Insert average of error on dataframe
        day_train_loop.insert(idd,"%s_days" %i ,round(np.array(error).mean(),0))
        idd +=1
    
    # Find out the day_train 
    day_train_good = int(day_train_loop.idxmin(axis=1).iloc[0].strip('_days'))
    return day_train_good, data

def PredictNewCases(country,plot=False):
    # get data and day_train variable
    day_train, data = FindDayTrain(country)

    # Feature
    feature = ['hosp_patients', 'icu_patients','new_tests','new_deaths']
    target = ['new_cases_smoothed']
    
    # X,y to predict
    X= data[feature].values
    y = data[target].values

    pred_day = 300
    y_predict=[]
    y_true=[]
    error =[]
    for k in range(len(data)-pred_day):
                X_train = X[pred_day-day_train-2:pred_day-2,:]
                y_train = y[pred_day-day_train-1:pred_day-1,:]
                regressor = LinearRegression().fit(X_train,y_train)
                y_pred = regressor.predict(np.array(X[pred_day,:]).reshape(1,-1))
                y_tru = data.iloc[pred_day]['new_cases']
                y_predict.append(y_pred)
                y_true.append(y_tru)
                error.append(abs(y_tru-y_pred))
                pred_day +=1
                X_train =[]
                y_train =[]
    if plot:
        fig, ax = plt.subplots(figsize=(15, 10))
        ax.plot(data[0:len(y_predict)]['No.'].values.reshape(-1,1), np.array(y_predict).reshape(-1,1),color='red', label="Predict", linewidth=1)
        ax.plot(data[0:len(y_predict)]['No.'].values.reshape(-1,1), np.array(y_true).reshape(-1,1),color='green', label="True", linewidth=1)
        ax.set_title("PREDICTON NEW CASE INFECTED IN %s" %country)
        ax.set_xlabel("Date")
        ax.set_ylabel("Number of new cases infected")
        plt.legend()
        plt.show()
    else:
        pass

def Trainning_data(num_country):
    day_train = pd.DataFrame(index=['Day_train'])
    data = GetData()
    #countries = data['location'].unique()
    countries = country_ranking(num_country)
    idd = 0
    for cont in countries:
        day,_ = FindDayTrain(cont)
        day_train.insert(idd,"%s"%cont ,day)
        idd +=1
    return day_train

def country_ranking(num_country):
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
    country_ranking = pd.DataFrame(df[df['continent'].notnull()].groupby('location')['new_cases'].sum().sort_values(ascending=False).head(num_country))
    country_ranking = country_ranking.index.to_list()

    return country_ranking



def new_case_nextday(day_train, country):
    # Load data 
    data = GetData()
    data = data[data['location'] == country]

    # Feature
    feature = ['hosp_patients', 'icu_patients','new_tests','new_deaths']
    target = ['new_cases_smoothed']
    
    # X,y to predict
    X_train = data.iloc[len(data)-day_train-2:len(data)-2][feature].values
    X_pred = data.iloc[len(data)-1][feature].values
    y_train = data.iloc[len(data)-day_train-2:len(data)-2][target].values

    # Linear Regression
    regressor = LinearRegression().fit(X_train,y_train)
    y_pred = regressor.predict(np.array(X_pred).reshape(1,-1))
    newcasenextday = int(y_pred)
    return round(newcasenextday,0)
    

if __name__ == "__main__":
    #data = GetData()
    #print(data)
    country = 'United States'
    #day_train, data = FindDayTrain(country)
    #print(day_train)
    #print(data)
    #PredictNewCases(country,plot=True)
    newcasenextday = new_case_nextday(14, 'Vietnam')
    print(newcasenextday)
    
    
    
