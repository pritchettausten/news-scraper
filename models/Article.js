var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  sum: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("article", articleSchema);

module.exports = Article;