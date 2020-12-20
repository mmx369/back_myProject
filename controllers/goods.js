const Goods = require("../models/goods")
const goodsRouter = require("express").Router();

goodsRouter.get("/", async (request, response) => {
  const goods = await Goods.find({});
  response.json(goods.map((u) => u.toJSON()));
});

goodsRouter.get("/:id", (request, response, next) => {
  Goods.findById(request.params.id)
    .then((el) => {
      response.json(el.toJSON());
    })
    .catch((error) => next(error));
});

goodsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  console.log(3333, body);

  const newItem = new Goods({
    nameOfGoods: body.nameOfGoods,
    amountOfGoods: body.amountOfGoods,
    priceOfGoods: body.priceOfGoods,
    imagePath: `${body.imagePath}.jpg`,
  });
  try {
    const savedNewItem = await newItem.save();
    response.json(savedNewItem.toJSON());
  } catch (exception) {
    next(exception);
  }
}
);

module.exports = goodsRouter;



