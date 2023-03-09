// DOM Elements
const copyIcon = document.getElementById("color-icon");
const saveIcon = document.getElementById("save-icon");
const hexInput = document.getElementById("hex-input");
const colorHeader = document.getElementById("color-header");
const historyDiv = document.getElementById("history");
const historyHeader = document.getElementById("color-history");
const savedDiv = document.getElementById("saved");
const savedHeader = document.getElementById("color-saved");

// Hex Code History
let hexHistoryCount = 0;
const existingSaved = JSON.parse(localStorage.getItem("saved"));

// Function to determine if on mobile or not. Stolen from detectmobilebrowsers.com.
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
    const luminesence = Math.round(((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114)) / 255);

    hexHistoryCount++;
    updateDom(hex, luminesence, true, false);
}

// Convert Two Digit Number Function
const convertNum = (num) => {
    if (num > 9) {
        const letterArray = ["A", "B", "C", "D", "E", "F"];
        return letterArray[num - 10];
    } else {
        return num;
    }
}

// Populate DOM with Hex Function
const updateDom = (hex, lumi, newHex, isSave) => {
    // Luminesence is rounded to be either 0 or 1.
    let textColorClass = lumi ? "dark-text" : "light-text";

    // Update DOM with hex color as the background and the text color as determine by luminesence.
    document.body.style.backgroundColor = "#" + hex;
    hexInput.value = "#" + hex;
    hexInput.setAttribute("class", textColorClass);
    hexInput.setAttribute("lumi", lumi);
    colorHeader.setAttribute("class", textColorClass);
    copyIcon.setAttribute("class", `${textColorClass} fa-solid fa-copy`);
    if (isSave) {
        saveIcon.setAttribute("class", `${textColorClass} fa-solid fa-times`);
    } else {
        saveIcon.setAttribute("class", `${textColorClass} fa-solid fa-save`);
    }

    let children = historyDiv.childNodes;
    let savedChildren = savedDiv.childNodes;

    if (newHex) {
        for (let i = 0; i < children.length; i++) {
            children[i].setAttribute("class", "history-element");
        }
        for (let i = 0; i < savedChildren.length; i++) {
            savedChildren[i].setAttribute("class", "history-element");
        }

        let colorSquare = document.createElement("div");
        colorSquare.setAttribute("alt", `#${hex}`);
        colorSquare.setAttribute("style", `background-color: #${hex}`);
        colorSquare.setAttribute("class", "history-element");
        colorSquare.addEventListener("click", () => {
            for (let i = 0; i < children.length; i++) {
                children[i].setAttribute("class", "history-element");
            }
            colorSquare.setAttribute("class", "history-element-highlighted");
            updateDom(hex, lumi, false, false);
        });
        historyDiv.appendChild(colorSquare);

        if (hexHistoryCount > 9) {
            historyDiv.removeChild(historyDiv.firstChild)
        }
    }
}

const updateSaved = (hex, lumi) => {
    let existingSaved = JSON.parse(localStorage.getItem("saved"));

    if (!existingSaved) {
        existingSaved = []
    }
    if (existingSaved.length === 10) {
        savedDiv.removeChild(savedDiv.firstChild);
        existingSaved.shift();
    }

    existingSaved.push({hex, lumi});
    localStorage.setItem("saved", JSON.stringify(existingSaved));

    updateSavedDom(hex, lumi);
}

const updateSavedDom = (hex, lumi) => {
    let colorSquare = document.createElement("div");
    const children = savedDiv.childNodes;

    colorSquare.setAttribute("alt", `#${hex}`);
    colorSquare.setAttribute("style", `background-color: #${hex}`);
    colorSquare.setAttribute("class", "history-element");    
    colorSquare.addEventListener("click", () => {
        for (let i = 0; i < children.length; i++) {
            children[i].setAttribute("class", "history-element");
        }
        colorSquare.setAttribute("class", "history-element-highlighted");
        updateDom(hex, lumi, false, true);
    });
    savedDiv.appendChild(colorSquare);
}

const iconClick = (icon, isCopy) => {
    let classes = icon.getAttribute("class");

    // If the hex has already been copied, prevent the copying from happening again.
    if (classes.search("fa-check") === -1) {
        if (isCopy) {
            navigator.clipboard.writeText(hexInput.value);
        } else {
            updateSaved(hexInput.value.replace("#", ""), hexInput.getAttribute("lumi"));
        }
        icon.setAttribute("class", classes.replace(isCopy ? "fa-copy" : "fa-save", "fa-check"));
    }

    return;
}

// Event Listener for Changing Color and Copying
document.getElementById("color-wrapper").addEventListener("click", (e) => {

    // Event Listener listens to the entire main element.
    // If a user clicks on the hex code or the copy icon, we don't want to change the color.
    if (e.target.id === "color-icon") {
        return iconClick(copyIcon, true);
    }
    if (e.target.id === "save-icon") {
        if (e.target.getAttribute("class").search("fa-times") === -1) {
            return iconClick(saveIcon, false);
        } else {
            let saved = JSON.parse(localStorage.getItem("saved")).filter(x => x.hex !== hexInput.value.replace("#", ""));
            localStorage.setItem("saved", JSON.stringify(saved));
            if (saved) {
                const savedChildren = savedDiv.childNodes;
                for (let i = 0; i < savedChildren.length; i++) {
                    if (savedChildren[i].getAttribute("alt") === hexInput.value) {
                        savedDiv.removeChild(savedChildren[i])
                    }
                }
            }
            hexCodeGeneration();
        }
    }
    if (e.target.id === "hex-input") {
        return;
    }

    // Generate a new hex code.
    hexCodeGeneration()
});

historyHeader.addEventListener("click", () => {
    const classes = historyDiv.getAttribute("class");

    if (classes.search("display-none") !== -1) {
        historyDiv.setAttribute("class", "bottom-header");
        historyHeader.setAttribute("style", "color: #ff6347");
    } else {
        historyDiv.setAttribute("class", "bottom-header display-none");
        historyHeader.setAttribute("style", "")
    }
});

savedHeader.addEventListener("click", () => {
    const classes = savedDiv.getAttribute("class");

    if (classes.search("display-none") !== -1) {
        savedDiv.setAttribute("class", "bottom-header");
        savedHeader.setAttribute("style", "color: #ff6347");
    } else {
        savedDiv.setAttribute("class", "bottom-header display-none");
        savedHeader.setAttribute("style", "")
    }
});

// Random Color on Load
hexCodeGeneration();

if (existingSaved) {
    for (let i = 0; i < existingSaved.length; i++) {
        updateSavedDom(existingSaved[i].hex, existingSaved[i].lumi)
    }
}