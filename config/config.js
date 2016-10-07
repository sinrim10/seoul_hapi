
/**
 * Expose
 */
module.exports = {
  /*db : "mongodb://10.32.15.160:27017/serverbikee",*/
  db :process.env.MONGODB_URI || process.env.MONGOLAB_URI || "mongodb://olleego1.iptime.org:27017/seoul",
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
  s3:{   region : 'ap-northeast-2',
    accessKeyId : 'AKIAJT7BOR7VPCRRVX4Q',
    secretAccessKey : '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'
  }
};
