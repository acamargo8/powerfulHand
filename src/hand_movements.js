///
/// Calling get gesture parses a hardcoded video and returns a string with the gesture
///

// Frame data class to hold hand information
class FrameData {
    constructor(joint_array){
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
    constructor(xPos, yPos){
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

function checkForMovement(fdArray)
{    
    cm_counter = 0
    cm_movement_counter = 0
    dist_threshold = 0.005
    mov_num_threshold = 5

    last_moved = false
    max_consecutive_left_moves = 0
    max_consecutive_right_moves = 0
    consecutive_left_moves = 0
    consecutive_right_moves = 0

    for(frameData in fdArray){
        if(cm_counter > 0){
            if((Math.abs(fdArray[cm_counter].root.xPos - fdArray[cm_counter - 1].root.xPos) > dist_threshold)){
                if(fdArray[cm_counter].root.xPos < fdArray[cm_counter - 1].root.xPos)
                    consecutive_left_moves++
                else
                    consecutive_right_moves++

                cm_movement_counter++
                last_moved = true
            }
            else{
                last_moved = false
                if(consecutive_left_moves > max_consecutive_left_moves)
                    max_consecutive_left_moves = consecutive_left_moves

                if(consecutive_right_moves > max_consecutive_right_moves)
                    max_consecutive_right_moves = consecutive_right_moves

                consecutive_left_moves = 0
                consecutive_right_moves = 0
            }
        }
        cm_counter++
        if(cm_counter >= fdArray.length)
            break
    }

    console.log(max_consecutive_right_moves + "      " + max_consecutive_left_moves)
    // If hand moved both up and down, consider as no scroll
    if(max_consecutive_right_moves > 3 && max_consecutive_left_moves > 3){
        return "no_move"
    }
    
    if(cm_movement_counter > mov_num_threshold && (max_consecutive_left_moves > 3 || max_consecutive_right_moves > 3)){
        if(fdArray[0].root.xPos < fdArray[fdArray.length - 1].root.xPos)
            return "move_left"
        else
            return "move_right"
    }
    return "no_move"
}

// Check if scroll gesture was performed
function checkForScroll(fdArray){
    sc_counter = 0
    sc_movement_counter = 0
    dist_threshold = 0.01
    mov_num_threshold = 5

    last_moved = false
    max_consecutive_up_moves = 0
    max_consecutive_down_moves = 0
    consecutive_up_moves = 0
    consecutive_down_moves = 0

    for(frameData in fdArray){
        if(sc_counter > 0){
            if((Math.abs(fdArray[sc_counter].index.yPos - fdArray[sc_counter - 1].index.yPos) > dist_threshold)){
                if(fdArray[sc_counter].index.yPos < fdArray[sc_counter - 1].index.yPos)
                    consecutive_up_moves++
                else
                    consecutive_down_moves++

                sc_movement_counter++
                last_moved = true
            }
            else{
                last_moved = false
                if(consecutive_up_moves > max_consecutive_up_moves)
                    max_consecutive_up_moves = consecutive_up_moves

                if(consecutive_down_moves > max_consecutive_down_moves)
                    max_consecutive_down_moves = consecutive_down_moves

                consecutive_up_moves = 0
                consecutive_down_moves = 0
            }
        }
        sc_counter++
        if(sc_counter >= fdArray.length)
            break
    }

    // If hand moved both up and down, consider as no scroll
    if(max_consecutive_down_moves > 3 && max_consecutive_up_moves > 3){
        return "no_scroll"
    }
    
    if(sc_movement_counter > mov_num_threshold && (max_consecutive_up_moves > 3 || max_consecutive_down_moves > 3)){
        if(fdArray[0].index.yPos < fdArray[fdArray.length - 1].index.yPos)
            return "scroll_down"
        else
            return "scroll_up"
    }
    return "no_scroll"
}

//Determine if the gesture is left click
function mouseLeftClick(fdArray){
    for(frameData in fdArray){
        if(counter >= 0){
            if (fdArray[counter].thumb.xPos - fdArray[counter].index.xPos < 0.015 &&
                fdArray[counter].thumb.yPos - fdArray[counter].index.yPos < 0.025)
            {
                total_true = total_true + 1;
            } 
            else{
                total_false = total_false + 1;;
            }
        counter++
        }
    }
    if (total_true/counter > 0.70){
        left_click = true;
        return left_click
    } 
    else{
        return left_click
    }
}
function mouseRightClick(fdArray){
    for(frameData in fdArray){
        if(counter >= 0){
            if (fdArray[counter].thumb.xPos - fdArray[counter].middle.xPos < 0.020 &&
                fdArray[counter].thumb.yPos - fdArray[counter].middle.yPos < 0.125)
            {
                total_true = total_true + 1;
            } 
            else{
                total_false = total_false + 1;;
            }
        counter++
        }
    }
    if (total_true/counter > 0.70){
        right_click = true;
        return right_click;
    } 
    else{
        return right_click;
    }
}

function checkForClick(fdArray)
{
    //console.log(!mouse_left_click(fdArray))
    if (mouseLeftClick(fdArray)){
        return "left_click"
    } 
    else {
        total_true = 0;
        total_false = 0;
        counter = 0;
        if (mouseRightClick(fdArray)){
            return "right_click"
        }
        return "no_click"
    }
}

// ===================================================
// ================ Main Function ====================
// ===================================================
counter = 0;
var total_true = 0;
var total_false = 0;
var left_click = false;
var right_click = false;

function getGesture(jsonPath)
{
    //read json from a file
    var data = jsonPath
    const values = data["frames"];
    var num_frame = values.length
    var arr = [];
    var fdArray = [];

    for (i = 0; i < num_frame; i++){
        delete values[i].height;
        delete values[i].width;
        try{
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
        catch(err)
        {
            console.log("Error parsing frame #" + i + ". Skipping...")
        }
    }
    var gesture = ""
    gesture = checkForMovement(fdArray)

    if(gesture == "move_left" || gesture == "move_right"){
        return gesture
    }
    else{
        gesture = checkForScroll(fdArray)

        if(gesture == "scroll_down" || gesture == "scroll_up"){
            return gesture
        }
        else{
            //Variables for checkForClick function
            gesture = checkForClick(fdArray)

            if(gesture == "left_click" || gesture == "right_click")
                return gesture
        }
    }
    return "no_gesture"
}

module.exports = { getGesture };
