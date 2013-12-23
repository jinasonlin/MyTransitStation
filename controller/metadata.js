exports.list = function(req, res) {
  if (global.client && global.client.userId) {
    client.describe(function(err, response, request) {
      //console.log(response.result);
      res.render('metadata/list', response.result);
    });
  } else {
    res.redirect('/');
  }
};