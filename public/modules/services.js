let url = "http://"+window.location.hostname+":3001";

app.factory('factoryRequest', function ($http) {
    return {

        getCollectionHandMovements: function (name, callback){
            $http({
                method: "GET",
                url: url+"/handmovements?type="+name
            }).then(function(data){
                callback(data);
            })
        }




    }
});