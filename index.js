const fetch = require('node-fetch');
const mpg = require('mpg123');
const player = new mpg.MpgPlayer();
const schedule = require('node-schedule');

async function fetchData() {
    let data = await fetch('https://saweather.market.alicloudapi.com/spot-to-weather?area=' + encodeURI('杭州'), {
        headers: {
            Authorization: 'APPCODE 2f9f40a5adc043c1beb4900fa5fd7f17'
        }
    }).then(res => res.json());
    return data.showapi_res_body;
}

function buildText(data) {
    let {f1, now} = data;
    let time = new Date();
    return `早上好！今天${time.getMonth() + 1}月${time.Date()}日, 星期${f1.weekday}, ${f1.day_weather}, ${f1.day_weather}, ${f1.day_weather}, 气温${f1.night_air_temperature}到${f1.day_air_temperature}度,${f1.night_air_temperature}到${f1.day_air_temperature}度, ${f1.night_air_temperature}到${f1.day_air_temperature}度,${f1.night_air_temperature}到${f1.day_air_temperature}度, 空气质量${now.aqiDetail.pm2_5}, ${now.aqiDetail.quality}`;
}

async function text2Mp3Url(text) {
    let tokenData = await fetch('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=74AIOZOQAo9WNKB3kEedD6Bi&client_secret=sYzxaGMsPirdFCEwNGvVHo5Bax9GeVhH').then(res => res.json());
    let url = 'http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=9476350&tok=' + tokenData.access_token + '&tex=' + text;
    return url;
}

async function start() {
    let data = await fetchData();
    let weatherText = buildText(data);
    console.log(weatherText);
    let mp3Url = await text2Mp3Url(weatherText);
    player.play(mp3Url);
}

schedule.scheduleJob('23 21 * * *', () => {
    start();
});
