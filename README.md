
# Lilliput - A configs manager

Lilliput is a single point of config management.

Lilliput lets you access all your configs. Be it `.env`, json files, and it also supports a central config in mongo collection.

A central config can make it easy to share and manage common configs between your services, e.g. core DB configs.

## Setup

### Install

```bash
npm install --save lilliput
```

### Add variable in ‘.env’ file in root of your service

You need this if you want to have central configs in Mongo DB.

```
LILLIPUT_MONGO_USER=your-mongo-user
LILLIPUT_MONGO_PASS=your-mongo-pass
LILLIPUT_MONGO_HOST=your-mongo-host
LILLIPUT_MONGO_PORT=your-mongo-port
LILLIPUT_MONGO_DB=your-db-name
LILLIPUT_MONGO_COLLECTION=your-collection-name
```
OR
```
LILLIPUT_MONGO_URI="mongodb://user:pass@host:27017"
LILLIPUT_MONGO_DB=your-db-name
LILLIPUT_MONGO_COLLECTION=your-collection-name
```

### How to use

#### Get a config from .env or central config from mongo

Include `lilliput` in your code.

```javascript
const lilliput = require(“lilliput”); 

lilliput.get(“MY_CONFIG_VAR”);  
```

#### To add custom configurations

```javascript
const lilliput = require(“lilliput”); 

// To add custom Hash config data or/and a JSON file
lilliput.addStrore({"MY_CONFIG_VAR": “MY_CONFIG_VALUE”, “ANOTHER_CONFIG”: “ANOTHER_VALUE”})
       .addStore(“relative/path/to/your/json”);
```
lilliput uses Singleton pattern. Add config store once and then use it later anywhere in the code in any file.
```javascript
lilliput.get(“ANOTHER_CONFIG”);
```

#### To access central configs from Mongo DB

Data structure of the mongo document should look like -

```
{
  “name”: “MY_CONFIG_VAR”,
  “value”: “MY_CONFIG_VALUE”,
  “status”: 1
}
```

Make a unique index on name and status for fast search and accurate data.

You can access central config similar to other configs.
```javascript
lilliput.get(“MY_CONFIG_VAR”);
```
Lilliput keeps a copy of central mongo config. 

It does not read from MongoDB every time.

It only reads from MongoDB once on the service startup. That makes it very fast.

### Priority of configs

Priority of configs are 
1. Custom added store
2. Dotenv file
3. Central config

This makes it easy to override central config if required.

### Use in Typescript

```
import lilliput from ‘lilliput’
```
