# primo-explore-not-on-shelf
Provides a link to an external page/form with title, author, location, and call number. Library staff can then use this information to search for missing items.

## Features
Creates a link underneath the Real Time Availability in the Primo Explore full display for a record. Link is designed to include author, title, call number, and location.

### Screenshot
![screenshot](screenshot.png)

## Install
1. Make sure you've installed and configured [primo-explore-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv).
2. Navigate to your template/central package root directory. For example:
    ```
    cd primo-explore/custom/MY_VIEW_ID
    ```
3. If you do not already have a `package.json` file in this directory, create one:
    ```
    npm init -y
    ```
4. Install this package:
    ```
    npm install primo-explore-not-on-shelf --save-dev
    ```

## Usage
Once this package is installed, add `notOnShelf` as a dependency for your custom module definition.

```js
var app = angular.module('viewCustom', ['notOnShelf'])
```

Note: If you're using the `--browserify` build option, you will need to first import the module with:

```javascript
import 'primo-explore-not-on-shelf';
```

You can configure the banner by passing a configuration object. All properties are required.

| name      | type         | usage                                                                                   |
|-----------|--------------|-----------------------------------------------------------------------------------------|
| `libs` | array       | Whitelist of library codes for which the links should appear                                               |
| `urlBase` | string       | Base url for link. This can include additional GET parameters as needed.                                               |
| `query_mappings` | object       | Maps the GET URL fields for title, author, callnumber, location. For example, if you want your final URL to have the title value associated with "myTitle" (resulting in a URL parameter ...&myTitle=TheItemTitle&....), then the title portion of the object should read: 'title' : 'myTitle'.                                               |


The code below creates a link that points to a Google Form in which the title, author, call number, and location are pre-populated (see [here](https://productforums.google.com/forum/#!topic/docs/4dzyiCDeFu0;context-place=forum/docs) for more info).

```js
app.value('notOnShelfOptions', {
  "libs": ["Watzek"],
  "urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSdBvdqmK0z1mHhg-ATiCHT94JVBuwdaaHzpyZJcK3XBGEP-IA/viewform?usp=pp_url",
  "query_mappings" : {
    'title': 'entry.956660822',
    'author': 'entry.1791543904',
    'callnumber': 'entry.865809076',
    'location': 'entry.431935401'
  }
})
```

<!-- ## Running tests
1. Clone the repo
2. Run `npm install`
3. Run `npm test` -->
