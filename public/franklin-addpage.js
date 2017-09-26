// code to add a new page
// only visible to authenticated users
// canbe resource intensive because
// this is only ran in the editor


var deletePages = document.querySelectorAll("[franklin-page-number]")


deletePages.forEach(page => {
	var button = page.childNodes[3]
	button.addEventListener("click", d => {
		DeletePage(page, page.getAttribute("franklin-page-number"))
	})

})

function DeletePage(page, order) {
	var childTitle = page.childNodes
	var pageTitle = childTitle[1].querySelector("a").innerHTML
	// console.log(childTitle);
	console.log(`deleting item #${order} with title of ${pageTitle}`);

	var docToDelete = {
		title: pageTitle,
		order: order
	}

	var request = new Request('/deletepage', {
		method: 'POST',
		body: JSON.stringify(docToDelete),
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'application/JSON'
		})
	})
	console.log(docToDelete);
	// Now use it!
	fetch(request)
	.then(function(response) {
		return response.text();
	}).then(function(text) { 
	// <!DOCTYPE ....
		console.log(text);
		// when delete confirmation is recieved refresh
		// the page to update the user interface
		location.reload(true)
	})
	.catch(function(err) {  
		console.log('Fetch Error :-S', err)
	})
}