
const num1 = document.querySelector("#num1");
const num2 = document.querySelector("#num2");
const num3 = document.querySelector("#num3");
const num4 = document.querySelector("#num4");
const overlayText = document.querySelector(".overlay-text");
const custom = document.getElementById("customKarat");

const btn = document.getElementById("cal-btn");
const costBox = document.getElementById("costBox");


let lastFocusedInput = num3;

num4.style.filter = 'blur(3px)'


// helper functions to show/hide overlay
function showOverlay() {
  overlayText.style.display = 'inline-block';
}
function hideOverlay() {
  overlayText.style.display = 'none';
}



const buttonBlur = () => {
    lastFocusedInput = num4
    num4.style.filter = 'none'
    num3.style.filter = 'blur(3px)'
    hideOverlay();
}

const buttonBlur1 = () => {
    lastFocusedInput = num3
    num3.style.filter = 'none'
    num4.style.filter = 'blur(3px)'
    showOverlay();
    
}

num4.addEventListener('focus', buttonBlur)
num3.addEventListener('focus', buttonBlur1)





// Allow manual karat entry when selecting "Other"
num3.addEventListener("change", function () {
  if (this.value === "other") {
    const manualValue = parseFloat(prompt("Enter your custom karat value (e.g., 20.5):"));

    if (!isNaN(manualValue) && manualValue > 0 && manualValue <= 24) {

      // Check if option already exists
      let exists = false;
      for (let i = 0; i < this.options.length; i++) {
        if (parseFloat(this.options[i].value) === manualValue) {
          exists = true;
          this.value = this.options[i].value; // select existing option
          break;
        }
      }

      // If not exists, create new option
      if (!exists) {
        const newOption = document.createElement("option");
        const bracketMessage = ((manualValue / 24) * 100).toFixed(2);
        newOption.value = manualValue;
        newOption.textContent = `${manualValue}K (${bracketMessage}%)`;

        const otherOption = this.querySelector("option[value='other']");
        this.insertBefore(newOption, otherOption);

        this.value = manualValue; // select new option
      }

    } else {
      alert("Please enter a valid number between 1 and 24");
      this.value = ""; // reset select
    }
  }
});






// Allow manual Wastage entry when selecting "Other"
num4.addEventListener("change", function () {
  if (this.value === "other") {
    const userInput = prompt("Enter Karat and Wastage (e.g., 22,10)");

    // Validate input
    if (userInput) {
      const parts = userInput.split(",");
      if (parts.length !== 2) {
        alert("Please enter both Karat and Wastage separated by a comma.");
        this.value = "";
        return;
      }

      const [karat, wastage] = parts.map(v => parseFloat(v.trim()));

      if (
        !isNaN(karat) &&
        !isNaN(wastage) &&
        karat > 0 && karat <= 24 &&
        wastage >= 0 && wastage <= 100
      ) {
       
        const displayText = `${karat}K(${wastage}%Wastage)`;

        // Check if option already exists
        let exists = false;
        for (let opt of this.options) {
          if (opt.textContent === displayText) {
            exists = true;
            this.value = opt.value;
            break;
          }
        }

        // Add new option if not exists
        if (!exists) {
          const newOption = document.createElement("option");
          newOption.value = userInput;
          newOption.textContent = displayText;

          const otherOption = this.querySelector("option[value='other']");
          this.insertBefore(newOption, otherOption);
          this.value = userInput;
        }

      } else {
        alert("Please enter valid values (Karat 1–24, Wastage 0–99.99)");
        this.value = "";
      }
    } else {
      // user pressed cancel
      this.value = "";
    }
  }
});








// claculation logic

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const value1 = parseFloat(num1.value.replace(/,/g, "")) || 0;
    const value2 = parseFloat(num2.value) || 0;
    const value3 = parseFloat(num3.value) || 0;
    const value4 = parseFloat(num4.value) || 0;

    if (value4 > 100) {
        alert("Percentage value must be 99.99 or less");
        num4.value = "";
        num4.focus();
        return;
    }
    

  const value4Str = num4.value; // keep as string

  let factor = 0;

  if (lastFocusedInput === num3) {
    factor = value3 / 24;

  } else if (lastFocusedInput === num4) {
    value4Str.includes(",") 
    const [K, P] = value4Str.split(",").map(v => parseFloat(v.trim()));
    factor = (K / 24) - (P / 100); 
    
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
const citySelect = document.getElementById('citySelect');

let cityCosts = {};

const liveCost = async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/vasu-313/goldPricesByCities/refs/heads/main/goldPrice.json")
        const data = await response.json()
        // console.log(data.cost.Visakhapatnam)
        cityCosts = data.cost;

        //  Check if user already selected a city before
        const savedCity = localStorage.getItem("selectedCity");
        if (savedCity && cityCosts[savedCity]) {
          citySelect.value = savedCity; // show saved city in dropdown
          updateCost(savedCity)
        }
    }
    catch (error) {
        console.error(error)
        goldCost.innerText = "Loading.."
    }
}

liveCost();

citySelect.addEventListener('change', () => {
    const selectedCity = citySelect.value;
    // console.log(selectedCity)
    updateCost(selectedCity);
    localStorage.setItem("selectedCity", selectedCity);

})

 // Show gold cost
    function updateCost(city) {
      const cost = cityCosts[city];
      if (cost) {
        goldCost.innerText = `Live Cost: ₹${ Number(cost).toLocaleString('en-IN') }/g`;
        num1.type = "text"; 
        num1.value = parseFloat(cost).toLocaleString('en-IN');
      } else {
        goldCost.innerText = "Loading...";
      }
    }









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















// footer

 document.getElementById("current-year").textContent = new Date().getFullYear();

