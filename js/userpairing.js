/**
 * Created by Ranjini on 21.05.2016.
 */


XDMVC.prototype.getSth = function getSth (){
    this.sendToServer('hello','',function(resp){
        if(resp){
            console.log("***");
            console.log(resp);
        }
        else{
            console.log("#####");
        }
    });
    this.emit('getSth', "nobody");
};

XDMVC.prototype.logLocation = function logLocation(userID,lat,lon){
    XDmvc.sendToServer('logLocation',[userID,lat,lon]);
};

XDMVC.prototype.logDistance = function logDistance(contactID){
    XDmvc.sendToServer('logDistance',contactID,function(dist){
    });
};

XDMVC.prototype.enterRelationship = function enterRelationship(contactID,relationshipName){
    var relationshipInfo = [contactID,relationshipName];
    XDmvc.sendToServer('enterRelationship',relationshipInfo,function(resp){
        if(resp){
            console.log(resp);
        }
    }.bind(this));
};

XDMVC.prototype.userSignOut = function userSignOut(userID){
    XDmvc.sendToServer('userSignOut', userID, function(res){
        console.log(res);
    });
};

XDMVC.prototype.pairFriends = function pairFriends(contactID){
    this.sendToServer('pairfriends',contactID,function(data){
        if(data){
            console.log("pairFriends connecting to: " + data.toString());
            this.emit("deleteDisplayedRequest", contactID);
            XDmvc.connectTo(data.toString());
        }
        else {
            console.log("no device found");
        }
    }.bind(this));
};

XDMVC.prototype.checkContactOnline = function checkContactOnline(contactName, contactID,contactRelation, callback){
    XDmvc.sendToServer('isContactOnline',contactID, function(data){
        if(data) {
            // console.log(data);
            var contactsDeviceList = Object.keys(JSON.parse(data));
            this.emit("onlineContact", contactName,contactID,contactRelation, contactsDeviceList);
        }
    }.bind(this));
};

XDMVC.prototype.declinePairingRequest = function declinePairingRequest(contactID){
    this.sendToServer('declinePairingRequest',contactID,function(resp){
        if(resp){
            console.log(resp);
            this.emit("deleteDisplayedRequest", contactID);
        }
    }.bind(this));
};

XDMVC.prototype.removeDevice = function removeDevice(){
    XDmvc.sendToServer('removeDevice');
};

XDMVC.prototype.userSignIn = function userSignIn(userID, callback){
    XDmvc.sendToServer('userSignIn',userID, function(data){
        callback(data);
    }.bind(this));
};

XDMVC.prototype.getFriendsByGroup = function getFriendsByGroup(groupName, callback){
    XDmvc.sendToServer('getFriendsByGroup',groupName,function(friendsInGroup){
        //console.log("friendsInGroup: "+groupName+ " "  + JSON.stringify(friendsInGroup))
        callback(friendsInGroup);
    }.bind(this));
};
XDMVC.prototype.sortGroupByDistance = function sortGroupByDistance(group,callback){
    XDmvc.sendToServer('sortGroupByDistance',group,function(sortedGroup){
        callback(sortedGroup);
    }.bind(this));
};

XDMVC.prototype.getPairingRequests = function getPairingRequests(){
    this.sendToServer('checkPairingRequest',"",function(data){
        if(data){
            console.log(data);
            this.emit('newPairingRequests', data);
        }
        else{
            console.log("no pairing requests");
        }
    }.bind(this));
};
////////////////////////
XDMVC.prototype.getLocation = function  getLocation(user_id) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
        //TODO: check if this.showPosition works correctly
    } else {
        console.log("Geolocation is not suppemorted by this browser.");
    }
};
XDMVC.prototype.showPosition = function showPosition(position) {
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude+' / '+longitude);
    XDmvc.logLocation(latitude,longitude);
};

