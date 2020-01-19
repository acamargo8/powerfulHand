var fs = require("fs");
var request = require("request");
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
    heads: "true",
    est_3d: "true",
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
    $gesture = 0
    return response($gesture);
}

function response(id) {
    let MOVE_LEFT = 0;
    let MOVE_RIGHT = 1;

    if (id === MOVE_LEFT) {
        console.log("Status: MOVE_LEFT");
        return MOVE_LEFT;
    } else {
        console.log("Status: MOVE_RIGHT");
        return MOVE_RIGHT;
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



