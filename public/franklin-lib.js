// various tags and strings for franklin 
// client side workers like ui and editing

Window.FRANKLIN = {
	STRINGS: {
		CONTENT_EDITABLE: "editable"
	},
	SECURITY: {
		SECURED: true
	}
}


function CreateButton(type, text, index) {
	var el = document.createElement(type)
	var text = document.createTextNode(text)
	el.appendChild(text)
	el.setAttribute("franklin-id", index)

	

	return el

}


function AutoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}