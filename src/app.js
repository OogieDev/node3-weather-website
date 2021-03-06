const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Title from app'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You should provide address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }

        forecast({latitude, longitude}, (error, data) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: `На данный момент: ${data.currently.summary}.Температура ${data.currently.temperature}. Вероятность дождя ${data.currently.precipProbability}%`,
                location: location,
                address: req.query.address
            })
        });

    })
})

app.get('*', (req, res) => {
    res.render('404')
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})