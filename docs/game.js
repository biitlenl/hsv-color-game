const colors = [
    {"hex": "#ff0000", "name": "Hatred is in your walls."},
    {"hex": "#ef4444", "name": "literally red"},
    {"hex": "#334155", "name": "darkish blue-indigo"},
    {"hex": "#dc2626", "name": "only good red"},
    {"hex": "#b91c1c", "name": "90s web dev red"},
    {"hex": "#991b1b", "name": "eww red"},
    {"hex": "#7f1d1d", "name": "these colors suck"},
    {"hex": "#fb923c", "name": "annoying orange"},
    {"hex": "#f97316", "name": "not orange"},
    {"hex": "#ea580c", "name": "1 brown 2 orange"},
    {"hex": "#c2410c", "name": "i'm raging."},
    {"hex": "#9a3412", "name": "toilet's clogged"},
    {"hex": "#fbbf24", "name": "b"},
    {"hex": "#f59e0b", "name": "I can't believe it's not orange!"},
    {"hex": "#d97706", "name": "not again"},
    {"hex": "#fde047", "name": "banana (i'm eating one)"},
    {"hex": "#facc15", "name": "I'M SO LUCKY!"},
    {"hex": "#eab308", "name": "Okay don't do this to me"},
    {"hex": "#a3e635", "name": "green apple (i'm eating one)"},
    {"hex": "#84cc16", "name": "hello"},
    {"hex": "#65a30d", "name": "I'm in your walls."},
    {"hex": "#4ade80", "name": "green turquoise"},
    {"hex": "#22c55e", "name": "Good enough"},
    {"hex": "#e11d48", "name": "red but pink"},
    {"hex": "#8b5cf6", "name": "not violet"}
];

const cards = document.querySelectorAll("#card");
const text = document.getElementById("score");

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    let l = (min + max) / 2;
    let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return [h * 60, s, l];
}

const hexToHsl = (hex) => {
    _ = hexToRgb(hex);
    return rgbToHsl(_.r, _.g, _.b);
};

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const goScore = document.getElementById("gameover-score");
const nameText = document.getElementById("color-name");
const colorBlock = document.getElementById("color-block");
const goHistory = document.getElementById("gameover-history");

const gamePage = document.getElementById("game");
const overPage = document.getElementById("over");

let score = 0;
let colorName = "literally red";

let colorHex = "#ef4444";

let allowedToScore = true;

let colorHistory = "";

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function randomizeColor() {
    const index = Math.round(getRandomArbitrary(0, 25));
    const currentColor = colors[index];
    cards.forEach((card) => {
        card.dataset.odd = false;
        card.style.backgroundColor = currentColor.hex;

        colorName = currentColor.name;
        colorHex = currentColor.hex;
    });
    setOddOneOut();
}

function randomizeHsl(hsl) {
    let adjustLight = (getRandomArbitrary(0, 1000) > 500) ? true : false;
    let canUseNegative = (hsl[0] - 1 < 0) ? false : true;
    let canUsePositiveH = (hsl[0] + 1 > 360) ? false : true;
    let canUsePositiveL = (hsl[2] + 1 > 100) ? false : true;

    let h = hsl;

    let removal = (canUseNegative == true)
        ? getRandomArbitrary(-8, -3)
        : getRandomArbitrary(2, 8);

    h = (adjustLight == true)
        ? [hsl[0] + removal, hsl[1], hsl[2] + removal]
        : [hsl[0] + removal, hsl[1], hsl[2]];

    return h;
}

function setOddOneOut() {
    const index = Math.round(getRandomArbitrary(0, 8));
    let hsl = hexToHsl(colorHex);

    hsl = [hsl[0], hsl[1] * 100, hsl[2] * 100];
    hsl = [Math.round(hsl[0]), Math.round(hsl[1]), Math.round(hsl[2])];

    const randomHsl = randomizeHsl(hsl);
    const hslCss = "hsl(" + randomHsl[0] + " " + randomHsl[1] + "% " +
        randomHsl[2] + "%);";

    cards.item(index).dataset.odd = true;
    cards.item(index).style.backgroundColor = hslToHex(randomHsl[0], randomHsl[1], randomHsl[2]);
    console.log(cards.item(index));
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

console.log(
    "%cHey! If you steal this website, I will steal your organs. This is a threat.",
    "font-size:50px;font-weight:500;font-family:sans-serif",
);
cards.forEach((card) => {
    card.addEventListener("click", function () {
        console.log(card);
        console.log("this card is ", card.dataset.odd);
        if (card.dataset.odd == "false") {
            if(allowedToScore == true) { colorHistory = colorName + " 😵 " + colorHistory; };
            allowedToScore = false;
            goHistory.innerText = colorHistory;
            colorBlock.style.backgroundColor = colorHex;
            gamePage.classList.add("animatedShake");
            sleep(750).then(() => {
                nameText.innerText = colorName;
                goScore.innerText = "score: " + score;
                gamePage.style.display = "none";
                overPage.style.display = "flex";
            });
        } else {
            if (allowedToScore == true) {
                colorHistory = (colorHistory != "")
                    ? colorName + " 🤜 " + colorHistory
                    : colorHistory = colorName;
                score++;
                randomizeColor();
            }
            text.innerText = "score: " + score;
        }
    });
});

function share() {
    const gameoverString = "my hsv.beta.biitle.nl score: " + score + "\n" +
        colorHistory;
    navigator.clipboard.writeText(gameoverString);
    alert(
        "Copied!\n\n" +
            gameoverString +
            "\n\nShare with your friends to help support our game :D",
    );
}
