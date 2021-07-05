// function getNextSequenceValue(sequenceName) {
//   var sequenceDocument = db.counters.findAndModify({
//     query: { _id: sequenceName },
//     update: { $inc: { sequence_value: 1 } },
//     new: true
//   });
//   return sequenceDocument.sequence_value;
// }


function getNextSequenceValue1(db, name, callback) {
  db.collection("counters").findAndModify({ _id: name }, null, { $inc: { seq: 1 } }, function (err, result) {
    if (err) callback(err, result);
    callback(err, result.value.seq);
  })
}

