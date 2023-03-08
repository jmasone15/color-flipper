const hexCodeGeneration = () => {
    const hex = []
    for (let i = 0; i < 3; i++) {
        let random = Math.floor(Math.random() * 255);
        let quotient = Math.floor(random / 16);
        let remainder = random % 16;

        hex.push(convertNum(quotient), convertNum(remainder))
    }

    console.log(hex.join(""));
    return hex.join("");
}

const convertNum = (num) => {
    if (num > 9) {
        const letterArray = ["A", "B", "C", "D", "E", "F"];
        return letterArray[num - 10];
    } else {
        return num;
    }
}

const setHexCode = () => {
    let hex = hexCodeGeneration();
    document.body.style.backgroundColor = "#" + hex;
    document.getElementById("hex-input").innerText = "#" + hex;
    
    let textColorClass = hex[0] < 7 ? "dark-text" : "light-text";

    document.getElementById("color-header").setAttribute("class", textColorClass);
    document.getElementById("hex-input").setAttribute("class", textColorClass);
    document.getElementById("color-icon").setAttribute("class", textColorClass);
}

document.getElementById("color-wrapper").addEventListener("click", setHexCode);
setHexCode();