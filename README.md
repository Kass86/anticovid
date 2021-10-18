# AntiCovid

INTRO:

As we know, the Covid-19 situation is really hot now and to grasp that situation, we build a project called Anticovid. Anticovid is a web application (?) working on localhost with pretty user interface base on Javascript, HTML, CSS for UI and Python, SQL for Predicting, that bring to you the Covid-19 information ( total cases, total death cases, new cases and new death cases) of 50 countries in detail and chart, more than that we predict the new cases of next day ( up to 14 days) to catch the trend easily for the disease prevention of every country. With that, we have a map, which will move to the country we choose, so you may have an overall look on that country, and Covid-19 situation of neighbor countries.

USER INTERFACE:

There are 2 part of the UI screen, Sidebar (50rem) on the left and Map on the right.

![Idea](https://f17-zpg.zdn.vn/3658299959576739429/959dde2f7fd1b68fefc0.jpg)
Sidebar, what I focus on, contains:

Toptable inside Workout and it has:

- “tablebase_row”, which have Country, Cases and Death Cases and make 3 base columns for next 50 country rows.

- “table_row”, which have serial number and 3 informations of one country in “tablebase_row” each row, user can scroll to see all of the “table_row”. When user click on “table_row” or we can call user choose a country on the table, the information of Case and Death Case of that row will be hidden (to make effect) and then 8 mini “table_row” will appear, contain 3 information: Date, New cases, New Death Cases of last 7 days. Top of that mini row is a mini row with different background-color ( red when its increase and green when its decrease) contains New cases that we predicted by Python. And after that, the map will move to the country we choose and put a mark on it.
- “Chart” and “Flag”, which appear when user choose a country on the table too. “Chart” will describe the increase and decrease of New case everyday, and when user click on the flag, “Chart” will describe the increase and decrease of New death case.

      If user click on that country again, the table will return initial but “Chart” and “Flag” will not disappear(because I like that more).

- “Form” will appear when user choose any country on the map. Toptable, “Chart” and “Flag” will be hide. “Form” will display the country name, flag, region, population and total case, total death case and another “Chart” describe the increase and decrease of both New case and Death case everyday if we have data of that country. “Form” will display “country not found” if user choose the ocean or anywhere that isn’t a country.
- “Button” will appear on top left of the “Form” that will hide the “Form” and display the Toptable when user click on it.

Flow Chart:
![Flow Chart](https://f42-zpg.zdn.vn/376792903083780140/09b7c0da6124a87af135.jpg)

Html (index.html):

- Linked with CSS (style.css) and Javascript (script.js) and necessary source for map (https://leafletjs.com/) and chart (https://jsfiddle.net/eq8nymsv/).

Javascrip (script.js):

- Its really easy to understand even for beginner.
- It couldn’t call python function yet so user have to work with python to update data.

PREDICTION:

1. Difine problem:
   - What is the trend next week?
   - In order to answer the above question. We use a basic Machine Learning Algorithm that is Linear Regression.
2. Our data:

   - EDA here: https://github.com/Kass86/anticovid/blob/main/Covid19_data_analysis.ipynb
   - Data's description here: https://github.com/owid/covid-19-data/tree/master/public/data
   - Covid19 Dashboard here: https://datastudio.google.com/s/sR3DrBad-v8
   - Because the data collection has a large noise, we will use the smoothing data (7-day smoothed) to be `target` feature.

   ![Covid19 data of United States](https://user-images.githubusercontent.com/48504388/137137839-db9bd5bc-d59e-43bd-95c0-ce80433f1f62.jpg)

3. Feature selection:

   ![heatmap](https://user-images.githubusercontent.com/48504388/137139543-b9bafbde-a434-4651-b878-69a820c3b376.jpg)

   - We choose some `train` features that have high correlation metrics and we'll use data of some days previous to train model.

4. Model evaluation:

   - Look at Covid19 data of United States: Green line is predict values, red line is real data (7-day smoothed).
   - Some faults at peak of the pandemic, but it looks like follow the trend and our new cases predict is reliable.

   ![New cases prediction](https://user-images.githubusercontent.com/48504388/137333656-6765d3f9-598f-4af6-95d8-bc9bd719dce1.jpg)
