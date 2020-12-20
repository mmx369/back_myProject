const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const ordersSchema = new mongoose.Schema({
  order: [{ id: String, date: Date, nameOfGoods: String, amountOfGoods: Number, priceOfGoods: Number, imagePath: String }],
  country: { type: String, required: [true, 'Why no country?'] },
  firstName: { type: String, required: [true, 'We need your name'] },
  secondName: { type: String, required: [true, 'We need your name'] },
  address: { type: String, required: [true, 'We need your address'] },
  city: { type: String, required: [true, 'We need your city'] },
  state: String,
  zip: { type: String, required: [true, 'We need your zip code'] },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  date: Date,
});

ordersSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = Orders;