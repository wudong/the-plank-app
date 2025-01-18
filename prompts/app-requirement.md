The Plank App Requirement

# Functional Requirement:
The app is used to help me improve on my plank training.

It should have the following functions.
1. Count the time of how long we do plank each time;
2. Show the progress of each day we do plank;
3. Can track the longest time, the longest streak, and the current streak of days;
4. A reminder everyday to remind do plank;

## Further clarification
1. For progress tracking: 
   - Show the historical data in a line chart;
   - It should contains all the historical data, and can be aggregrated into month, week and days
2. For the daily reminder:
   - User should be reminded at a specific time;   
   - We should use notification for reminder;
3. For the timer:
   - We should use the last week average time as the target user want to beat;   
   - We should provide visual and audio indicators for half way, and target reached; and for every 10
     seconds over the target.

# Non Functional Requirement:
1. It should be a PWA web app that can be easily used in mobile; this is a client side only app, and 
   there is no need for a backend.
2. On the tech stack: 
   - Use react.js with mui ui components; 
   - Use typescript for strong typing;
   - Use zustand for state management;
   - Use pnpm for package management;
   - It will be deployed to netlify to hosting; 

