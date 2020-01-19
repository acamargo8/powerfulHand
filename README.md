# PowerfulHand
## Inspiration
Instead of using a touchpad or mouse, we want to provide a third option of controlling the cursor displayed on the screen by the idea of motion capture and activity recognition. By simply moving your hand, we will be able to identify where you want to move the cursor on your screen, which improves the accessibility for easier control of the computer. Thus, improving users' experience with their computer. 

## What it does
The main idea is providing the ability to move the cursor without using a mouse or touchpad. We used wrnch.api to process the movement of hand gesture. Using the json files given, we analyze the data and determine if the hand gesture indicates one of the following: cursor move left, cursor move right, scroll up, scroll down, right-click, left-click. Then, the cursor displayed on the computer will be following the instruction given. 

## How we built it
We use javascript to build the majority of the program. 

## Challenges we ran into
One difficulty we encountered is that for security reasons, it is almost impossible to control your cursor running on a browser. We had to figure out a way to overcome this issue which took us a while. We also want to provide the ability of real-time movement analysis since the wrnch.api given was to manually upload the video and download it from the cloud. This also took a while to figure out.  

## Accomplishments that we're proud of
- Being able to implement this idea successfully in 24 hours. 
- Lots of communication between team members with what they want for the frontend and the backend 

## What we learned
- Teamwork
- Time management is extremely important
- Learning to use different libraries 

## What's next for Powerful Hand
- improve on the accessibility of the cursor movement 
- provide more features with this idea (such as zoom in, zoom out) 
