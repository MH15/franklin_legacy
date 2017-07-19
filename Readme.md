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

export NODE_ENV=production

## TODO:
This all needs to be done in order of importance:
1. ~~Support multiple editing spaces~~
2. ~~Login system~~
3. ~~Add New Item function~~
4. General UI
	- buttons to authenticate users
	- rich content through a possible { content-type: <> } json flag
5. Multiple Users / Revision history

## Data Format
This is what each data entry in MongoDB should be formatted as:
```javascript
{ two: 
   [ { _id: 594c69296dccd32ea7744c1d,
       zone: 'two',
       franklinID: '0',
       content: 'at the beginning of zone two yet corruptible data is an issue everywhere',
       timeStamp: 1498781997553,
       user: 'Steve' },
     { _id: 594c73afe6a4d9376565dd34,
       zone: 'two',
       franklinID: '1',
       content: 'zone twoa acascascas 0',
       timeStamp: 1498781957650,
       user: 'Steve' },
     { _id: 595596527622e828f638a3a4,
       zone: 'two',
       franklinID: '2',
       content: 'post',
       timeStamp: 1498781266009,
       user: 'Steve' },
     { _id: 595598fe11200e2b26e3903b,
       zone: 'two',
       franklinID: '3',
       content: 'works here too! Is at bottom of list!',
       timeStamp: 1498781950796,
       user: 'Steve' },
     { _id: 596a7a31a70b101a5a0109f8,
       zone: 'two',
       franklinID: '4',
       content: 'ascnlasc',
       timeStamp: 1500150321400,
       user: 'Steve' } ],
  one: 
   [ { _id: 5939ee2b3cd2c62aa8fc14a8,
       zone: 'one',
       franklinID: '0',
       content: 'new entry in the first spot dude',
       timeStamp: 1500147319945,
       user: 'Steve' },
     { _id: 507f191e810c19729de860ea,
       zone: 'one',
       franklinID: '1',
       content: 'new entry that has been edited',
       timeStamp: 1498781600441,
       user: 'Steve' },
     { _id: 5939ee643cd2c62aa8fc14a9,
       zone: 'one',
       franklinID: '2',
       content: 'new entry that has been edited twice',
       timeStamp: 1498781602177,
       user: 'Steve' },
     { _id: 5939e82cc4265f24da0fdce5,
       zone: 'one',
       franklinID: '3',
       content: 'fourth',
       timeStamp: 1498781917778,
       user: 'Steve' },
     { _id: 595595fa7622e828f638a3a3,
       zone: 'one',
       franklinID: '4',
       content: 'new entry that was bumped to last due to quotes',
       timeStamp: 1498781903259,
       user: 'Steve' },
     { _id: 595598ed11200e2b26e3903a,
       zone: 'one',
       franklinID: '5',
       content: 'Hey this works and this should be at the bottom of the list',
       timeStamp: 1500235078866,
       user: 'Steve' },
     { _id: 5955b4a357366134e98cf96c,
       zone: 'one',
       franklinID: '6',
       content: 'Brit you suck',
       timeStamp: 1498930745751,
       user: 'Steve' },
     { _id: 5957de3c523b5e5ba6ef6781,
       zone: 'one',
       franklinID: '7',
       content: 'abc was blank',
       timeStamp: 1500146590179,
       user: 'Steve' } ] }


```

{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules"
  ],
  "verbose": true,
  "execMap": {
    "js": "node"
  },
  "events": {
    "restart": "osascript -e 'display notification \"App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'"
  },
  "watch": [
    "public/css",
    "public",
    "views"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json"
}


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
