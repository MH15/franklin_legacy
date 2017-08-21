// client side code for Franklin *Editor*
// as much functionality as possible 
// should be implemented here
str = Window.FRANKLIN.STRINGS
lock = Window.FRANKLIN.SECURITY
func = Window.FRANKLIN.FUNCTIONS


var EditableZones = document.querySelectorAll(`[franklin-state="${str.FranklinZone}"]`)
var FranklinElements = document.querySelectorAll(`[franklin-state="${str.CONTENT_EDITABLE}"]`)
var ZoneInformation = {

}


// add edit buttons if logged in
if (lock.SECURED == true) {
	RunEditor()
}

function RunEditor() {
	FindEditableContent()
	// SetupEditor()
}

function FindEditableContent() {
	EditableZones.forEach(zone => {
		// in each user-defined edit zone, number editable areas
		// increasing from 0. FranklinID's are unique to each zone
		// but not to the entire page. This way, we need both a
		// FranklinID and a zone-name to publish edited content
		zone.name = zone.getAttribute("zone-name")
		var currentShell = document.querySelector(`[zone-name="${(zone.name).toString()}"]`)
		zone.editableContent = []		
		var innerDoc = currentShell.querySelectorAll(`[franklin-state="${str.CONTENT_EDITABLE}"]`)

		for (var i = 0; i < innerDoc.length; i++) {
			innerDoc[i].setAttribute("franklin-id", i)
			innerDoc[i].setAttribute("d-id", i)
			innerDoc[i].addEventListener ("click", function(d) {
				BeginEditLoop(zone, this.getAttribute("franklin-id"))
			})
			zone.editableContent[i] = innerDoc[i]
		}

		// Add a plus button at the bottom of each zone so the user
		// can add new Franklin Items. Should popup box that allows
		// admin to enter text, etc.
		var newButton = CreateButton(str.newPostText)
		newButton.setAttribute("function", "newItem")
		zone.appendChild(newButton)
		newButton.addEventListener("click", function(d) {
			AddFranklinItem(zone)
		}, {passive: true})

	})
}

function AddFranklinItem(parentZone) {
	var newButton = parentZone.querySelector(`[function="newItem"]`)
	var newTextBox = document.createElement("textarea")
	newTextBox.appendBefore(newButton)
	newButton.style.display = "none"
	var postButton = CreateButton(str.submitPostText)
	postButton.appendAfter(newTextBox)
	postButton.addEventListener ("click", function(d) {
		PostNewFranklinItem(parentZone, newTextBox.value)
		newButton.style.display = "block"
		postButton.style.display = "none"
		newTextBox.style.display = "none"
	}, {passive: true})

}

function PostNewFranklinItem(zone, text) {
	var dataToSend = {
		zone: zone.name,
		franklinID: (zone.editableContent.length).toString(),
		content: text,
		timeStamp: new Date().getTime(),
		user: "Steve"
	}

	var request = new Request('/additem', {
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
  	// <!DOCTYPE ....
  		console.log(text); 
  	})
	.catch(function(err) {  
		console.log('Fetch Error :-S', err)
	})

}



function BeginEditLoop(zone, franklinID) {
	// console.log(`zone: ${zone.name}, franklinID: ${franklinID}`)
	var editableUnit = zone.editableContent[franklinID]
	var editableUnitText = editableUnit.innerText
	// console.log(`button with franklin-id ${franklinID} of clicked`)
	// console.log(editableUnitText)

	var textEditor = document.createElement("textarea")
	textEditor.value = editableUnitText
	textEditor.style = editableUnit.style

	// console.log(AutoGrow(textEditor))
	var parentUnit = editableUnit.parentNode
	parentUnit.replaceChild(textEditor, editableUnit)
	AutoGrow(textEditor)
	textEditor.focus()

	// switch back to preview and sync content with server
	textEditor.addEventListener("focusout", function(d) {
		// apply changes locally
		var editedUnit = editableUnit
		editedUnit.innerText = textEditor.value
		parentUnit.replaceChild(editedUnit, textEditor)
		// sync with server
		SaveUserEdits(zone, franklinID)
	})
}

function SaveUserEdits(zone, franklinID) {
	var updatedContent = zone.editableContent[franklinID].innerText
	var dataToSend = {
		zone: zone.name,
		franklinID: franklinID,
		content: updatedContent,
		timeStamp: new Date().getTime(),
		user: "Steve"
	}
   // TODO: StartLoadingIndicatior()
	var request = new Request('/saveuseredits', {
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
  	// <!DOCTYPE ....
  		console.log(text); 
  	})
	.catch(function(err) {  
		console.log('Fetch Error :-S', err)
	})

}
