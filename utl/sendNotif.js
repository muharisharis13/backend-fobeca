const fetch = require('node-fetch')

exports.SendNotif = async ({ body }) => {
  const data = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: "key=AAAAh3TPGS0:APA91bFf3gnYvQxWLVmlMWogW4dFfD1ViGFTArlPe4KJqPLLW3EJJcil1Ls_zrhHyxn4iIGQ6xaKfnmeRw7wsCitLni5YUn1p19LyICSV5hl2NhXl_SRa_jBvssy0-f_ZERHgFHd7gTN",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
  return data
}