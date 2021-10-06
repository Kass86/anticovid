# Query data by SQL language via python code

from datetime import date
from pandas.core.indexes.datetimes import date_range
from sqlalchemy import create_engine, MetaData, Table, select, engine, insert
import pandas as pd
from sqlalchemy.sql.expression import column


# Connect database 
def ConnectDatabase():
    SERVER = 'DESKTOP-J60SFS7\VIET'
    DATABASE = 'PortfolioProject'
    DRIVER = 'SQL Server Native Client 11.0'
    USERNAME = 'sa'
    PASSWORD = 'Queentranv2206'
    DATABASE_CONNECTION = f'mssql://{USERNAME}:{PASSWORD}@{SERVER}/{DATABASE}?driver={DRIVER}'

    engine = create_engine(DATABASE_CONNECTION)
    connection = engine.connect()
    return connection

 # Query data from server
def Querydata():
    connection = ConnectDatabase()
    #country = "'United States'"
    #data = pd.read_sql_query("select top 100 * from [PortfolioProject].[dbo].[CovidDeaths] WHERE location = %s order by [location] asc" %country, connection)
    data = pd.read_sql_query("select * from [PortfolioProject].[dbo].[covid19_data] order by 3,4 ASC" , connection)
    return data

def UpdateDatabase():
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    df = pd.read_csv(url)
    df['date'] = pd.to_datetime(df['date'])
    olddata = Querydata()
    olddata['date'] = pd.to_datetime(olddata['date'],format="%Y-%m-%d")
    if len(df) != len(olddata):
        time_diff = olddata['date'].max()
        newdata = df[df['date'] > time_diff].reset_index().drop(columns=['index'])
        newdata.to_sql(con = ConnectDatabase(),name='covid19_data',if_exists='append', index=False)
        print("Data was updated")
    else:
        print("No different data")
    return newdata


if __name__ == "__main__":
    newdata = Querydata()
    print(newdata)

    