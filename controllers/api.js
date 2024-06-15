const api = async (req, res, db, bcrypt) => {
    const { email, password, voiceId, text } = req.body;
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "xi-api-key": "your api key"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v1",
          "voice_settings": {
              "stability": 0.5,
              "similarity_boost": 0.8,
              "style": 0.0,
              "use_speaker_boost": true
          }
        })
      };

    try {
        const data = await db.select("*").from('login').where('email', '=', email);

        if (data.length && bcrypt.compareSync(password, data[0].hash)) {
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, options);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                res.setHeader('Content-Type', response.headers.get('content-type'));
                res.send(buffer);
            } catch (error) {
                res.status(500).send(error.message);
            }
        } else {
            res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        res.status(400).json('Error getting user');
    }
}

module.exports = {
    handleApi: api
}