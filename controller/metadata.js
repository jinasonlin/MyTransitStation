exports.list = function(req, res) {
  global.client.describe(function(err, response, request) {
    //console.log(response.result);
    res.render('metadata/list', response.result);
  });
};