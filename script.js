// DOM Elements
const copyIcon = document.getElementById("color-icon");
const hexInput = document.getElementById("hex-input");

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

    updateDom(hex, luminesence)
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
const updateDom = (hex, lumi) => {
    // Luminesence is rounded to be either 0 or 1.
    let textColorClass = lumi ? "dark-text" : "light-text";

    // Update DOM with hex color as the background and the text color as determine by luminesence.
    document.body.style.backgroundColor = "#" + hex;
    hexInput.value = "#" + hex;
    hexInput.setAttribute("class", textColorClass);
    document.getElementById("color-header").setAttribute("class", textColorClass);
    copyIcon.setAttribute("class", `${textColorClass} fa-solid fa-copy`);
}

// Event Listener for Changing Color and Copying
document.getElementById("color-wrapper").addEventListener("click", (e) => {

    // Event Listener listens to the entire main element.
    // If a user clicks on the hex code or the copy icon, we don't want to change the color.
    if (e.target.id === "color-icon") {
        let classes = copyIcon.getAttribute("class");

        // If the hex has already been copied, prevent the copying from happening again.
        if (classes.search("fa-check") === -1) {
            navigator.clipboard.writeText(hexInput.value);
            copyIcon.setAttribute("class", classes.replace("fa-copy", "fa-check"));
        }

        return;
    } else if (e.target.id === "hex-input") {
        return;
    }

    // Generate a new hex code.
    hexCodeGeneration()
});

// Random Color on Load
hexCodeGeneration();