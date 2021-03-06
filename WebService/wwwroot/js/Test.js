﻿

// Tests the API from the client side //

var currenttest = 0;

window.onload = function () {

    var table = document.getElementById("testtable");
    while (table.rows.length > 2) {
        table.deleteRow(2);
    }
    var row = table.insertRow();
    makecellhelper(row, "Test Name");
    makecellhelper(row, "Time (ms)");
    makecellhelper(row, "Success?");
    makecellhelper(row, "API return code");

    //Call the first test
    tests[0]();
};

function testhelper(name, time, success, status) {
    var table = document.getElementById("testtable");
    var row = table.insertRow();

    makecellhelper(row, name);
    makecellhelper(row, time.toPrecision(6));
    makecellhelper(row, success);
    makecellhelper(row, status);

    if (success) {
        row.style.backgroundColor = "lightgreen";
    } else {
        row.style.backgroundColor = "lightcoral";
    }

    currenttest++;
    if (currenttest < tests.length) {
        tests[currenttest]();
    }
}

function makecellhelper(row, data) {
    var cell = row.insertCell();
    var info = document.createTextNode(data);
    cell.appendChild(info);
}

function httpreceivehelper(http, name, starttime, wantsuccess) {
    if (http.readyState === 4) {
        if (http.status < 400) {
            testhelper(name, performance.now() - starttime, wantsuccess, http.status);
        } else {
            testhelper(name, performance.now() - starttime, !wantsuccess, http.status);
        }
    }
}


var tests = [
// BEFORE LOGIN (fail tests)

    function () {
        var name = "Can't update before login";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        //generate player data
        var player =
        {
            'XPos': 45,
            'YPos': 45,
            'Color': "f00"
        };

        http.onreadystatechange = function() { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Room/UpdateGame/?playerid=testplayer&roomid=testroom&player=" + JSON.stringify(player));
        http.send();
    },

    function () {
        var name = "Can't end game before login";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Room/EndGame/?playerid=testplayer&roomid=testroom");
        http.send();
    },

    function () {
        var name = "Can't get room that does not exist";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Room/GetGame/?roomid=testroom");
        http.send();
    },

    function () {
        var name = "Can't make room with not known roomtype";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Player/NewGame/?playerid=testplayer&roomid=testroom&roomtype=NotType");
        http.send();
    },

    // BASIC FUNCTIONALITY

    function () {
        var name = "Basic acceptable login";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Player/NewGame/?playerid=testplayer&roomid=testroom&roomtype=Office");
        http.send();
        //at this point testplayer should be in room testroom
    },

    function () {
        var name = "Basic get game";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Room/GetGame/?roomid=testroom");
        http.send();
    },

    function () {
        var name = "Basic update game";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        var player =
        {
            'XPos': 45,
            'YPos': 45,
            'Color': "f00"
        };

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Room/UpdateGame/?playerid=testplayer&roomid=testroom&player=" + JSON.stringify(player));
        http.send();
    },

    function() {
        var name = "Another player can log into an active room";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Player/NewGame/?playerid=testplayer2&roomid=testroom&roomtype=Office");
        http.send();
        //at this point testplayer and testplayer2 should be in room testroom
    },

    function() {
        var name = "Can't login in with an active player - same room";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Player/NewGame/?playerid=testplayer&roomid=testroom&roomtype=Office");
        http.send();
    },

    function () {
        var name = "Can't login in with an active player - different room";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Player/NewGame/?playerid=testplayer&roomid=testroom2&roomtype=Office");
        http.send();
    },

    function () {
        var name = "Basic end game";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Room/EndGame/?playerid=testplayer2&roomid=testroom");
        http.send();
        //at this point testplayer should be in room testroom
    },

    function () {
        var name = "Can't logout someone already logged out";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Room/EndGame/?playerid=testplayer2&roomid=testroom");
        http.send();
        //at this point testplayer should be in room testroom
    },

    function () {
        var name = "Get player statistics";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, true); }; //success
        http.open("GET", "api/Player/GetStats");
        http.send();
    },

    //Bad or malicious requests

    function () {
        var name = "Log in with too long a player name";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Player/NewGame/?playerid=abcdefghijklmnopqrstuvwxyz1234567890" +
            "&roomid=testroom");
        http.send();
    },

    function () {
        var name = "Log in with too long a room name";
        var http = new XMLHttpRequest();
        var starttime = performance.now();

        http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
        http.open("GET", "api/Player/NewGame/?playerid=testplayer2" +
            "&roomid=abcdefghijklmnopqrstuvwxyz1234567890");
        http.send();
    },

    function () {
        testhelper("Initialized TimeOut test function, should return in 3 minutes", 0, true, 0); // NOT A TEST
    },

    function () {
        setTimeout( function() {
            var name = "Auto-log-off logged player in three minutes";
            var http = new XMLHttpRequest();
            var starttime = performance.now();

            http.onreadystatechange = function () { httpreceivehelper(http, name, starttime, false); }; //fail
            http.open("GET", "api/Room/EndGame/?playerid=testplayer&roomid=testroom");
            http.send();
            },
        2100000);
    }

];
