# Sentiment Analysis of 2016 Presidential Election Coverage
Yeah it's mouthful, but it's neat.

## Project Explanation
Purpose: To determine biases in media coverage of 2016 presidential candidates. Specifically in terms of Twitter coverage. Bias can be either in relative volume of news coverage or in relative sentiment of said coverage.

##Technical Structure:
/SentimentAnalysis: The web application. Created with meteor, utilizing a mongodb database.

/"Twitter Scrape": A nodejs-based Twitter API interfacing tool to download the most up-to-date info from Twitter. For internal use - not production-ready.

### Dependencies
 - node
 - npm
 - meteor

### Instructions
To run the web application on the 3000 port:

```
$ git clone https://github.com/NYU-CS6313-SPRING2016/Group-15-2016-Candidates.git
$ cd Group-15-2016-Candidates/SentimentAnalysis
$ npm install
$ meteor
```
