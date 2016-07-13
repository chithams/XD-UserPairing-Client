/*
 * XD-MVC -- A framework for cross-device applications
 * Copyright (C) 2014-2015 Maria Husmann. All rights reserved.
 *
 * This file was created by Sivaranjini Chithambaram.
 *
 * XD-MVC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * XD-MVC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with XD-MVC. If not, see <http://www.gnu.org/licenses/>.
 *
 * See the README and LICENSE files for further information.
 *
 */

XDMVC.prototype.userSignIn = function userSignIn(userID){
    XDmvc.sendToServer('userSignIn',userID, function(deviceId){
        this.emit('signedIn', deviceId);
    }.bind(this));
};

XDMVC.prototype.userSignOut = function userSignOut(userID){
    XDmvc.sendToServer('userSignOut', userID, function(res){
        console.log(res);
        this.emit("signedOut", userID);
    }.bind(this));
};

XDMVC.prototype.getLocation = function  getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
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

XDMVC.prototype.logLocation = function logLocation(lat,lon){
    XDmvc.sendToServer('logLocation',[lat,lon]);
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

XDMVC.prototype.checkContactOnline = function checkContactOnline(contactName, contactID,relationshipName, callback){
    XDmvc.sendToServer('isContactOnline',contactID, function(data){
        if(data) {
            console.log("YES");
            var deviceList = JSON.parse(data);
            this.emit("onlineContact", contactName,contactID,relationshipName, deviceList);
        }
    }.bind(this));
};

XDMVC.prototype.pairFriends = function pairFriends(contactID){
    this.sendToServer('pairfriends',["contact",contactID],function(data){
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

XDMVC.prototype.pairDevice = function pairDevice(deviceID,contactID){
    this.sendToServer('pairfriends',["device",deviceID,contactID],function(data){
        if(data){
            console.log("pairDevice connecting to: " + data.toString());
            this.emit("deleteDisplayedRequest", contactID);
            XDmvc.connectTo(data.toString());
        }
        else {
            console.log("no device found");
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

XDMVC.prototype.getFriendsSelected = function getFriendsSelected(groupNames, callback){

    XDmvc.sendToServer('getFriendsSelected',groupNames,function(data){
        callback(data);
    }.bind(this))

};
XDMVC.prototype.sortGroupByDistance = function sortGroupByDistance(contactList,callback){
    XDmvc.sendToServer('sortGroupByDistance',contactList,function(sortedContactList){
        callback(sortedContactList)
    }.bind(this));
};
XDMVC.prototype.getPairingRequests = function getPairingRequests(){
    this.sendToServer('checkPairingRequest',"",function(data){
        if(data){
            console.log(contactList);
            var contactList = Object.keys(JSON.parse(data));
            this.emit('newPairingRequests', contactList);
        }
    }.bind(this));
};

XDMVC.prototype.configureGroups = function configureGroups(groups){
    var indexes = Object.keys(groups);
    var groupInfo = {};

    for(var i = 0; i < indexes.length; i ++){
        var obj = groups[indexes[i]];
        groupInfo[obj["name"]] = obj["requiresAck"];
    }

    this.sendToServer('configGroups',groupInfo);
};
