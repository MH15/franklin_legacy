// client side code for Franklin
// as much functionality as possible 
// should be implemented here
str = Window.FRANKLIN.STRINGS
lock = Window.FRANKLIN.SECURITY
func = Window.FRANKLIN.FUNCTIONS

var FranklinElements = document.querySelectorAll(`[franklin-state="${str.CONTENT_EDITABLE}"]`)
// var FranklinElements = document.querySelectorAll('[franklin-state="editable"]')


// add edit buttons if logged in
if (lock.SECURED == true) {
	FindEditableContent()
}


function FindEditableContent() {
	for (var i = 0; i < FranklinElements.length; i++) {
		// var editButton = CreateButton("button", "edit", i)
		FranklinElements[i].setAttribute("franklin-id", i)
		
		FranklinElements[i].addEventListener ("click", function(d) {BeginEditLoop(this.getAttribute("franklin-id"))
		})

	}
}


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
