
# Bailiff - A configs manager

The bailiff is a single point of config management.

Bailiff lets you access all your configs. Be it `.env`, JSON files, and it also supports a central config in the mongo collection.

A central config can make it easy to share and manage common configs between your services, e.g. core DB configs.

## Setup

### Install

```bash
npm install --save bailiff
```

### Add variables in the ‘.env’ file in the root dir of your service

You need this if you want to have central configs in Mongo DB.

```bash
BAILIFF_MONGO_USER="your-mongo-user"
BAILIFF_MONGO_PASS="your-mongo-pass"
BAILIFF_MONGO_HOST="your-mongo-host"
BAILIFF_MONGO_PORT="your-mongo-port"
BAILIFF_MONGO_DB="your-db-name"
BAILIFF_MONGO_COLLECTION="your-collection-name"
```

OR

```bash
BAILIFF_MONGO_URI="mongodb://user:pass@host:27017"
BAILIFF_MONGO_DB="your-db-name"
BAILIFF_MONGO_COLLECTION="your-collection-name"
```

### How to use

#### Initialize central config of mongo

You can skip this part if you are not using central config.

Run `bailiff-init` before starting your node application.

We recommend you add this in the `scripts` section of your `package.json`.

eg: `prestart: "bailiff-init"` or `prestart: "npx bailiff-init"`


#### Get a config from .env or central config from mongo

Add `bailiff` in your code.

```javascript
const bailiff = require("bailiff").default;

bailiff.get("MY_CONFIG_VAR"); 
```

#### To add custom configurations

```javascript
const bailiff = require("bailiff").default;
```

OR

```javascript
import bailiff from "bailiff"
```

```javascript
// To add custom Hash config data or/and a JSON file. You can chain addStore.

bailiff.addStore({"MY_CONFIG_VAR": "MY_CONFIG_VALUE", "ANOTHER_CONFIG": "ANOTHER_VALUE"})
        .addStore("relative/path/to/your/json");
```

bailiff uses Singleton pattern. Add config store once and then use it later anywhere in the code in any file.

```javascript
const bailiff = require("bailiff").default;

bailiff.get("ANOTHER_CONFIG");
```

#### To access central configs from Mongo DB

The data structure of the mongo document should look like this -

```json
{
  "name": "MY_CONFIG_VAR",
  "value": "MY_CONFIG_VALUE",
  "status": 1
}
```

Make a unique index on name and status for fast search and accurate data.

You can access central config similar to other configs.

```javascript
bailiff.get("MY_CONFIG_VAR");
```

Bailiff keeps a copy of the central mongo config.

It does not read from MongoDB every time.

It only reads from MongoDB once on the service startup. That makes it very fast.

### Priority of configs

Priority of configs are

1. Custom added store
2. Dotenv file
3. Central config

This makes it easy to override central config if required.
