const request = require('request')

const forecast = ({latitude, longitude}, callback) => {
  const url = 'https://api.darksky.net/forecast/fc645c9f6c804883a735641125e9ec2c/'+ latitude +',' + longitude + '?lang=ru&units=si'

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to ceonnect tot location services!', undefined)
    } else if (response.body.currently === undefined) {
      callback('Unable to find location. Try another search', undefined)
    } else {
      callback(undefined, {
        currently: response.body.currently
      })
    }
  })
}

module.exports = forecast