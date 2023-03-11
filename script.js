// DOM Elements
const copyIcon = document.getElementById("color-icon");
const saveIcon = document.getElementById("save-icon");
const hexInput = document.getElementById("hex-input");
const colorHeader = document.getElementById("color-header");
const historyDiv = document.getElementById("history");
const historyHeader = document.getElementById("color-history");
const savedDiv = document.getElementById("saved");
const savedHeader = document.getElementById("color-saved");

// History and Saved Hex Arrays
let hexHistory = [];
let hexSaved = JSON.parse(localStorage.getItem("saved"));

// Functions to determine if on mobile or not. Stolen from detectmobilebrowsers.com.
window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
if (window.mobileAndTabletCheck()) {
    colorHeader.innerText = colorHeader.innerText.replace("Click", "Touch");
}

// Hex Code Generation Function
const hexCodeGeneration = () => {
    let hexArray = [];
    let rgb = [];

    // RGB Consists of three numeric values between 0-255.
    // For Each RGB value, change it to a 16 based numeric system for hex (#RRGGBB).
    // The first number will be the quotient of the random number divided by 16, the second will be the remainder.
    // Convert any two digit numbers to their respective letter.

    for (let i = 0; i < 3; i++) {
        // Generate random RGB number.
        let random = Math.floor(Math.random() * 255);

        // Determine two number hex entry for each random RGB number.
        let quotient = Math.floor(random / 16);
        let remainder = random % 16;

        // We still need RGB for luminesence calculation.
        rgb.push(random);

        // Convert two digit numbers to letters.
        hexArray.push(convertNum(quotient), convertNum(remainder))
    }

    const hex = hexArray.join("");

    // To determine the text color on the page, we need to find the luminesence.
    // To calculate luminescence, we find the weighted average of the RGB values.
    // Because Green and Red are lighter in the human eye, we give those values a higher weight.
    const lumi = Math.round(((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114)) / 255);

    updateDom(hex, lumi);
}

// Utility - Convert Two Digit Number Function
const convertNum = (num) => {
    if (num > 9) {
        const letterArray = ["A", "B", "C", "D", "E", "F"];
        return letterArray[num - 10];
    } else {
        return num;
    }
}

// Utility - Boolean if property value is in object array
const valueInObjectArray = (value, array, property) => {
    return array.filter(x => x[property] === value).length > 0;
}

// Update DOM Function
const updateDom = (hex, lumi) => {
    // Determine if hex code exists in History or Saved Arrays
    const isSave = valueInObjectArray(hex, hexSaved, "hex");
    const isHistory = valueInObjectArray(hex, hexHistory, "hex");

    // Luminesence is rounded to be either 0 or 1.
    const textColorClass = lumi ? "dark-text" : "light-text";

    // Update DOM
    document.body.style.backgroundColor = "#" + hex;
    hexInput.value = "#" + hex;
    hexInput.setAttribute("class", textColorClass);
    hexInput.setAttribute("lumi", lumi);
    colorHeader.setAttribute("class", textColorClass);

    // Update Icons
    copyIcon.setAttribute("class", `${textColorClass} fa-solid fa-copy`);
    saveIcon.setAttribute("class", `${textColorClass} fa-solid ${isSave ? "fa-times" : "fa-save"}`);

    // Conditionally Update History/Saved Elements
    if (!isHistory && !isSave) {

        // Add new color to history
        hexHistory.push({ hex, lumi });

        // Clear out any selected history/save elements.
        resetHighlight(historyDiv.childNodes);
        resetHighlight(savedDiv.childNodes);

        // Update new hex to history
        updateDomHistorySave(hex, lumi, historyDiv)
    }
}

// Update DOM for History/Save Function
const updateDomHistorySave = (hex, lumi, div) => {
    // Create element
    const colorSquare = document.createElement("div");

    // Update Element
    colorSquare.setAttribute("style", `background-color: #${hex}`);
    colorSquare.setAttribute("class", "history-element");
    colorSquare.setAttribute("alt", hex);

    // Create Element Event Listener
    colorSquare.addEventListener("click", () => {
        resetHighlight(div.childNodes);
        colorSquare.setAttribute("class", "history-element-highlighted");
        // Retrigger process to udpate background
        updateDom(hex, lumi);
    });

    // Add new element to page
    div.appendChild(colorSquare);

    // Remove element if over 10
    if (div.childNodes.length > 10) {
        div.removeChild(div.firstChild);
    }
}

// Reset highlighting on the history/saved elements.
const resetHighlight = (elements) => {
    for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute("class", "history-element");
    }
}

// Event Listener Function for Navbar
const navEventListen = (navEl, navHeader) => {
    const classes = navEl.getAttribute("class");

    // If shown, hide. | If hidden, show.
    if (classes.search("display-none") !== -1) {
        navEl.setAttribute("class", "bottom-header");
        navHeader.setAttribute("style", "color: #ff6347");

        // Also update the other nav element to be hidden.
        if (navEl.getAttribute("id") === "saved") {
            historyDiv.setAttribute("class", "bottom-header display-none");
            historyHeader.setAttribute("style", "");
        } else {
            savedDiv.setAttribute("class", "bottom-header display-none");
            savedHeader.setAttribute("style", "");
        }

    } else {
        navEl.setAttribute("class", "bottom-header display-none");
        navHeader.setAttribute("style", "");
    }
}

// Event Listeners
document.getElementById("color-wrapper").addEventListener("click", (e) => {
    // Get values from HTML elements
    const classes = e.target.getAttribute("class");
    const hex = hexInput.value.replace("#", "");

    if (e.target.getAttribute("id") === "color-wrapper") {
        hexCodeGeneration();
    } else if (classes.search("fa-copy") !== -1) {
        copyIcon.setAttribute("class", classes.replace("fa-copy", "fa-check"));
        return navigator.clipboard.writeText(hexInput.value);
    } else if (classes.search("fa-save") !== -1) {
        const lumi = hexInput.getAttribute("lumi");

        // Add new hex and save to local storage
        hexSaved.push({ hex, lumi });
        localStorage.setItem("saved", JSON.stringify(hexSaved));

        // Update DOM for Save
        updateDomHistorySave(hex, lumi, savedDiv);
        saveIcon.setAttribute("class", classes.replace("fa-save", "fa-check"));

    } else if (classes.search("fa-times") !== -1) {

        // Filter out current hex
        hexSaved = hexSaved.filter(x => x.hex !== hex);
        localStorage.setItem("saved", JSON.stringify(hexSaved));

        // Remove from DOM
        const savedChildren = savedDiv.childNodes;
        for (let i = 0; i < savedChildren.length; i++) {
            if (savedChildren[i].getAttribute("alt") === hex) {
                savedDiv.removeChild(savedChildren[i])
            }
        }

        // Rerun color generation
        hexCodeGeneration();

    } else {
        return;
    }

});
historyHeader.addEventListener("click", () => {
    return navEventListen(historyDiv, historyHeader);
});
savedHeader.addEventListener("click", () => {
    return navEventListen(savedDiv, savedHeader);
});

// On Load Functions
hexCodeGeneration();
if (hexSaved) {
    for (let i = 0; i < hexSaved.length; i++) {
        updateDomHistorySave(hexSaved[i].hex, hexSaved[i].lumi, savedDiv)
    }
}