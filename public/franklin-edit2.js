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
		var newItemContainer = zone.querySelector("div#newItemContainer")
		newItemContainer.style.display = "block"
		var newBtn = zone.querySelector("button.newBtn")
		var text = zone.querySelector("input[name='itemText']")
		var zoneTitle = zone.querySelector("h2.zoneTitle").innerHTML
		newBtn.addEventListener("click", function() {
			PostNewItem(zoneTitle, text.value)
		})
		// newButton.onclick = () => console.log(zoneTitle);
	})
}

function DeleteBtns() {
	var allItems = document.querySelectorAll("div.item")
	allItems.forEach(item => {
		// DOM
		var deleter = CreateButton('❌')
		deleter.classList.add("deleter")
		var span1 = item.querySelector('span')
		var span2 = document.createElement('span')
		span2.appendChild(deleter)
		span2.appendBefore(span1)
		// meta
		var meta = {
			pageTitle: document.querySelector("title").innerHTML,
			section: item.parentElement.querySelector(".zoneTitle").innerHTML,
			matter: span1.innerHTML
		}
		deleter.addEventListener("click", () => {
			var dataToSend = {
				pageTitle: meta.pageTitle,
				section: meta.section,
				matter: meta.matter,
				timeStamp: new Date().getTime(),
				user: "Steve 2"
			}
			console.log(dataToSend);

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

function PostNewItem(zoneName, text) {
	// trigger.addEventListener('click', () => {
		var title = document.querySelector("title").innerHTML
		var dataToSend = {
			pageName: title,
			zoneName: zoneName,
			text: text,
			timeStamp: new Date().getTime(),
			user: "Steve"

		}

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
	// })

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