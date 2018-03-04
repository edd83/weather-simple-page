import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import logo from './logo.svg';

const associativeTable = [{key: 'Clouds', img: '/Clouds.png'}, {key: 'Sun', img: '/Sun.png'},
{key: 'Rain', img: '/Rain.png'}, {key: 'Storm', img: '/Storm.png'}, {key: 'Snow', img: '/Snow.png'}];

class App extends Component {
  constructor() {
    super();
    this.state = {
      datas: '',
      arrayDates: []
    };

    this.parseDates = this.parseDates.bind(this);
    this.getInfoToday = this.getInfoToday.bind(this);
    this.getTheMostUsed = this.getTheMostUsed.bind(this);
    this.precisionRound = this.precisionRound.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  componentWillMount() {
    axios.get('https://openweathermap.org/data/2.5/forecast?q=Zagreb,hr&appid=b6907d289e10d714a6e88b30761fae22')
      .then(response => this.setState({datas: response.data}))
      .then(() => this.parseDates())
  }

  parseDates() {
    let tmpArray = [];
    const finalArray = [];
    let myDate = '';
    for (let i = 0; i < this.state.datas.cnt; i++) {
      if (myDate === '') {
        myDate = this.state.datas.list[i].dt_txt.substring(0,10);
      } else if (myDate !== this.state.datas.list[i].dt_txt.substring(0,10)) {
        myDate = this.state.datas.list[i].dt_txt.substring(0,10);
        finalArray.push(tmpArray);
        tmpArray = [];
      }
      tmpArray.push(this.state.datas.list[i]);
    }
    this.setState({arrayDates: finalArray});
  }

  precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  getTheMostUsed(element) {
    const temp = [];
    for (let i = 0; i < element.length; i++) {
      temp.push(element[i].weather[0].main);
    }
    if (temp.length === 0)
      return null;
    let modeMap = {};
    let maxEl = temp[0]
    let maxCount = 1;
    for (let i = 0; i < temp.length; i++) {
      const el = temp[i];
      if (modeMap[el] == null) {
        modeMap[el] = 1;
      }
      else {
        modeMap[el]++;
      }
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  getInfoToday(element, type) {
    let temp = 0;
    for (let i = 0; i < element.length; i++) {
      if (type === 'temp') {
        temp += element[i].main.temp;
      } else if (type === 'wind') {
        temp += element[i].wind.speed;
      } else if (type === 'cloud') {
        temp += element[i].clouds.all;
      }
    }
    temp = temp / element.length;
    return this.precisionRound(temp, 0);
  }

  getImage(weather) {
    for (let i = 0; i < associativeTable.length ; i++) {
      if (weather === associativeTable[i].key) {
        return associativeTable[i].img;
      }
    }
  }

  render () {
    // For a better User Experience I will add more informations with different type of display
    // Probably a simple display and a link 'see more' for details
    let temp = 0;
    let wind = 0;
    let cloud = 0;
    let weather = 0;
    let image = '';
    let i = -1;
    let date;
    return (
      <div className="App">
        {this.state.datas &&
          <div className="principalContainer">
            <div className="header">
              <img src={logo} className="App-logo" alt="logo" />
              <p className="generalTitle"><span>Weather in</span></p>
              <h1 className="generalTitle">{this.state.datas.city.name.split('-')[0].replace(/\s/g, '') + ', ' + this.state.datas.city.country}</h1>
            </div>
              {this.state.arrayDates &&
                <div ref="appendChild" className="dataContainers">
                  {this.state.arrayDates.map((element) => {
                    temp = this.getInfoToday(element, 'temp');
                    wind = this.getInfoToday(element, 'wind');
                    cloud = this.getInfoToday(element, 'cloud');
                    weather = this.getTheMostUsed(element);
                    image = this.getImage(weather);
                    i++;
                    date = new Date(element[i].dt_txt.replace(/-/g, "/"));
                    return (
                      <div key={i} className="cards">
                        <div>
                          <h3 className="titleCards">{date.toDateString()}</h3>
                          <img alt={weather} src={image} className="imageWeather"/>
                          <p>Weather: {weather}</p>
                          <p>Temp: {temp} °C</p>
                          <p>Wind: {wind} Km/h</p>
                          <p>Cloud: {cloud} %</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
          </div>}
          <div className="footer">
            <p className="footerName">Made by <a href="https://www.linkedin.com/in/eddylardet/?locale=en_US" className="footerName">Eddy Lardet</a></p>
          </div>
      </div>
    );
  }
}
export default App;
