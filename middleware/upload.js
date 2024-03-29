const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, 'uploads/')
  },
  filename(req, file, cb){
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    cb(null, `${date}_${file.originalname}`)
  }
})

const fileFilter = (res, file, cb) => {
  if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
    cb(null, true)
  }
  else{
    cb(null, false)
  }
}

const limits = {
  filesize: 1024*1024*5
}

module.exports = multer({
  storage,
  fileFilter,
  limits
})