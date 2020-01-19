$(function(){
    $.getJSON("json/Click2.json", function(result){
        console.log("I got Json!");


    });



});
// Frame data class to hold hand information
class FrameData {
    constructor(joint_array)
    {
        this.frame = joint_array.frame_time
        this.root = new Point2D(joint_array.x_root, joint_array.y_root)
        this.thumb = new Point2D(joint_array.x_thumb, joint_array.y_thumb)
        this.index = new Point2D(joint_array.x_index, joint_array.y_index)
        this.middle = new Point2D(joint_array.x_middle, joint_array.y_middle)
        this.ring = new Point2D(joint_array.x_ring, joint_array.y_ring)
        this.pinky = new Point2D(joint_array.x_pinky, joint_array.y_pinky)
    }
}

// Helper class for calculations
class Point2D {
    constructor(xPos, yPos)
    {
        this.xPos = xPos
        this.yPos = yPos
    }
    distance2D(other_point){
        var xDist = Math.abs(this.xPos - other_point.xPos)
        var yDist = Math.abs(this.yPos - other_point.yPos)
        return Math.sqrt(xDist*xDist + yDist*yDist)
    }
    direction2D(other_point){
        var yDist = other_point.yPos - this.yPos
        var xDist = other_point.xPos - this.xPos
        return Math.atan(yDist / xDist)
    }
}

// To use for checking movement
const THRESHOLD = 0.05;


let rightClick = function(){


//read json from a file
    var data = require('./Click2.json')
    const values = data["frames"];
    var num_frame = values.length
    var arr = [];
    var fdArray = [];
    for (i = 0; i < num_frame; i++){
        delete values[i].height;
        delete values[i].width;
        arr.push({
            frame_time : values[i].frame_time,
            x_root : values[i].persons[0].hand_pose.right.joints[0],
            y_root : values[i].persons[0].hand_pose.right.joints[1],
            x_thumb : values[i].persons[0].hand_pose.right.joints[16],
            y_thumb : values[i].persons[0].hand_pose.right.joints[17],
            x_index : values[i].persons[0].hand_pose.right.joints[22],
            y_index : values[i].persons[0].hand_pose.right.joints[23],
            x_middle : values[i].persons[0].hand_pose.right.joints[28],
            y_middle : values[i].persons[0].hand_pose.right.joints[29],
            x_ring : values[i].persons[0].hand_pose.right.joints[34],
            y_ring : values[i].persons[0].hand_pose.right.joints[35],
            x_pinky : values[i].persons[0].hand_pose.right.joints[40],
            y_pinky : values[i].persons[0].hand_pose.right.joints[41],
        });

        fdArray.push(new FrameData(arr[i]))
    }

// console.log(fdArray[0].root.xPos)

    counter = 0
    static_gesture = false
    root_distances = []
    finger_distances = []

    movement_counter = 0

// Loop through frame data and check for movements/gestures
    for(frameData in fdArray)
    {
        if(counter > 0)
        {
            console.log("root x pos: " + fdArray[counter].root.xPos + "  ||  root y pos: " + fdArray[counter].root.yPos)

        }
        counter++
    }


}
