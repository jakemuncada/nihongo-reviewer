var currIdx = 0;
var selectedLevel = 5;
var grammarList = [];
var sampleSentences = [];

var divEng = null;
var divJap = null;
var divFuri = null;
var divImgWrap = null;
var imgFlashcard = null;

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

    // Initialize the grammar lists.
    initGrammarLists();

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
    divImgWrap = document.getElementById("flashcard-wrap");
    imgFlashcard = document.getElementById("flashcard");
    settingsModal = document.getElementById("settingsModal");
    settingsTableDiv = document.getElementById("settingsTableDiv");

    btnSettings = document.getElementById("btnSettings");
    btnPrev = document.getElementById("btnPrev");
    btnNihongo = document.getElementById("btnNihongo");
    btnFlashcard = document.getElementById("btnFlashcard");
    btnNext = document.getElementById("btnNext");
}

function initButtons() {
    btnPrev.addEventListener("click", showPrev);
    btnNext.addEventListener("click", showNext);
    btnNihongo.addEventListener("click", toggleNihongo);
    btnFlashcard.addEventListener("click", toggleFlashcard);
    btnSettings.addEventListener("click", showSettings);
}

function initGrammarLists() {
    const process = (grammarList) => {
        return grammarList.map((item) => {
            let key = `n${item.level}-grammar${item.num}`;
            let isSelected = localStorage.getItem(key);
            isSelected = isSelected === null ? "true" : isSelected;
            isSelected = isSelected === "true" ? true : false;
            console.log(key, isSelected);
            return {
                num: item.num,
                level: item.level,
                eng: item.eng,
                jap: item.jap,
                meaning: item.meaning,
                flashcardUrl: item.flashcardUrl,
                sampleSentences: item.sampleSentences,
                selected: isSelected,
            };
        });
    };

    grammarListN1 = process(grammarListN1);
    grammarListN2 = process(grammarListN2);
    grammarListN3 = process(grammarListN3);
    grammarListN4 = process(grammarListN4);
    grammarListN5 = process(grammarListN5);
}

function initSettings() {
    window.onclick = function (event) {
        // Close the modal if the user clicks outside it.
        if (event.target == settingsModal) {
            saveSettings();
            settingsModal.style.display = "none";
        }
    };

    document.getElementById("btnCloseSettings").addEventListener("click", () => {
        saveSettings();
        settingsModal.style.display = "none";
    });

    selectedLevel = localStorage.getItem("selectedLevel");
    selectedLevel = selectedLevel === null ? 5 : parseInt(selectedLevel, 10);
    document.getElementById("levelN" + selectedLevel).checked = true;

    document.getElementById("levelN1").addEventListener("click", () => selectGrammarLevel(1));
    document.getElementById("levelN2").addEventListener("click", () => selectGrammarLevel(2));
    document.getElementById("levelN3").addEventListener("click", () => selectGrammarLevel(3));
    document.getElementById("levelN4").addEventListener("click", () => selectGrammarLevel(4));
    document.getElementById("levelN5").addEventListener("click", () => selectGrammarLevel(5));

    document.getElementById("btnSettingsAll").addEventListener("click", selectAllLessons);
    document.getElementById("btnSettingsNone").addEventListener("click", deselectAllLessons);
    document.getElementById("btnSettingsRandom10").addEventListener("click", selectRandomLessons);
    // document.getElementById("btnSettingsSave").addEventListener("click", saveSettings);
    // document.getElementById("btnSettingsCancel").addEventListener("click", hideSettings);
}

function initKeydown() {
    document.addEventListener("keydown", function (e) {
        document.activeElement.blur();
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
/*  DATA                                                                  */
/* ********************************************************************** */

function refreshGrammarList() {
    switch (selectedLevel) {
        case 1:
            grammarList = grammarListN1;
            break;
        case 2:
            grammarList = grammarListN2;
            break;
        case 3:
            grammarList = grammarListN3;
            break;
        case 4:
            grammarList = grammarListN4;
            break;
        case 5:
        default:
            grammarList = grammarListN5;
    }
    console.log(`There are ${grammarList.length} grammar patterns in N${selectedLevel}.`);
}

function loadSampleSentences() {
    refreshGrammarList();
    sampleSentences = [];

    var count = 0;
    grammarList.forEach((item) => {
        if (item.selected) {
            count += 1;
            item.sampleSentences.forEach((sampleSentence) => {
                const tmp = {
                    main: sampleSentence.main,
                    furi: sampleSentence.furi,
                    meaning: sampleSentence.meaning,
                    flashcardUrl: item.flashcardUrl,
                };
                sampleSentences.push(tmp);
            });
        }
    });

    console.log(
        `Loaded ${sampleSentences.length} sample sentences from ${count}`,
        `grammar patterns of N${selectedLevel} level.`
    );

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

/* ********************************************************************** */
/*  SETTINGS                                                              */
/* ********************************************************************** */

function showSettings() {
    redisplayGrammarLessonList();
    settingsModal.style.display = "block";
}

function hideSettings() {
    settingsModal.style.display = "none";
    currIdx = 0;
    showCurr();
}

function selectGrammarLevel(level) {
    selectedLevel = level;
    redisplayGrammarLessonList();
}

function selectAllLessons() {
    grammarList.forEach((item) => {
        item.selected = true;
    });
    redisplayGrammarLessonList();
}

function deselectAllLessons() {
    grammarList.forEach((item) => {
        item.selected = false;
    });
    redisplayGrammarLessonList();
}

function selectRandomLessons() {
    if (grammarList.length <= 10) {
        selectAllLessons();
        return;
    }

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

    redisplayGrammarLessonList();
}

function saveSettings() {
    localStorage.setItem("selectedLevel", selectedLevel);
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

function redisplayGrammarLessonList() {
    refreshGrammarList();
    var htmlStr = '<table id="settingsTable">';
    grammarList.forEach((item) => {
        const id = `checkbox${item.num}`;
        const name = `${item.num}`;
        const style = item.selected ? `style="background-color: lightblue;"` : "";
        const checked = item.selected ? "checked" : "";

        var rowStr = `<tr id="settingsRow${item.num}" ${style} class="settingsRow noselect">`;
        rowStr += `<td><input type="checkbox" id="${id}" name="${name}" ${checked}/></td>`;
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
/*  CONTROLS                                                              */
/* ********************************************************************** */

function showCurr() {
    if (currIdx < 0 || currIdx >= sampleSentences.length) {
        divEng.hidden = true;
        btnPrev.disabled = true;
        btnNext.disabled = true;
        disableFlashcard(true);
        disableNihongo(true);
        console.log("Invalid index:", currIdx);
        return;
    }

    divEng.hidden = false;
    disableFlashcard(false);
    disableNihongo(false);

    hideNihongo();
    hideFlashcard();

    btnPrev.disabled = currIdx == 0;
    btnNext.disabled = currIdx == sampleSentences.length - 1;

    const item = sampleSentences[currIdx];
    divEng.innerHTML = item.meaning;
    divJap.innerHTML = item.main;
    divFuri.innerHTML = item.furi;

    if (item.flashcardUrl !== null) {
        btnFlashcard.disabled = false;
        imgFlashcard.src = item.flashcardUrl;
    } else {
        btnFlashcard.disabled = true;
    }
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

/* ********************************************************************** */
/*  NIHONGO BUTTON                                                        */
/* ********************************************************************** */

function showNihongo() {
    divJap.hidden = false;
    divFuri.hidden = false;
}

function hideNihongo() {
    divJap.hidden = true;
    divFuri.hidden = true;
}

function toggleNihongo() {
    if (divJap.hidden) {
        showNihongo();
    } else {
        hideNihongo();
    }
}

function disableNihongo(isDisabled) {
    if (isDisabled) {
        hideNihongo();
        btnNihongo.disabled = true;
    } else {
        btnNihongo.disabled = false;
    }
}

/* ********************************************************************** */
/*  FLASHCARD BUTTON                                                      */
/* ********************************************************************** */

function toggleFlashcard() {
    if (divImgWrap.hidden) {
        showFlashcard();
    } else {
        hideFlashcard();
    }
}

function showFlashcard() {
    divImgWrap.hidden = false;
}

function hideFlashcard() {
    divImgWrap.hidden = true;
}

function disableFlashcard(isDisabled) {
    if (isDisabled) {
        hideFlashcard();
        btnFlashcard.disabled = true;
    } else {
        btnFlashcard.disabled = false;
    }
}
