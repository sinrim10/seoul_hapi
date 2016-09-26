
/**
 * Expose
 */
module.exports = {
  /*db : "mongodb://10.32.15.160:27017/serverbikee",*/
  db :process.env.MONGODB_URI || process.env.MONGOLAB_URI || "mongodb://olleego1.iptime.org:27017/seoul",
  sms: {
    url: 'http://sslsms.cafe24.com/sms_sender.php',
    userId: 'sinrim10',
    secure: '4b0657987498d872cc5019527dac3716',
    source: {
      phone1: '010',
      phone2: '2716',
      phone3: '6591'
    }
  },
  iamport:{
    imp_uid : "imp08524641",
    imp_key : "6613680291968500",
    imp_secret :"3WQTqgl5XstygtMaCHMsgPvkF4B4L1fOX6Iom4tjwWSNqFY3mKwDz1Xf6zkRBzGzGpX2urm1nfOOUNRh"
  },
  pass:{
    start : 3,
    end : 50,
    enc : 2
  },
  gcm:{
    sender:"AIzaSyCjS6GYoUP0OPIBcoSljKWZvpJM8kkCx_4"
  },
  facebook:{
    clientID:"191282517962779",
    clientSecret:"9f4e92c06e5fff8b7971ab018c75e51c"
  },
  nodemailer:{
    service:"Gmail",
    id:"bikeeserver",
    pass:"@dltjdrb1"
  }
};
