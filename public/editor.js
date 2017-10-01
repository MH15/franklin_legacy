var functions = document.querySelectorAll('div.function')
var allHiddens = document.querySelectorAll('.hidden')


class Tools {
	async SaveImageToDisk(imageURI, name) {
		return new Promise((resolve) => {
			var ToSend = {
				matter: {
					data: imageURI,
					name: name
				},
				timeStamp: new Date().getTime(),
				user: "Steve"
			}
			var request = new Request('/saveimagetodisk', {
				method: 'POST',
				body: JSON.stringify(ToSend),
				mode: 'cors', 
				redirect: 'follow',
				headers: new Headers({
					'Content-Type': 'application/JSON'
				})
			})

			fetch(request)
			.then(function(response) {
				return response.text();
			}).then(function(text) { 
				// remove latch once image is on disk
				resolve(text)
			})
			.catch(function(err) {  
				console.log('Fetch Error :-S', err)
			}) 


		})
	}

	AddImage() {
		return new Promise((resolve) => {
			var input = document.createElement('input')
			input.setAttribute('type', 'file')
			var image = input.files[0]
			input.addEventListener('change', () => {
				var reader = new FileReader();
				reader.addEventListener('loadend', () =>{
					// send this back to frontend then save to server
					resolve({
						URI: reader.result,
						name: input.files[0].name
					})
				});
				reader.readAsDataURL(input.files[0]);
			})
			// get triggered
			input.click()

		})
	}

	FontSize() {
		return new Promise((resolve) => {
			var select = document.querySelector("select[title='Font Size']")
			select.addEventListener('change', () => {
				var current = select.options[select.selectedIndex].value;
				// console.log(select.options);
				resolve(current)
			})

		})
	}
}



var toolData = [
	// Format
	{	call: "bold", DOM: "[title='Bold']"	},
	{	call: "italic", DOM: "[title='Italic']"	},
	{	call: "underline", DOM: "[title='Underline']"	},
	{	call: "fontSize", DOM: "select[title='Font Size']", first: true	},
	// Lists
	{	call: "insertUnorderedList", DOM: "[title='Bullet List']"	},
	{	call: "insertOrderedList", DOM: "[title='Numbered List']"	},
	// Alignment
	{	call: "justifyLeft", DOM: "[title='Align Left']"	},
	{	call: "justifyCenter", DOM: "[title='Align Center']"	},
	{	call: "justifyRight", DOM: "[title='Align Right']"	},
	// Add-in area
	{	call: "insertImage", DOM: "[title='Photo']", first: true	},
	{	call: "createLink", DOM: "[title='Link']"	},
	{	call: "bold", DOM: "[title='Map']"	},

	// Window Functions
	{	call: "undo", DOM: "[title='Undo']"	},
	{	call: "redo", DOM: "[title='Redo']"	},
	{	call: "bold", DOM: "[title='Map']"	}
]

function runAll() {
	ToolbarGUI()
	EditDocument()
}

var tools = new Tools()



function EditDocument() {
	// var tools = new Tools()
	toolData.forEach(tool => {
		button = document.querySelector(tool.DOM)
		if (tool.call != "fontSize") button.setAttribute('onmousedown', 'event.preventDefault();')
		button.addEventListener('click', async () => {
			// if tool needs to get info e.g. image or link source
			if (tool.first) {
				switch (tool.call) {
					case "insertImage":
						var Source = await tools.AddImage()
						// save to disk & return Image Source
						var FinalURI = await tools.SaveImageToDisk(Source.URI, Source.name)
						// add to editor
						document.execCommand(tool.call, false, FinalURI)
						document.execCommand('enableObjectResizing', false, true)
						break;
					case "fontSize":
						var FontSize = await tools.FontSize()
						document.execCommand(tool.call, false, FontSize)
						break;
					default:
						break;
				}
			} else {
				// default behavior
				document.execCommand(tool.call)
			}
			if (tool.last) {

			}
		})
		
	})

}


function ToolbarGUI() {
	functions.forEach(el => {
		var expand = el.querySelector('i.more')
		var show = el.querySelector('i.show')
		expand.setAttribute('onmousedown', 'event.preventDefault();')
		show.setAttribute('onmousedown', 'event.preventDefault();')
		el.canExpand = true
		expand.addEventListener('click', () => {
			change(el, expand, show)
		})
		show.addEventListener('click', () => {
			change(el, expand, show)
		})


	})


	function change(el, expand, show) {
		var hiddens = el.querySelectorAll('.hidden')
		var show = el.querySelector('i.show')
		if (el.canExpand) {
			el.canExpand = false
			expand.innerHTML = "&#xE314;"
			hiddens.forEach(it => {
				it.style.display = "block"
			})
			show.style.transform = "scale(0.85)"
			show.style.color = "gray"

			expand.style.color = "gray"
			expand.style.transform = "scale(0.85)"
		} else {
			el.canExpand = true
			expand.innerHTML = "&#xE315;"
			hiddens.forEach(it => {
					it.style.display = "none"
			})
			show.style.color = "#000"
			show.style.transform = "scale(1.0)"

			expand.style.color = "#000"
			expand.style.transform = "scale(1.0)"
		}
	}
}


runAll()


