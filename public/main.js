// client side code for Franklin
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
	console.log(EditableZones)
	FindEditableContent()
}


function FindEditableContent() {
	var transferElements
	// in each user-defined edit zone, number editable areas
	// increasing from 0. FranklinID's are unique to each zone
	// but not to the entire page. This way, we need both a
	// FranklinID and a zone-name to publish edited content
	for (var i = 0; i < EditableZones.length; i++) {
		// do this for each zone
		ZoneInformation[i] = EditableZones[i]
		ZoneInformation[i].info = {
			name: EditableZones[i].getAttribute("zone-name")
		}

		for (var i = 0; i < FranklinElements.length; i++) {
			FranklinElements[i].setAttribute("franklin-id", i)
			FranklinElements[i].addEventListener ("click", function(d) {
				BeginEditLoop(this.getAttribute("franklin-id"))
			})

		}
	}
	console.log(ZoneInformation[0].info)

	
}


// function FindEditableContent() {
// 	var transferElements
// 	// in each user-defined edit zone, number editable areas
// 	// increasing from 0. FranklinID's are unique to each zone
// 	// but not to the entire page. This way, we need both a
// 	// FranklinID and a zone-name to publish edited content
// 	for (var i = 0; i < EditableZones.length; i++) {
// 		// do this for each zone
// 		ZoneInformation[i] = EditableZones[i]
// 		ZoneInformation[i].info = {
// 			name: EditableZones[i].getAttribute("zone-name")
// 		}

// 	}
// 	console.log(ZoneInformation[0].info)

// 	for (var i = 0; i < FranklinElements.length; i++) {
// 		FranklinElements[i].setAttribute("franklin-id", i)
// 		FranklinElements[i].addEventListener ("click", function(d) {
// 			BeginEditLoop(this.getAttribute("franklin-id"))
// 		})

// 	}
// }

function BeginEditLoop(franklinID) {
	var editableUnit = FranklinElements[franklinID]
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
		SaveUserEdits(franklinID)
	})
}

function SaveUserEdits(franklinID) {
	var updatedContent = FranklinElements[franklinID].innerText
	var dataToSend = {
		franklinID: franklinID,
		content: updatedContent,
		timeStamp: new Date().getTime(),
		user: "Steve"
	}

	console.log(dataToSend)


	var httpRequest = new XMLHttpRequest();

   // TODO: StartLoadingIndicatior()
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				console.log(httpRequest.responseText)
   		} else {
        		console.log('There was a problem with the request.')
        		// TODO: StopLoadingIndicatior()
      	}
		} else {
			// Not ready yet.
		}
	}

	httpRequest.open('POST', '/saveuseredits', true)
	httpRequest.setRequestHeader('Content-Type', 'application/json')
	httpRequest.send(JSON.stringify(dataToSend))
}
