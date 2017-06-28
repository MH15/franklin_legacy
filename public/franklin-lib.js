// various tags and strings for franklin 
// client side workers like ui and editing

Window.FRANKLIN = {
	STRINGS: {
		CONTENT_EDITABLE: "editable",
		FranklinZone: "editable-zone",
		newPostText: "New",
		submitPostText: "Post"
	},
	SECURITY: {
		SECURED: true
	}
}

var lib = {}


function CreateButton(text, location) {
	var el = document.createElement("button")
	el.innerHTML = text

	return el
}

lib.insertAfter = function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function AutoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}


Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
},false;


Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
},false;