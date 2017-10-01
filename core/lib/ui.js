// ui processes
// ============
// renderers and other ui libs

class UI {
	Render(res, meta, data, template) {
		res.render(`admin/${template}.ejs`, {
			meta: meta,
			data: data
		})
	}

}


module.exports = new UI()