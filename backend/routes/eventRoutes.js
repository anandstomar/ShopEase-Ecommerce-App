const express = require('express');
const router = express.Router();
const { sendEvent } = require('../config/kafka'); 

router.post('/test-event', async (req, res) => {
  try {
    await sendEvent('test-topic', '1', req.body);
    res.status(200).json({ success: true, message: 'Event sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { ecommerceProducer } = require('../config/kafka');

router.post('/send', async (req, res) => {
  try {
    await ecommerceProducer.send({
      topic: 'your-topic',
      messages: [{ key: 'event-key', value: 'some-value' }]
    });
    res.send('Event sent');
  } catch (err) {
    console.error("Error sending event:", err);
    res.status(500).send("Kafka error");
  }
});

module.exports = router;
