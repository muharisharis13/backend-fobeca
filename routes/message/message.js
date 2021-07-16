const express = require('express')
const router = express.Router()
const messageModels = require('../../models/messageModels')


router.post('/', async function (req, res) {
  const { image } = req.files
  const { title, content } = req.body
  try {
    if (req.files) {
      await image.mv(`./uploads/message/${image.name}`);

      const post = new messageModels({
        image: image.name,
        title: title,
        content: content,
        status: true
      })

      const save = await post.save()

      res.json({
        message: 'success add message',
        data: save
      })

    } else {
      res.json({
        message: 'There are no files'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})


module.exports = router