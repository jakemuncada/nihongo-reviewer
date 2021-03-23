var currIdx = 0;
var sampleSentences = [];

var divEng = null;
var divJap = null;
var divFuri = null;
var divImgWrap = null;
var image = null;

var btnSettings = null;
var btnPrev = null;
var btnNihongo = null;
var btnFlashcard = null;
var btnNext = null;
var settingsModal = null;
var settingsTableDiv = null;

window.onload = function () {
    // Initialize all elements.
    initElements();

    // Initialize all buttons.
    initButtons();

    // Initialize keyboard press.
    initKeydown();

    // Initialize the settings.
    initSettings();

    // Load all valid sample sentences.
    loadSampleSentences();
};

/* ********************************************************************** */
/*  INITIALIZATION                                                        */
/* ********************************************************************** */

function initElements() {
    divEng = document.getElementById("eng");
    divJap = document.getElementById("jap");
    divFuri = document.getElementById("furi");
    divImgWrap = document.getElementById("image-wrap");
    image = document.getElementById("image");
    settingsModal = document.getElementById("settingsModal");
    settingsTableDiv = document.getElementById("settingsTableDiv");

    btnSettings = document.getElementById("btnSettings");
    btnPrev = document.getElementById("btnPrev");
    btnNihongo = document.getElementById("btnNihongo");
    btnFlashcard = document.getElementById("btnFlashcard");
    btnNext = document.getElementById("btnNext");
}

function initButtons() {
    btnNext.addEventListener("click", showNext);
    btnNihongo.addEventListener("click", toggleNihongo);
    btnFlashcard.addEventListener("click", toggleFlashcard);
    btnSettings.addEventListener("click", showSettings);
}

function initSettings() {
    window.onclick = function (event) {
        // Close the modal if the user clicks outside it.
        if (event.target == settingsModal) {
            settingsModal.style.display = "none";
        }
    };

    document.getElementById("btnSettingsAll").addEventListener("click", selectAllLessons);
    document.getElementById("btnSettingsNone").addEventListener("click", deselectAllLessons);
    document.getElementById("btnSettingsSave").addEventListener("click", saveSettings);
    document.getElementById("btnSettingsCancel").addEventListener("click", hideSettings);

    const btnRandom = document.getElementById("btnSettingsRandom10");
    if (grammarList.length <= 10) {
        btnRandom.hidden = true;
    }
    btnRandom.addEventListener("click", selectRandomLessons);

    loadSettings();
}

function initKeydown() {
    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                toggleNihongo();
                e.preventDefault();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                toggleFlashcard();
                e.preventDefault();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                showPrev();
                e.preventDefault();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                showNext();
                e.preventDefault();
                break;
        }
    });
}

/* ********************************************************************** */
/*  SETTINGS                                                              */
/* ********************************************************************** */

function showSettings() {
    refreshSettings();
    settingsModal.style.display = "block";
}

function hideSettings() {
    loadSettings();
    settingsModal.style.display = "none";
}

function selectAllLessons() {
    grammarList.forEach((item) => {
        item.selected = true;
    });
    refreshSettings();
}

function deselectAllLessons() {
    grammarList.forEach((item) => {
        item.selected = false;
    });
    refreshSettings();
}

function selectRandomLessons() {
    var selectedLessons = [];
    for (var i = 0; i < 10; i++) {
        const len = grammarList.length;
        while (true) {
            var idx = Math.floor(Math.random() * len);
            if (!selectedLessons.includes(idx)) {
                selectedLessons.push(idx);
                break;
            }
        }
    }

    for (var i = 0; i < grammarList.length; i++) {
        grammarList[i].selected = selectedLessons.includes(i) ? true : false;
    }

    refreshSettings();
}

function loadSettings() {
    grammarList.forEach((item) => {
        const key = `n${item.level}-grammar${item.num}`;
        var value = localStorage.getItem(key);
        value = value === null ? true : value === "true" ? true : false;
        item.selected = value;
    });
}

function saveSettings() {
    grammarList.forEach((item) => {
        const checkbox = document.getElementById(`checkbox${item.num}`);
        const isSelected = checkbox.checked;

        item.selected = isSelected;
        const key = `n${item.level}-grammar${item.num}`;
        const value = isSelected;
        localStorage.setItem(key, value);
    });
    hideSettings();
    loadSampleSentences();
}

function refreshSettings() {
    var htmlStr = '<table id="settingsTable">';
    grammarList.forEach((item) => {
        const id = `checkbox${item.num}`;
        const name = `${item.num}`;
        const style = item.selected ? `style="background-color: lightblue;"` : "";
        const checked = item.selected ? "checked" : "";
        const checkboxStr = `<input type="checkbox" id="${id}" name="${name}" ${checked}/>`;

        var rowStr = `<tr id="settingsRow${item.num}" ${style} class="settingsRow noselect">`;
        rowStr += `<td>${checkboxStr}</td>`;
        rowStr += `<td>${item.eng}</td><td>${item.jap}</td><td>${item.meaning}</td>`;
        rowStr += "</tr>";
        htmlStr += rowStr;
    });
    htmlStr += "</table>";
    settingsTableDiv.innerHTML = htmlStr;

    grammarList.forEach((item) => {
        const rowId = `settingsRow${item.num}`;
        const row = document.getElementById(rowId);

        row.addEventListener("click", function (e) {
            handleSettingsRowClick(this);
        });
    });
}

function handleSettingsRowClick(row) {
    const checkbox = row.getElementsByTagName("input")[0];
    checkbox.checked = !checkbox.checked;
    row.style.backgroundColor = checkbox.checked ? "lightblue" : "transparent";
}

/* ********************************************************************** */
/*  SAMPLE SENTENCES                                                      */
/* ********************************************************************** */

function loadSampleSentences() {
    sampleSentences = [];

    var count = 0;
    grammarList.forEach((item) => {
        if (item.selected) {
            count += 1;
            item.sampleSentences.forEach((sampleSentece) => {
                const tmp = {
                    main: sampleSentece.main,
                    furi: sampleSentece.furi,
                    meaning: sampleSentece.meaning,
                    flashcardUrl: item.flashcardUrl,
                };
                sampleSentences.push(tmp);
            });
        }
    });

    console.log(`Loaded ${sampleSentences.length} sample sentences from ${count} grammar patterns.`);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(sampleSentences);

    currIdx = 0;
    showCurr();
}

function showCurr() {
    if (currIdx < 0 || currIdx >= sampleSentences.length) {
        console.log("Invalid index:", currIdx);
        return;
    }

    hideNihongo();
    hideFlashcard();

    btnPrev.disabled = currIdx == 0;
    btnNext.disabled = currIdx == sampleSentences.length - 1;

    const item = sampleSentences[currIdx];
    divEng.innerHTML = item.meaning;
    divJap.innerHTML = item.main;
    divFuri.innerHTML = item.furi;

    image.src = item.flashcardUrl;
}

function showPrev() {
    if (currIdx > 0) {
        currIdx -= 1;
        showCurr();
    } else {
        console.log("You have reached the first sample sentence.");
    }
}

function showNext() {
    if (currIdx < sampleSentences.length - 1) {
        currIdx += 1;
        showCurr();
    } else {
        console.log("You have reached the last sample sentence at index " + currIdx + ".");
    }
}

function showNihongo() {
    divJap.hidden = false;
    divFuri.hidden = false;
    btnNihongo.innerHTML = "Hide Nihongo";
}

function hideNihongo() {
    divJap.hidden = true;
    divFuri.hidden = true;
    btnNihongo.innerHTML = "Show Nihongo";
}

function showFlashcard() {
    divImgWrap.hidden = false;
    btnFlashcard.innerHTML = "Hide Flashcard";
}

function hideFlashcard() {
    divImgWrap.hidden = true;
    btnFlashcard.innerHTML = "Show Flashcard";
}

function toggleNihongo() {
    if (divJap.hidden) {
        showNihongo();
    } else {
        hideNihongo();
    }
}

/* ********************************************************************** */
/*  TOGGLE FLASHCARD                                                      */
/* ********************************************************************** */

function toggleFlashcard() {
    if (divImgWrap.hidden) {
        showFlashcard();
    } else {
        hideFlashcard();
    }
}
