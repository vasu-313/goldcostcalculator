
const num1 = document.querySelector("#num1");
const num2 = document.querySelector("#num2");
const num3 = document.querySelector("#num3");
const num4 = document.querySelector("#num4");
const overlayText = document.querySelector(".overlay-text");


const btn = document.getElementById("cal-btn");
const costBox = document.getElementById("costBox");


let lastFocusedInput = num3;

num4.style.filter = 'blur(3px)'

const buttonBlur = () => {
    lastFocusedInput = num4
    num4.style.filter = 'none'
    overlayText.style.display = 'none'
    num3.style.filter = 'blur(3px)'
}

const buttonBlur1 = () => {
    lastFocusedInput = num3
    num3.style.filter = 'none'
    num4.style.filter = 'blur(3px)'
    overlayText.style.display = 'block'
}

num4.addEventListener('focus', buttonBlur)
num3.addEventListener('focus', buttonBlur1)

// claculation logic

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const value1 = parseFloat(num1.value) || 0;
    const value2 = parseFloat(num2.value) || 0;
    const value3 = parseFloat(num3.value) || 0;
    const value4 = parseFloat(num4.value) || 0;

    if (value4 > 100) {
        alert("❗ Percentage value must be 99.99 or less");
        num4.value = "";
        num4.focus();
        return;
    }

    let factor = 0;
    if (lastFocusedInput === num3) {
        factor = value3 / 24;
    } else if (lastFocusedInput === num4) {
        factor = value4 / 100;
    }

    const cost = value1 * value2 * factor;
    costBox.value = cost.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

})

// Live cost

const goldCost = document.getElementById('gold-live-cost');
const stateSelect = document.getElementById('stateSelect');

let stateCosts = {};

const liveCost = async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/vasu-313/goldPricesByCities/refs/heads/main/goldPrice.json")
        const data = await response.json()
        // console.log(data.cost.Visakhapatnam)
        stateCosts = data.cost;
    }
    catch (error) {
        console.error(error)
        goldCost.innerText = "Loading.."
    }
}

liveCost();

stateSelect.addEventListener('change', () => {
    const selectedState = stateSelect.value;
    // console.log(selectedState)
    const cost = stateCosts[selectedState];
    // console.log(cost)

    if (cost) {
        goldCost.innerText = `Live Cost: ₹${cost}/gram`;
        num1.value = cost
    } else { 
        goldCost.innerText = "Loading...";
    }
})








// Mobile Menu Toggle
const menuIcon = document.getElementById("menu-icon");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-menu");

menuIcon.addEventListener("click", () => {
    sideMenu.classList.add("active");
});


closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("active");
});

window.closeMenu = () => {
    sideMenu.classList.remove("active");
}