const mongoose = require("mongoose")
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 50},
  text: { type: String, required: true, maxLength: 300},
  date_created: { type: Date, default: Date.now},
  user:  { type: Schema.Types.ObjectId, ref: "User", required: true}
})

MessageSchema.virtual("date_created_formatted").get(function() {
  return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATE_MED)
})

module.exports = mongoose.model("Message", MessageSchema)