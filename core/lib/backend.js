// backend processes
// ================
// db and express lib
var fs = require('fs')

class Backend {
	SaveImage(imageData, filename) {
		return new Promise((resolve, reject) => {
			var img = imageData

			// Grab the extension to resolve any image error
			var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
			// strip off the data: url prefix to get just the base64-encoded bytes
			var data = img.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(img, 'base64')
			var src = `images/${filename}`
			
			fs.writeFile(`~data/${src}`, data, {encoding: 'base64'}, (err) => {
				if(err) {
					reject(err)
				} else {
					resolve(src)
				}
			});
		})
	}

	SaveImageToDisk(imageData, filename) {
		return new Promise((resolve, reject) => {
			var img = imageData

			// Grab the extension to resolve any image error
			var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
			// strip off the data: url prefix to get just the base64-encoded bytes
			var data = img.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(img, 'base64')
			var src = `images/${filename}`
			
			fs.writeFile(`~data/${src}`, data, {encoding: 'base64'}, (err) => {
				if(err) {
					reject(err)
				} else {
					resolve(src)
				}
			});
		})
	}

	AddItem(req, pageDB, pageQuery, matter, imageURL) {
		var insert = {}
		switch (matter.type) {
			case "text":
				insert.type = matter.type
				insert.data = matter.data
				insert.name = matter.name  // using ID() generator base 36 code 
				break;
			case "image":
				insert.type = matter.type
				insert.data = imageURL
				insert.name = matter.name  // for now this way, later will be different
				break;
			case "markdown":
				// postMatter = matter.text
				break;
			case "html":
				// postMatter = matter.text
				break;
		}
		return new Promise((resolve, reject) => {
			var register = pageQuery
			if (pageQuery.pageData.length > 0) { // here if zones already exist
				var lengthA = register.pageData.length
				// find location of zone + content in a pageData instance
				var index = pageQuery.pageData.findIndex(el => {
					if (el.title === req.body.zoneName) return true;
				})
					console.log("addddd")
				if (register.pageData[index].content) { // if zone already has content
					var zoneLength = register.pageData[index].content.length
					register.pageData[index].content[zoneLength] = insert
					pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
						if(err) reject(err)
						resolve()
					})
				} else { // if zone is empty
					register.pageData[index].content = [] // init empty array
					register.pageData[index].content[0] = insert
					pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
						if(err) reject(err)
						resolve()
					})
				}		
			}
		})
	}

	EditItem(pageDB, req) {
		return new Promise((resolve, reject) => {
			pageDB.findOne({url: req.body.url}, (err, result) => {
				var sectionIndex = result.pageData.findIndex(el => {
					if (el.title === req.body.oldSection) return true;
				})
				console.log(sectionIndex);
				var register = result;
				// update content
				register.pageData[sectionIndex].content = req.body.content
				// optional: update title
				register.pageData[sectionIndex].title = req.body.section
				pageDB.update({url: req.body.url}, register, function(err, result) {
					if(err) reject(err)
					resolve()
				})
			})
		})
	}

	DeletePage(pageDB, title) {
		return new Promise((resolve, reject) => {
			console.log(title);
			pageDB.remove({pageName: title}, function(err, result) {
				if(err) reject(err)
				resolve()
			})
		})
	}

}


module.exports = new Backend()