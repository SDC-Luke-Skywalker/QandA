# QandA

This backend system services this front-end application:

`https://github.com/SDC-Luke-Skywalker/supernova-retail-app`

This database and server together are built to handle user traffic of ~900 API requests per second coming from the Questions and Answers component of the above front-end application. These numbers can be achieved with a single deployed instance of the server and database respectively. Further results can be achieved via Nginx load balancing.

By using a PostgreSQL database, all question and answer data are stored in two indexed tables, with relevant nested information, e.g., relevent photo information is nested within the answers table.
