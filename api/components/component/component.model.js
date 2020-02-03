const mongoose = require('mongoose')

const Schema = mongoose.Schema

const componentSchema = new Schema(
  {
    message: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const Component = mongoose.model('Component', componentSchema)

module.exports = Component
