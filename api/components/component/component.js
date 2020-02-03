const router = require('express').Router()
let Component = require('./component.model')
const checkJwt = require('../../middleware/checkJwt')

router.route('/').get((req, res) => {
  Component.find()
    .then(events => res.status(200).json(events))
    .catch(err => res.status(400).json({ error: err }))
})

//Get an event by ID
//public
router.route('/:id').get(function (req, res, next) {
  Component.findById(req.params.id)
    .then(event => res.status(200).json(event))
    .catch(err => res.status(400).json({ error: err }))
})
//Create an event
//Requires level 1 privileges
router.route('/').post(checkJwt, function (req, res, next) {
  const message = req.body.message

  const newComponent = new Component({
    message
  })

  newComponent
    .save()
    .then(event => res.status(201).json(event))
    .catch(err => res.status(400).json({ err }))
})

router.route('/:id').put(checkJwt, function (req, res, next) {
  Event.findById(req.params.id)
    .then(component => {
      component.message = req.body.message

      component
        .save()
        .then(component => res.status(200).json(component))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(400).json({ err }))
})
//Delete an event by ID
//Requires level 1 privileges
router.route('/:id').delete(checkJwt, function (req, res, next) {
  Component.findByIdAndDelete(req.params.id)
    .then(component => res.status(200).json(component))
    .catch(err => res.status(400).json({ err }))
})

module.exports = router
