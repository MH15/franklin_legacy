__**Important:** will publish open source to Github as soon as well documented__
# Franklin
Franklin is a new node-based Content Management System (CMS) built from scratch to meet the goals of security, stability, and efficiency. Franklin uses a stack based on Node/Express including
- Passport.js
- EJS
- MongoDB
- Some other things


## Installation
Run `npm install` to install
You may have to install some dependencies with the `-g` tag to allow them to be accessed from the command line.
MongoDB should be configured to run through a demo account.
Run `npm run serve` to watch and serve any changes with a `nodemon` instance.

## TODO:
This all needs to be done in order of importance:
1. ~~Support multiple editing spaces~~
2. Login system
3. General UI
4. Multiple Users / Revision history

## Data Format
This is what each data entry in MongoDB should be formatted as:
```javascript
{
    "_id": {
        "$oid": <generic-mongodb-id>
    },
	"zone": "zone",
    "franklinID": "1",
    "content": "b",
    "timeStamp": 1497748229443,
    "user": "Steve"
}
```



## References
### Express
https://expressjs.com/en/starter/static-files.html
https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started

### MongoDB
https://zellwk.com/blog/crud-express-mongodb/
https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp
https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html
https://stackoverflow.com/questions/8694346/check-for-existing-document-in-mongo

### Git
https://www.git-tower.com/blog/git-cheat-sheet/
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
