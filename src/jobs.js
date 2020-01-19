var fs = require("fs");
var request = require("request");
var { getGesture } = require("./hand_movements");
//let PICTURE = "person.jpg"
let PICTURE = "movie.mov"
//let file = fs.createReadStream(`${PICTURE}`);
let TOKEN = '';
let file = '';

var jobRequest = {
  method: "POST",
  url: "https://api.wrnch.ai/v1/jobs",
  headers: {
    "Content-Type":
      "multipart/form-data; boundary=--------------------------780487085191623441098948",
    Authorization: TOKEN
  },
  formData: {
    work_type: "json",
    hands: "true",
    est_3d: "false",
    media: file
  }
};

var loginRequest = {
    method: 'POST',
    url: 'https://api.wrnch.ai/v1/login',
    headers:
    {
        'Content-Type': 'application/json'
    },
    body: { api_key: '2e11e90c-6d82-44b8-9471-9b558126c70a' },
    json: true
};

function getJob(jobID, jobToken, callback) {
    var jobResponse = {
        method: 'GET',
        url: `https://api.wrnch.ai/v1/jobs/${jobID}`,
        qs: { work_type: 'json' },
        headers:
        {
            Authorization: jobToken
        }
    };

    request(jobResponse, function (error, response, body) {
        if (error) throw new Error(error);
        let jsonBody = JSON.parse(body);
        console.log('jsonBody', jsonBody);
        callback(analyzer(jsonBody));
    });
}

function analyzer(jsonBody) {

    // Get Gesture and send it back
    $gesture = -1
    $gesture_string = getGesture(jsonBody)

    if($gesture_string == "move_left")
        $gesture = 0
    else if($gesture_string == "move_right")
        $gesture = 1
    else if($gesture_string == "scroll_up")
        $gesture = 2
    else if($gesture_string == "scroll_down")
        $gesture = 3
    else if($gesture_string == "left_click")
        $gesture = 4
    else if($gesture_string == "right_click")
        $gesture = 5
    else
        $gesture = 6
    return $gesture_string;
}

function response(gesture_string) {
    let MOVE_LEFT = 0;
    let MOVE_RIGHT = 1;
    let SCROLL_UP = 2;
    let SCROLL_DOWN = 3;
    let LEFT_CLICK = 4;
    let RIGHT_CLICK = 5;
    let NO_GESTURE = 6;

    if (id == MOVE_LEFT) {
        console.log("Status: MOVE_LEFT");
        return MOVE_LEFT;
    } else if(id == MOVE_RIGHT){
        console.log("Status: MOVE_RIGHT");
        return MOVE_RIGHT;
    } else if(id == SCROLL_UP){
        console.log("Status: SCROLL_UP");
        return SCROLL_UP;
    } else if(id == SCROLL_DOWN){
        console.log("Status: SCROLL_DOWN");
        return SCROLL_DOWN;
    } else if(id == LEFT_CLICK){
        console.log("Status: LEFT_CLICK");
        return LEFT_CLICK;
    } else if(id == RIGHT_CLICK){
        console.log("Status: RIGHT_CLICK");
        return RIGHT_CLICK;
    }
    else{
        console.log("Status: NO_GESTURE");
        return NO_GESTURE;
    }
}


/****************** Main function  ********/
function job(movieFile, callback){

    console.log("processing movie file = " + movieFile);

    request(loginRequest, function (error, response, body) {
        if (error) throw new Error(error);

        TOKEN = 'Bearer ' + body.access_token
        console.log('TOKEN', TOKEN);
        console.log('movieFile', movieFile);

        jobRequest.headers.Authorization = TOKEN;
        jobRequest.formData.media = fs.createReadStream(`${movieFile}`);

        request(jobRequest, function (error, response, body) {
            if (error) throw new Error(error);
            let jsonBody = JSON.parse(body);
            console.log("jsonBody", jsonBody);
            console.log("Job Id", jsonBody.job_id);
            console.log('ZZZzzZzzZZZz for 5 seconds');
            setTimeout(function () {
                console.log('sending TOKEN', TOKEN);
                getJob(jsonBody.job_id, TOKEN, function (answer) {
                    console.log("Callbackhell answer:", answer);
                    callback(answer);
                });
            }, 5000);
        });
    

    });

}

module.exports = { job };
/****************** Main function  ********/



