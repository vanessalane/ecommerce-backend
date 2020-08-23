const router = require('express').Router();
const sequelize = require('sequelize');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: [{
      model: Product,
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
      ],
      through: {attributes: []}
    }]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {id: req.params.id},
    include: [{
      model: Product,
      attributes: [
        'id',
        'product_name',
        'price',
        'stock'
      ],
      through: {attributes: []}
    }]
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id'});
      return;
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      tag_name: "blue"
      product_ids: [1, 2, 3, 4]
    }
  */
  Tag.create(req.body)
  .then((tag) => {
    // if there are product ids in the body, need to update ProductTag
    if (req.body.product_ids) {
      const productTagIdArr = req.body.product_ids.map((product_id) => {
        return {
          product_id,
          tag_id: tag.id
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(tag);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
