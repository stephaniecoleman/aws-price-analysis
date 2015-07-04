# AWS Price Analysis

## About
A Backbone application that displays pricing analysis information between Spot Instances and EC2 from Amazon’s public API endpoints.

+ Data Analysis Includes:
  + The cheapest region overall 
  + The top 10 price per vCPU instances across all regions
  + The on-demand/spot price spread by instance type and region

## Run
```bash
python -m SimpleHTTPServer
```

## Notes
+ Things I plan to work on include:
  + Write tests
  + Integrate Express
  + Integrate RequireJS
