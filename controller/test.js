var changeSetService = require('../service/changesetservice'),
	s3service = require('../service/s3service');


exports.testArchive = function(req,res){
	changeSetService.doArchiveAction('52cbb62f338f19b810000001','52ce72649f7d00001e000002','52cb72fca3513a0e51c623e3');
};

exports.testS3 = function(req,res){
	s3service.uplaodData('52cb72fca3513a0e51c623e3_52ce72649f7d00001e000002.zip');
}