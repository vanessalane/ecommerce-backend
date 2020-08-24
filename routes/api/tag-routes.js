const router = require('express').Router();
const sequelize = require('sequelize');
const { Tag, Product, ProductTag } = require('../../models');
const { JSON } = require('sequelize');

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
      productIds: [1, 2, 3, 4]
    }
  */
  Tag.create(req.body)
  .then((tag) => {
    // if there are product ids in the body, need to update ProductTag
    if (req.body.productIds) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
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

// update tag
router.put('/:id', (req, res) => {
  // update product data
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    // find all associated tags from ProductTag
    return ProductTag.findAll({ where: { tag_id: req.params.id } });
  })
  .then((productTags) => {
    let productTagsToRemove = [];
    let newProductTags = [];

    // define the productTagsToRemove and newProductTags if there were tags provided
    if (req.body.productIds) {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new tag_ids
      newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);
      }

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one tag by its `id` value
  Tag.destroy({
    where: {id: req.params.id}
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id'});
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
