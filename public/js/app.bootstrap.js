let idx
let indexColumns = ['No','ChannelAlias'];

var app = angular.module('radioScanner', []);
app.controller('radioScannerCtrl', function($scope, $http) {
    $scope.searchResults = [];
    $scope.searchTerm = "";
    $scope.ref = "";

    $http.get("/channelList").then((fileContents) => {
        $scope.setChannelList(csvJSON(fileContents.data));
        localStorage.setItem("channelList", JSON.stringify($scope.channelList));
        $scope.$digest();
    });

    $scope.pick = function(){
        createPicker((data) => {
            getFile(data, (fileContents) => {
                $scope.setChannelList(csvJSON(fileContents));
                localStorage.setItem("channelList", JSON.stringify($scope.channelList));
                $scope.$digest();
            });
        });
    }

    $scope.setChannelList = function(channelList){
        if (channelList && channelList.length > 0){
            var demoChannel = channelList[0];

            var columns = Object.keys(demoChannel).filter(c => indexColumns.includes(c));

            idx = elasticlunr(function () {
                for (attr of columns){
                    this.addField(attr);
                }
                $scope.ref = columns[0];
                this.setRef($scope.ref);

                for (channel of channelList){
                    var cutdownChannel = {};
                    for (attr of columns){
                        cutdownChannel[attr] = channel[attr];
                    }
                    console.log(JSON.stringify(cutdownChannel));
                    this.addDoc(cutdownChannel);
                }
            });

            $scope.channelList = channelList;
        }
    }

    $scope.search = function(term){
        var results = idx.search(term);
        $scope.searchResults = results.map((result) => {
            return $scope.channelList.filter(c => c[$scope.ref] == result.ref)[0]
        });

        var resultRefList = $scope.searchResults.map((result) => {
            return result.ref;
        })

        //Let's do the regexp search too
        let regExp = getRegexp(term);
        if (regExp){
            $scope.channelList.forEach(channel => {
                if (!resultRefList.includes(channel.ref) && channel.ChannelAlias.match(regExp)){
                    $scope.searchResults.push(channel);
                }
            });
        }

        console.log(JSON.stringify($scope.searchResults));
    }

    $scope.setChannelList(JSON.parse(localStorage.getItem("channelList")));
});

//var csv is the CSV file with headers
function csvJSON(csv){

    alert(`csv is ${csv.length} in length`);

    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            var header = headers[j].replace(/[^a-z0-9]/gi, '');
            //console.log(header);
            obj[header] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return result; //JSON
  }

  function getRegexp(input){
    try {
        let outp = new RegExp(input);
        return outp;
    } catch(e) {
        return;
    }
  }