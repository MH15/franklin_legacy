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

	var TITLE = document.querySelector("title").innerHTML
function CoolBeans() {
	var allItems = document.querySelectorAll("div.item")
	AddEditBtns()
	DeleteBtns()
}


CoolBeans()

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
	ID() {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	}
}

var lib = new Lib()

// make buttons for things
function AddEditBtns() {
	var newSectionTools = document.querySelector("div#newSectionTools")
	newSectionTools.style.display = "block"
	var submitBtn = document.querySelector("button#submitButton")
	var zoneText = document.querySelector("input[name='zoneName']")
	submitBtn.addEventListener ("click", function(d) {
		PostSection(zoneText.value)
	})

	var allSections = document.querySelectorAll('div.section .editable')
	var save = document.querySelector('[title="Save"]')
	var editor = document.querySelector('section#editor')
	var editView = document.querySelector("div#editView")
	var title = document.querySelector("title").innerHTML
	editor.postTitle = editor.querySelector("input#title")
	editor.content = editor.querySelector("div#post")
	// VERY IMPORTANT
	var currentSection = null

	allSections.forEach(section => {
		section.postTitle = section.querySelector("h2.title")
		section.content = section.querySelector("div.content")
		section.addEventListener('click', () => {
			editView.style.display = "flex"
			editor.postTitle.value = section.postTitle.innerHTML
			editor.content.innerHTML = section.content.innerHTML
			currentSection = section
		})
	})

	save.addEventListener('click', async () => {
		var newContent = await SaveSection(title, editor, currentSection)
		currentSection.postTitle.innerHTML = newContent.postTitle.value
		currentSection.content.innerHTML = newContent.content.innerHTML
		editView.style.display = "none"
	})

}

function SaveSection(title, editor, section) {
	return new Promise((resolve, reject) => {
		var save = document.querySelector('[title="Save"]')
		var ToSend = {
			url: window.location.pathname,
			section: editor.postTitle.value,
			oldSection: section.postTitle.innerHTML,
			content: editor.content.innerHTML
		}
		var request = new Request('/updateitem', {
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
			// update page content once
			// DB call is complete
			resolve(editor)
		})
		.catch(function(err) {  
			console.log('Fetch Error :-S', err)
		})
	})
}

function DeleteBtns() {
	var sections = document.querySelectorAll("div.section")
	sections.forEach(item => {
		// DOM
		var deleter = CreateButton('❌')
		deleter.classList.add("deleter")
		deleter.appendBefore(item.firstChild)

		deleter.addEventListener("click", () => {
			var sectionTitle = deleter.parentElement.querySelector(".title").innerHTML
			var ToSend = {
				url: window.location.pathname,
				section: sectionTitle,
				timeStamp: new Date().getTime(),
				user: "Steve 2"
			}

			var request = new Request('/deletesection', {
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

function PostSection(sectionName) {
	var title = document.querySelector("title").innerHTML
	var dataToSend = {
		url: window.location.pathname,
		section: sectionName,
		timeStamp: new Date().getTime(),
		user: "Steve"

	}

	var request = new Request('/postsection', {
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