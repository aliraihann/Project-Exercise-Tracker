# API Project: Exercise Tracker
This is the boilerplate for the Exercise Tracker project, part of the FreeCodeCamp Back End Course Certification.

Instructions for building the project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

## User Stories:
- Users can create a user by posting form data as a username to the application and it returns an object with username and _id.
- Users can get an array list of all users.
- Users can add an exercise to any user by posting form data userId(_id) with exercise information consisting of description (required), duration (required), and date (optional). If the date is blank then the application will use the current date and it will return the user object with the exercise fields added.
- Users can obtain a full exercise log of any user with the additional count information of the total number of user's exercises.
- Users all so can add a parameter of from & to or limit of the user's log exercise when obtaining a user exercise log.
  
# Tech Stack
| Name | Function |
|-----------------|-----------------|
| MongoDB | Database| 
| ExpressJS | NodeJS Web Framework | 
| NodeJS | JavaScript Web Server | 

# Link to The Application

https://track-your-exercises.glitch.me

## ENDPOINT API
| Endpoint API | Fungsi | Method |
|-----------------|-----------------|-----------------|
| https://track-your-exercises.glitch.me/api/users| Create user | POST |
| https://track-your-exercises.glitch.me/api/users|  Get a list of all users | GET |
| https://track-your-exercises.glitch.me/api/users/:_id/exercises| Add new exercise log to a user | POST |
| https://track-your-exercises.glitch.me/api/users/:_id/logs| Get a list of user exercise logs | GET |
| https://track-your-exercises.glitch.me/api/users/:_id/logs?[from][&to][&limit]| Get a list of user exercise logs with date parameter (from & to) or number of exercises parameter (limit) | GET |
