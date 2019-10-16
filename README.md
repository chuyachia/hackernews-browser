#### Top 500 hacker news browser with rxjs and react-virtualized 

Instead of returning a collection of posts and comments in one single request, Hacker News Api requires users to fetch each comment and post separately using id.

This app utilizes react-virtualized and rxjs to minimize overheads due to large amount of api calls and ensure better user experience.

* Uses react-virtualized so that calls to fetch post details are fired only when the post is scrolled in view
* Uses rxjs to subscribe to new fetch comment results and unsubscribe to old ones on active post changed to avoid unneeded fetch comment calls

Start application in dev server:
```npm run start```