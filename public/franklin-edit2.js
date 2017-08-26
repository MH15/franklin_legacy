// client side code for Franklin *Editor*
// as little functionality as possible 
// should be implemented here
// v2 code

// this module is only sent to the client when logged in fyi

Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
},false;


Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
},false;

function CoolBeans() {
	AddEditBtns()
	DeleteBtns()
}


CoolBeans()

// make buttons for things
function AddEditBtns() {
	lastZone = document.querySelector("div.wrapper").lastChild

	var newZoneContainer = document.querySelector("div#newZoneContainer")
	newZoneContainer.style.display = "block"
	var submitBtn = document.querySelector("button#submitButton")
	var zoneText = document.querySelector("input[name='zoneName']")
	submitBtn.addEventListener ("click", function(d) {
		PostNewZone(zoneText.value)
	})


	var allZones = document.querySelectorAll('div.zone')
	allZones.forEach(zone => {
		// Add a plus button at the bottom of each zone so the user
		// can add new items. Should popup a box  soon that allows
		// admin to enter text, images, maps, forms, etc.
		var form = zone.querySelector("form.itemAdder")

		var newItemContainer = zone.querySelector("div#newItemContainer")
		newItemContainer.style.display = "block"
		var newBtn = zone.querySelector("button.newBtn")
		var text = zone.querySelector("input[name='itemText']")
		var image = zone.querySelector("input[name='imageSrc']")
		var zoneTitle = zone.querySelector("h2.zoneTitle").innerHTML

		text.style.display = "none"
		image.style.display = "block"



		var select = form.querySelector("span select")
		select.addEventListener('change', () => {
			var current = select.options[select.selectedIndex].value;
			switch (current) {
				case "text":
					text.style.display = "block"
					image.style.display = "none"
					break;
				case "image":
					text.style.display = "none"
					image.style.display = "block"
					break;
				case "markdown":
					text.style.display = "block"
					image.style.display = "none"
					break;
				case "html":
					text.style.display = "block"
					image.style.display = "none"
					break;
			}
		})

		form.addEventListener("submit", (event) => {
			event.preventDefault()
			var imageFile = image.files[0];
			// var matter = form.querySelector("span input[name='itemText").value; // first field in form
			// 	if (matter == "") {
			// 	return false;
			// }
			var contentType = form.querySelector("span select").selectedIndex; // second field
			if (contentType < 0) { // your first option does not have a value 
				return false;
			}
			PostNewItem(zoneTitle, {text: text.value, image: imageFile}, select.options[select.selectedIndex].value, form)
		})
	})
}
class Lib {
	test(image) {
		return new Promise((resolve, reject) => {
			var file = image;

			if (file) {
				var reader = new FileReader();
				reader.addEventListener("load", function () {
					resolve(reader.result)
				}, false);

				reader.readAsDataURL(file);
			}
		})
		console.log("message");
	}
}

var lib = new Lib()

async function PostNewItem(zoneName, matter, select, form) {

	var title = document.querySelector("title").innerHTML
	var mid = {};
	switch (select) {
		case "text":
			mid.title = matter.text
			mid.data = matter.text
			break;
		case "image":
			mid.title = matter.image.name
			mid.data = await lib.test(matter.image)

			break;
		case "markdown":
			mid = matter.text
			break;
		case "html":
			mid = matter.text
			break;
	}

	var dataToSend = {
		pageName: title,
		zoneName: zoneName,
		matter: {
			data: mid.data,
			name: mid.title,
			type: select
		},
		timeStamp: new Date().getTime(),
		user: "Steve"

	}
	console.log(dataToSend);
	var request = new Request('/registeritem', {
		method: 'POST',
		body: JSON.stringify(dataToSend),
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'application/JSON'
		})
	})

	// Now use it!

	fetch(request)
	.then(function(response) {
		return response.text();
	}).then(function(text) { 
		// when zone confirmation is recieved refresh
		// the page to update the user interface
		location.reload(true)
	})
	.catch(function(err) {  
		console.log('Fetch Error :-S', err)
	})

}

function DeleteBtns() {
	var allItems = document.querySelectorAll("div.item")
	allItems.forEach(item => {
		// DOM
		var deleter = CreateButton('❌')
		deleter.classList.add("deleter")
		// var span = item.querySelector('span.data')
		// var span2 = document.createElement('div')
		// span2.appendChild(deleter)
		deleter.appendBefore(item.firstChild)
		
		// var name = ""
		// switch (item.firstChild.nodeName) {
		// 	case "text":
		// 		name = ""
		// 		break;
		// 	case "image":
		// 		mid.title = matter.image.text
		// 		mid.data = await lib.test(matter.image)

		// 		break;
		// 	case "markdown":
		// 		mid = matter.text
		// 		break;
		// 	case "html":
		// 		mid = matter.text
		// 		break;
		// }

		deleter.addEventListener("click", () => {
			var type = ""
			var name = ""
			var data = ""
			if (item.lastElementChild.tagName.toLowerCase() == "img") {
				type = "image"
				name = (item.querySelector("img").src).split("/images/").pop()
				data = "hahaha nope"
			} else {
				type = "text"
				name = item.lastElementChild.innerHTML
				data = "hahaha nope"
			}
			var dataToSend = {
				pageTitle: document.querySelector("title").innerHTML,
				section: item.parentElement.querySelector(".zoneTitle").innerHTML,
				matter: {
					type: type,
					name: name,
					data: data
				},
				timeStamp: new Date().getTime(),
				user: "Steve 2"
			}
			console.log(dataToSend.matter);

			var request = new Request('/deleteitem', {
				method: 'POST',
				body: JSON.stringify(dataToSend),
				mode: 'cors', 
				redirect: 'follow',
				headers: new Headers({
					'Content-Type': 'application/JSON'
				})
			})

			// Now use it!
			fetch(request)
			.then(function(response) {
				return response.text();
			}).then(function(text) { 
				// when zone confirmation is recieved refresh
				// the page to update the user interface
				location.reload(true)
			})
			.catch(function(err) {  
				console.log('Fetch Error :-S', err)
			})
		})
	})
}


function PostNewZone(zoneName) {
	var title = document.querySelector("title").innerHTML
	var dataToSend = {
		pageName: title,
		zoneName: zoneName,
		timeStamp: new Date().getTime(),
		user: "Steve"

	}

	var request = new Request('/registerzone', {
		method: 'POST',
		body: JSON.stringify(dataToSend),
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'application/JSON'
		})
	})

	// Now use it!
	fetch(request)
	.then(function(response) {
		return response.text();
	}).then(function(text) { 
		// when zone confirmation is recieved refresh
		// the page to update the user interface
		location.reload(true)
	})
	.catch(function(err) {  
		console.log('Fetch Error :-S', err)
	})
}