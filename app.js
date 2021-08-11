const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const app = express()

mongoose.connect(keys.mongoURI)
  .then( () => {console.log('MongoDB connected x')})
  .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)


app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

if(process.env.NODE_ENV === 'production'){
  app.use(exress.static('client/dist/client'))

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname, 'client', 'dist', 'client', 'index.html'
      )
    )
  })
}

module.exports = app