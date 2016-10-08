
/**
 * Expose
 */
module.exports = {
  db :process.env.MONGODB_URI || process.env.MONGOLAB_URI || "",
  pass:{
    start : 3,
    end : 50,
    enc : 2
  },
  facebook:{
  },
  s3:{ }
};
