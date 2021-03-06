# Programming Assignment 2 Documentation

## Website Documentation

The website is based on the idea of a community in Croydon having events in the local area with titles, places, dates and descriptions, and people being able to leave comments on these events (for example, to suggest how the event could be improved in future or to give praise). If the site is hosted locally it can be accessed in a browser at http://localhost:8080/.

### Cloud Deployment
I have utilised the Heroku free cloud deployment service. My app is accessible at https://afternoon-spire-79392.herokuapp.com/.

Note that as the service is free the 'dyno' allowing it to run will sleep after half an hour of recieving no traffic. This simply causes a delay of a few seconds for the first request upon waking. Requests following the initial one will perform as normal. The free account does have a monthly limit of 550 'awake' hours - this shouldn't be exceeded for this project.

Also note that the server will take event and comment submissions from users and maintain them in the in-memory model for as long as the server is not restarted, therefore a user may be able to see data submitted by other users, as intended. Although the site requires all fields to be completed and requires correct date formatting on event submissions, the quality of data such as titles and descriptions for events is not verified so users may encounter data of poor quality.

###  Top Bar
The bar at the top of the site has the following buttons:

 - 'Croydon Events' - Takes the user to a blank front page with the search bar and weather information.
 - 'Browse' - Displays all events beneath the search bar for the user to browse.
 - 'Add Event' - Opens a form that allows a user to submit a new event to the site.
 
 ### Weather
 At the right hand side of the page is a description of the current weather conditions in London using data from the external web service 'AccuWeather'.
 This is included as Croydon is in London and if a user is viewing events to potentially attend that day the weather information could be useful to them. Note that the web service is freemium and does indicate a limit to its free use. No issues with its use have been encountered in development, however there is a slight chance that a limit could be reached during or before later use in testing. If the app is no longer able to obtain the data from the service it'll display 'Loading' in place of the data.
 
###  Search Bar
The search bar feature allows the user to display all events that have titles containing their search term. The search feature is present on all pages, and pressing the search button will replace the contents of the page below the bar with the search results.

###  Adding an Event

Clicking the 'Add Event' button brings up a form allowing the creation of new event entities. Note that in order to successfully create an event a valid date must be given in the format (dd/mm/yy) and a password must be given. At this time there is not special authentication for this password and it is hard-coded to be **admin**.

###  Adding a Comment

When the user has displayed a list of events by clicking the 'Browse' button or making a search, each event's title is click-able. Clicking on an event will bring up that event's information and any comments made on it, as well as a form allowing the user to submit a new comment. Once a comment has been submitted the form is removed and the page is updated to show the new comment alongside any other previous ones.

##  API Documentation

This API uses two entities: events and comments. Each of these entities has a GET and POST method, with the GET methods being able to return a list of all the entities of the given type or return a specific entity depending on whether an id is included in the url or not. Although my site doesn't require such functionality, I have also included get method routes ending in `/minlist` to allow the access of limited details on all the entities of a given type, as required by the task.

### Events
#### GET
Route: `/events`

Response format: JSON

Parameters:
|Name|Required|Description|
|--|--|--|
|id  | optional |Unique identifier of an individual event.|

Example requests:

 - `/events/?` - will return a list of all event entities
 - `/events/?id=1` - will return the specific event with unique identifier 1

Example responses:

 - `[{"id":1,"date":"01/06/19","title":"Carnival","place":"Village Green","description":"A gathering of entertainment professionals from 10:00 to 16:00. �5 entry."},{"id":2,"date":"02/06/19","title":"Vegetable Competition","place":"Village Hall","description":"Competition to find largest vegetables gorwn this year. 13:00 - 15:00"},{"id":3,"date":"03/06/19","title":"Welly Throwing","place":"Market Square","description":"Who can throw a welly the furthest? Find out at 13:00. Cash prize."}]`
 
 - `{"id":1,"date":"01/06/19","title":"Carnival","place":"Village Green","description":"A gathering of entertainment professionals from 10:00 to 16:00. �5 entry."}`

 Route: `/events/minlist`

Response format: JSON

Parameters: None

Example request:

 - `/events/minlist`

Example response:

- `[{"id":1,"title":"Carnival"},{"id":2,"title":"Vegetable Competition"},{"id":3,"title":"Welly Throwing"}]`

#### POST
Route: `/events`

Response format: JSON

Requires access token: Yes - this method currently checks for the inclusion of the code 'ABCD' (in an extended implementation this could be made more robust)

Parameters:
|Name|Required|Description|
|--|--|--|
|accesstoken  | required |Code 'ABCD' required for method to function.|
|title|optional|The title of the event.|
|date|optional|The date of the event.|
|place|optional|The location of the event.|
|description|optional|A description of the event.|

Example body for POST:

 - `accesstoken=${accesstoken}&date=${date}&eventid=${eventid}&commenter=${commenter}&comment=${comment}`

Example results:

 - Correct access token and successful post: `{ valid: true }`
 
 - Incorrect access token: `{ message: 'Invalid Access Token' }`

### Comments
#### GET
Route: `/comments`

Response format: JSON

Parameters:
|Name|Required|Description|
|--|--|--|
|id  | optional |Unique identifier of an individual comment.|

Example requests:

 - `/comments/?` - will return a list of all comment entities
 - `/comments/?id=1` - will return the specific comment with unique identifier 1

Example responses:

 - `[{"id":1,"date":"01/06/19","eventid":1,"commenter":"Fred Barnes","comment":"The clown was too scary."},{"id":2,"date":"02/06/19","eventid":2,"commenter":"Chris Rutherford","comment":"I'm glad Fred won the largest cucumber competition."},{"id":3,"date":"03/06/19","eventid":3,"commenter":"Benjamin Granger","comment":"The wellies were not of regulation weight."},{"id":4,"date":"30/4/2019","eventid":"4","commenter":"Tom","comment":"I hate fracking."}]`
 
 - `{"id":1,"date":"01/06/19","eventid":1,"commenter":"Fred Barnes","comment":"The clown was too scary."}`

 Route: `/comments/minlist`

Response format: JSON

Parameters: None

Example request:

 - `/comments/minlist`

Example response:

- `[{"id":1,"commenter":"Fred Barnes"},{"id":2,"commenter":"Chris Rutherford"},{"id":3,"commenter":"Benjamin Granger"}]`

#### POST
Route: `/comments`

Response format: JSON

Requires access token: Yes - this method currently checks for the inclusion of the code 'EFGH' (in an extended implementation this could be made more robust)

Parameters:
|Name|Required|Description|
|--|--|--|
|accesstoken  | required |Code 'EFGH' required for method to function.|
|commenter|optional|The name of the comment maker.|
|eventid|optional|The id of the event being commented on.|
|comment|optional|The comment text itself.|
|date|optional|Date the comment is made.|

Example body for POST:

 - `accesstoken=${accesstoken}&date=${date}&eventid=${eventid}&commenter=${commenter}&comment=${comment}`

Example results:

 - Correct access token and successful post: `{ valid: true }`
 
 - Incorrect access token: `{ message: 'Invalid Access Token' }`

