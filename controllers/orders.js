const Orders = require("../models/orders")
const Goods = require("../models/goods")
const ordersRouter = require("express").Router();


ordersRouter.get("/", async (request, response) => {
  const goods = await Orders.find({});
  response.json(goods.map((u) => u.toJSON()));
});

async function decriaseAmountOfGoods(arr) {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i]
    const [id, amountOfGoods] = el
    const goods = await Goods.findById(id)
    await Goods.findByIdAndUpdate(id, { amountOfGoods: goods.amountOfGoods - amountOfGoods })
  }
}

ordersRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const goodsFromOrders = body.order.map(el => [el.id, el.amountOfGoods])

  const newItem = new Orders({
    order: body.order,
    country: body.country,
    firstName: body.firstName,
    secondName: body.secondName,
    address: body.address,
    city: body.city,
    state: body.state,
    zip: body.zip,
    phone: body.phone,
    imagePath: body.imagePath,
    date: new Date(),
  });
  try {
    const savedNewItem = await newItem.save();
    decriaseAmountOfGoods(goodsFromOrders)
    response.json(savedNewItem.toJSON());
  } catch (exception) {
    next(exception);
  }
}
);

module.exports = ordersRouter;

