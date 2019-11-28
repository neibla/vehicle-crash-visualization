# Vehicle Crashes

## Background
Being able to analyse crash sites and statistics is important as [motor vehicle crashes are a major cause of premature deaths in New Zealand][1], as well as contributing to a significant [social cost at an estimated $4.8 billion over the 2017 period][2].

The purpose of this project is to improve visual analysis of crash sites for identifying key issues on our road networks.

[1]: https://www.transport.govt.nz/mot-resources/road-safety-resources/roadcrashstatistics/social-cost-of-road-crashes-and-injuries/report-overview/
[2]: http://archive.stats.govt.nz/browse_for_stats/snapshots-of-nz/nz-social-indicators/Home/Individual%20safety%20and%20security/m-v-casualties.aspx

## Credits:

Data Visualization:
* https://github.com/uber/deck.gl
* https://eng.uber.com/h3/
* https://deck.gl/#/examples/core-layers/hexagon-layer

Map:
* https://mapbox.com

Data Sources:
* https://opendata-nzta.opendata.arcgis.com/datasets/crash-analysis-system-cas-data
* data transformer https://github.com/neibla/nz-crash-data

Related Work:
* https://maphub.nzta.govt.nz/cas/


## Development:
### Prereqs
yarn via (on MacOS)
```
brew install yarn
```

# Mapbox Access Token
1. create the following file at the root:
```
.env.development.local
```
2. go to https://mapbox.com and create an account to get an access token
3. in .env.development.local substitute ACCESS_TOKEN for your access token
```
REACT_APP_MapboxAcessToken=ACCESS_TOKEN
```
### Run
```
yarn start
```

### Build
```
yarn build
```