const context = {
    volume: 100,
    showMinutes: false,
    customSoundData: "",
    customSoundFilename: "",
	customColor: false,
	customColorBtn: "",
	customColorBtnHover: "",
	customColorBg: "",
	customColorFace: "",
	customColorMinute: "",
	customColorSecond: "",
	customColorMark: ""
};

/**
 * Displays a message for a short time.
 * @param {String} txt Message to display.
 */
const displayMessage = (txt) => {
    document.getElementById("messages").innerHTML = txt;
    window.setTimeout(() => { document.getElementById("messages").innerHTML = "&nbsp;"; }, 3000);
};

/**
 * Restores the options saved into local storage
 */
const restoreOptions = () => {
    context.volume = localStorage.volume;
    if (context.volume === undefined) {
        context.volume = 100;
    }
    document.getElementById("volume_value").innerHTML = context["volume"];
    document.getElementById("volume").value = context["volume"];
	
	context.customColorBtn = localStorage.customColorBtn;
	context.customColorBtnHover = localStorage.customColorBtnHover;
	context.customColorBg = localStorage.customColorBg;
	context.customColorFace = localStorage.customColorFace;
	context.customColorMinute = localStorage.customColorMinute;
	context.customColorSecond = localStorage.customColorSecond;
	context.customColorMark = localStorage.customColorMark;
	if (context.customColorBtn === undefined)
		context.customColorBtn = "#293E40";
	if (context.customColorBtnHover === undefined)
		context.customColorBtnHover = "#81B5A1";
	if (context.customColorBg === undefined)
		context.customColorBg = "#F7F7F7";
	if (context.customColorFace === undefined)
		context.customColorFace = "#000000";
	if (context.customColorMinute === undefined)
		context.customColorMinute = "#FFFFFF";
	if (context.customColorSecond === undefined)
		context.customColorSecond = "#81B5A1";
	if (context.customColorMark === undefined)
		context.customColorMark = "#FFFFFF";
	
	document.getElementById("customColorBtn").value = context.customColorBtn;
	document.getElementById("customColorBtnHover").value = context.customColorBtnHover;
	document.getElementById("customColorBg").value = context.customColorBg;
	document.getElementById("customColorFace").value = context.customColorFace;
	document.getElementById("customColorMinute").value = context.customColorMinute;
	document.getElementById("customColorSecond").value = context.customColorSecond;
	document.getElementById("customColorMark").value = context.customColorMark;

	document.documentElement.style.setProperty('--main-color', context.customColorBtn);
	document.documentElement.style.setProperty('--btn-hover-color', context.customColorBtnHover);
	document.documentElement.style.setProperty('--main-bg-color', context.customColorBg);
	document.documentElement.style.setProperty('--clock-face-color', context.customColorFace);
	document.documentElement.style.setProperty('--clock-seconds-color', context.customColorSecond);
	document.documentElement.style.setProperty('--clock-minutes-color', context.customColorMinute);
	document.documentElement.style.setProperty('--clock-mark-color', context.customColorMark);

    context.showMinutes = (localStorage.showMinutes === true || localStorage.showMinutes === "true" || localStorage.showMinutes === undefined);
    document.getElementById("showMinutes").checked = context.showMinutes;

    let customSoundElt = document.getElementById("customSound");
    let soundFileElt = document.getElementById("soundFile");
	let customColorElt = document.getElementById("customColor");
	let customColorChoicesElt = document.getElementById("customColorChoices");

    document.getElementById("customSound").onchange = (evt) => {
        context.customSound = customSoundElt.checked;
        if (customSoundElt.checked) {
            soundFileElt.style.visibility = "visible";
        } else {
            soundFileElt.style.visibility = "hidden";
        }
    };
    context.customSound = (localStorage.customSound === true || localStorage.customSound === "true");
    customSoundElt.checked = context.customSound;
    customSoundElt.onchange();
    context.customSoundData = localStorage.customSoundData || "";

    soundFileElt.onchange = () => {
        context.customSoundFilename = soundFileElt.value.split(/(\\|\/)/g).pop();
        document.getElementById("customSoundFilename").innerText = "";
        const file = soundFileElt.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            context.customSoundData = reader.result;
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
	
	document.getElementById("customColor").onchange = (evt) => {
		context.customColor = customColorElt.checked;
		if (customColorElt.checked)
			customColorChoicesElt.style.display = "block";
		else
			customColorChoicesElt.style.display = "none";
	}
	context.customColor = (localStorage.customColor === true || localStorage.customColor === "true");
	customColorElt.checked = context.customColor;
    customColorElt.onchange();

    context.customSoundFilename = (localStorage.customSoundFilename || "");
    if (context.customSoundFilename !== "") {
        document.getElementById("customSoundFilename").innerText = " (current: " + context.customSoundFilename + ")";
    }


    document.getElementById("volume").oninput = (evt) => {
        context.volume = evt.target.value;
        updateField("volume");
    };

    document.getElementById("volume_test").onclick = (evt) => {
        context.ring = document.createElement("audio");
        console.log((context.customSound && context.customSoundData));
        if (context.customSound && context.customSoundData) {
            context.ring.setAttribute("src", context.customSoundData);
        } else {
            context.ring.setAttribute("src", "sound/bell-ringing-02.mp3");
        }
        context.ring.volume = context.volume / 100;
        context.ring.play();
        window.setTimeout(() => {
            context.ring.pause();
        }, 5000);
    };
    document.getElementById("exportStatsJSON").onclick = exportStatsJSON;
    document.getElementById("exportStatsCSV").onclick = exportStatsCSV;
    document.querySelector("form").addEventListener("submit", saveOptions);
};

/**
 * Saves the options into sync storage
 * @param {object} evt the event that triggered the action
 */
const saveOptions = (evt) => {
    evt.preventDefault();
    try {
        localStorage.volume = context.volume;
        localStorage.showMinutes = document.getElementById("showMinutes").checked;
        localStorage.customSound = document.getElementById("customSound").checked;
		localStorage.customColor = document.getElementById("customColor").checked;
        if (!document.getElementById("customSound").checked) {
            context.customSoundData = "";
            context.customSoundFilename = "";
        }
        localStorage.customSoundData = context.customSoundData;
        localStorage.customSoundFilename = context.customSoundFilename;
		if (!document.getElementById("customColor").checked) {
			context.customColorBtn = "";
			context.customColorBtnHover = "";
			context.customColorBg = "";
			context.customColorFace = "";
			context.customColorSecond = "";
			context.customColorMinute = "";
			context.customColorMark = "";
			localStorage.removeItem("customColorBtn");
			localStorage.removeItem("customColorBtnHover");
			localStorage.removeItem("customColorBg");
			localStorage.removeItem("customColorFace");
			localStorage.removeItem("customColorSecond");
			localStorage.removeItem("customColorMinute");
			localStorage.removeItem("customColorMark");
		}
		else {
			localStorage.customColorBtn = document.getElementById("customColorBtn").value;
			localStorage.customColorBtnHover = document.getElementById("customColorBtnHover").value;
			localStorage.customColorBg = document.getElementById("customColorBg").value;
			localStorage.customColorFace = document.getElementById("customColorFace").value;
			localStorage.customColorSecond = document.getElementById("customColorSecond").value;
			localStorage.customColorMinute = document.getElementById("customColorMinute").value;
			localStorage.customColorMark = document.getElementById("customColorMark").value;
		}
        window.location.reload(true);
    } catch (e) {
        displayMessage("Options could not be saved. Is storage enabled?");
        console.log(e);
    }
};

/**
 * Creates CSV lines from an array of objects
 * @author https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
 * @param {Array} objArray array of objects
 */
const convertToCSV = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

const exportStatsJSON = (evt) => { evt.preventDefault(); exportStats("json"); };
const exportStatsCSV = (evt) => { evt.preventDefault(); exportStats("csv"); };
/**
 * Exports statistics
 * @param {object} evt the event that triggered the action
 */
const exportStats = (format) => {
    if (chrome.downloads === undefined) {
        chrome.permissions.request({
            permissions: ['downloads']
        }, (granted) => {
            console.log('permision: ', granted);
            if (granted) {
                exportStats(format);
            } else {
                displayMessage("Sorry, you can only download the stats if the permission is granted.");
            }
        });
    } else {
        if (!format) { format = "json"; }
        let responseHandler = (response) => {
            var blob;
            if (format == "csv") {
                blob = new Blob([convertToCSV(response)], {'type': "application/csv;charset=utf-8"});
            } else {
                blob = new Blob([JSON.stringify(response)], {'type': "application/json;charset=utf-8"});
            }
            try {
                chrome.downloads.download({
                    filename: "pomodoro-data." + format,
                    saveAs: true,
                    url: URL.createObjectURL(blob)
                });
            } catch (e) {
                displayMessage("Sorry, there was a browser error.", e);
                console.log(e);
            }
        };
        chrome.runtime.sendMessage({"command": "getStats"}, responseHandler);
    }
};

document.addEventListener("DOMContentLoaded", restoreOptions);
