# srv-util
## Utilities for server blueprint

- Class `Util`
    - `concatenate()` concatenates provided parameters to string. `undefined` and `null` are converted to empty strings
    - `escapeRegExp()` escapes string for RegExp
    - `objectCopy()` makes shallow object copy. If `includeProperties` is provided then object copy will contain only properties specified in array `includeProperties`.
    - `arrayExecutor()` executes task with every parameter in `paramArray`. Tasks are executed in sequence.
    - `getPathValue()` retrieves value from provided object via specified string path.
- Class `HTMLUtil`
    - `escapeHtml()` escapes string for HTML value
    - `htmlStart` and `htmlEnd` returns simple HTML start/end string
    - `generateErrorHTMLPage()` generates HTML page for provided Error
    - `generateErrorHTMLBody()` generates HTML page body for provided Error
- Class `XMLUtil`
    - `escapeXml()`  escapes string for XML value
    - `readXMLFile()` reads and parses XML file
    - `normalizeXMLData()` normalizes parsed XML data
