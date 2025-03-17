document.addEventListener('DOMContentLoaded', async function () {

    setTimeout(() => {
        document.getElementById('mainload').style.display = 'none';
        document.getElementById('airdropSection').classList.add('active');
        document.getElementById('nav').classList.remove('hidenav');
    }, 2000)

});
const suc = document.getElementById('suc');
const dec = document.getElementById('dec');



let secretKey;
let encryptionKey;
let maxEnergy;
let energyIncrementRate = 3;
let energyIncreaseInterval = 1000;
let scorePerClick;
let tokenCount;
let boostsLimitTtime;
let usermainlevel
let userId = document.getElementById('user__id').value;
let pendingUpdates = false;
let useBoosts = false


function fetchData() {
    const url = `/data?user=${encodeURIComponent(userId)}`;

    fetch(url, {
        method: 'GET', headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(resp => {
            if (resp && resp.data) {
                tokenCount = resp.data.count;
                maxEnergy = resp.data.energy;
                scorePerClick = resp.data.tap;
                boostsLimitTtime = resp.data.bostlimit;
                energyIncrementRate = resp.data.energyIncrementRate;
                secretKey = resp.data.secret_key;
                usermainlevel = resp.data.usermainlevel;
                energyIncreaseInterval = resp.data.energyIncreaseInterval;

                encryptionKey = CryptoJS.SHA256(`${secretKey}`).toString();


                const storedData = loadDataFromLocalStorage('userData');
                calculateEnergy(storedData);  // Calculate energy based on time passed
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function calculateEnergy(storedData) {
    const {energy, lastUpdate} = storedData;
    const currentTime = Date.now();
    const timePassed = (currentTime - lastUpdate) / 1000; // Time passed in seconds
    const energyGained = Math.floor(timePassed * energyIncrementRate); // Energy gained since last update
    const updatedEnergy = Math.min(energy + energyGained, maxEnergy); // Ensure energy doesn't exceed max

    updateDisplay(updatedEnergy, tokenCount);
    saveDataToLocalStorage('userData', {energy: updatedEnergy, score: tokenCount, lastUpdate: currentTime});
}

function loadDataFromLocalStorage(key) {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        if (decryptedData) {
            return decryptedData;
        }
    }
    // Initialize data if not present
    const initialData = {energy: maxEnergy, score: tokenCount, lastUpdate: Date.now()};
    saveDataToLocalStorage(key, initialData);
    return initialData;
}

function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

function decryptData(cipherText) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedData) {
            return JSON.parse(decryptedData);
        }
        return null;
    } catch (e) {
        return null;
    }
}

function saveDataToLocalStorage(key, data) {
    const encryptedData = encryptData(data);
    localStorage.setItem(key, encryptedData);
}

// function updateDisplay(energy, score) {
//     document.getElementById("energy_count").textContent = energy;
//     document.getElementById("tap-count").textContent = score;
// }


function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US');
}

function updateDisplay(energy, score) {
    document.getElementById("energy_count").textContent = energy;
    document.getElementById("tap-count").textContent = formatNumberWithCommas(score);
}



function handleEnergyRegeneration() {
    const storedData = loadDataFromLocalStorage('userData');
    let {energy} = storedData;
    const currentTime = Date.now();

    energy = Math.min(energy + energyIncrementRate, maxEnergy);

    updateDisplay(energy, tokenCount);
    saveDataToLocalStorage('userData', {energy, score: tokenCount, lastUpdate: currentTime});
}



function handleButtonClick(event) {
    // Ensure event is defined
    if (!event) {
        console.error("Event object is missing.");
        return;
    }

    const storedData = loadDataFromLocalStorage('userData');
    let {energy, score} = storedData;
    const energyCostPerClick = scorePerClick;

    if (useBoosts) {
        score += scorePerClick;
        tokenCount = score;

        saveDataToLocalStorage('userData', {energy, score: tokenCount, lastUpdate: Date.now()});

        pendingUpdates = true;
        updateDisplay(energy, tokenCount);

        handleTouchOrClickEvent(event); // Pass event to the handler
    } else {
        if (energy >= energyCostPerClick) {
            energy -= energyCostPerClick;
            score += scorePerClick;
            tokenCount = score;

            saveDataToLocalStorage('userData', {energy, score: tokenCount, lastUpdate: Date.now()});

            pendingUpdates = true;
            updateDisplay(energy, tokenCount);

            handleTouchOrClickEvent(event); // Pass event to the handler
        }
    }
}

function handleTouchOrClickEvent(event) {
    // Ensure event is defined and has a valid type
    if (!event || !event.type) {
        console.error("Event object is missing or does not have a type property.");
        return;
    }

    // Handle touch and mouse events
    const touches = event.touches ? event.touches : [{clientX: event.clientX, clientY: event.clientY}];

    for (let touch of touches) {
        let x = touch.clientX;
        let y = touch.clientY;

        if (typeof x === 'number' && typeof y === 'number') {
            if (usermainlevel <= 4) {
                throwCoinsWallet(x, y);
            } else if (usermainlevel <= 8) {
                dropCoinstree(x, y);
            } else if (usermainlevel <= 12) {
                disperseCoins(x, y);
            } else if (usermainlevel <= 16) {
                throwCoins(x, y);
            } else if (usermainlevel <= 20) {
                safebox(x, y);
            }
        }
    }
}


function throwCoinsWallet(x, y) {
    const level = scorePerClick;
    let coinsToCreate = useBoosts ? 1 : level;

    // Create a text element to show the number of coins
    const textElement = document.createElement('div');
    textElement.textContent = `+${level}`;
    textElement.className = 'coin-text';
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.fontSize = '24px';
    textElement.style.color = 'white';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = 1000; // Ensure it appears above other elements

    // Add the text element to the body
    document.body.appendChild(textElement);

    // Animate the text to float up and fade out
    requestAnimationFrame(() => {
        textElement.style.transform = 'translateY(-100px)';
        textElement.style.opacity = '0';
    });

    // Remove the text element after the animation
    setTimeout(() => {
        document.body.removeChild(textElement);
    }, 1000); // Match this with the CSS transition duration

    // Now create the coins
    for (let i = 0; i < coinsToCreate; i++) {
        const coin = document.createElement('img');
        coin.src = 'static/bags of level/1-min.png';
        coin.alt = 'Coin';
        coin.className = 'walletcoin';

        // Set the initial position of the coin
        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.pointerEvents = 'none';

        // Add the new coin to the body
        document.body.appendChild(coin);

        // Generate random direction for dispersion
        const randomX = Math.random() * 200 - 100; // Range: -100 to 100
        const randomY = Math.random() * 200 - 100; // Range: -100 to 100

        // Animate the coin dispersion
        requestAnimationFrame(() => {
            coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(360deg)`;
            coin.style.opacity = 0;
        });

        // Remove the coin from the DOM after the animation
        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000); // Match this with the CSS transition duration
    }
}



function dropCoinstree(x, y) {
    const level = scorePerClick;
    let coinsToCreate = useBoosts ? 1 : level;

    // Create a text element to show the number of coins
    const textElement = document.createElement('div');
    textElement.textContent = `+${level}`;
    textElement.className = 'coin-text';
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.fontSize = '24px';
    textElement.style.color = 'white';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = 1000;

    // Add the text element to the body
    document.body.appendChild(textElement);

    // Animate the text
    requestAnimationFrame(() => {
        textElement.style.transform = 'translateY(-30px)';
        textElement.style.opacity = '0';
    });

    // Remove the text element after the animation
    setTimeout(() => {
        document.body.removeChild(textElement);
    }, 1000);

    // Create coins
    for (let i = 0; i < coinsToCreate; i++) {
        const coin = document.createElement('img');
        coin.src = 'static/bags of level/1-min.png';
        coin.alt = 'Coin';
        coin.className = 'treecoin';

        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.pointerEvents = 'none';

        document.body.appendChild(coin);

        const randomY = Math.random() * 100 + 120; // Fall downwards

        requestAnimationFrame(() => {
            coin.style.transform = `translateY(${randomY}px)`;
            coin.style.opacity = 0;
        });

        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000);
    }
}





function disperseCoins(x,y) {
    const bagImage = document.querySelector('#tap-image');
    const bagRect = bagImage.getBoundingClientRect();

    const level = scorePerClick;
    let coinsToCreate = useBoosts ? 1 : level;
    const startX = bagRect.left + (bagRect.width / 2.5); // Horizontal center of the bag
    const startY = bagRect.top; // Top of the bag

    // Create a text element to show the number of coins
    const textElement = document.createElement('div');
    textElement.textContent = `+${level}`;
    textElement.className = 'coin-text';
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.fontSize = '24px';
    textElement.style.color = 'white';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = 1000;

    document.body.appendChild(textElement);

    requestAnimationFrame(() => {
        textElement.style.transform = 'translateY(-30px)';
        textElement.style.opacity = '0';
    });

    setTimeout(() => {
        document.body.removeChild(textElement);
    }, 1000);

    for (let i = 0; i < coinsToCreate; i++) {
        const coin = document.createElement('img');
        coin.src = 'static/bags of level/1-min.png';
        coin.alt = 'Coin';
        coin.className = 'coinbag';

         const coinRect = coin.getBoundingClientRect();
        const coinWidth = coinRect.width;
        // Set the initial position of the coin to the top of the bag
        coin.style.position = 'absolute';
        coin.style.left = `${startX - (coinWidth / 2)}px`; // Adjust to center the coin
        coin.style.top = `${startY}px`;
        coin.style.pointerEvents = 'none';

        document.body.appendChild(coin);

        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 100 + 110;

        setTimeout(() => {
            coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(360deg)`;
            coin.style.opacity = 0;
        }, 10);

        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000);
    }
}





function throwCoins(x, y) {
    const level = scorePerClick;
    let coinsToCreate = useBoosts ? 1 : level;

    // Create a text element to show the number of coins
    const textElement = document.createElement('div');
    textElement.textContent = `+${level}`;
    textElement.className = 'coin-text';
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.fontSize = '24px';
    textElement.style.color = 'white';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = 1000;

    document.body.appendChild(textElement);

    requestAnimationFrame(() => {
        textElement.style.transform = 'translateY(-30px)';
        textElement.style.opacity = '0';
    });

    setTimeout(() => {
        document.body.removeChild(textElement);
    }, 1000);

    for (let i = 0; i < coinsToCreate; i++) {
        const coin = document.createElement('img');
        coin.src = 'static/bags of level/1-min.png';
        coin.alt = 'Coin';
        coin.className = 'coinbox';

        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.pointerEvents = 'none';

        document.body.appendChild(coin);

        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;

        requestAnimationFrame(() => {
            coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(360deg)`;
            coin.style.opacity = 0;
        });

        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000);
    }
}




function safebox(x, y) {
    const level = scorePerClick;
    let coinsToCreate = useBoosts ? 1 : level;

    // Create a text element to show the number of coins
    const textElement = document.createElement('div');
    textElement.textContent = `+${level}`;
    textElement.className = 'coin-text';
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.fontSize = '24px';
    textElement.style.color = 'white';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = 1000;

    document.body.appendChild(textElement);

    requestAnimationFrame(() => {
        textElement.style.transform = 'translateY(-30px)';
        textElement.style.opacity = '0';
    });

    setTimeout(() => {
        document.body.removeChild(textElement);
    }, 1000);

    for (let i = 0; i < coinsToCreate; i++) {
        const coin = document.createElement('img');
        coin.src = 'static/img/coin.png';
        coin.alt = 'Coin';
        coin.className = 'coinsafe';

        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.pointerEvents = 'none';

        document.body.appendChild(coin);

        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;

        requestAnimationFrame(() => {
            coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(360deg)`;
            coin.style.opacity = 0;
        });

        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000);
    }
}





function sendTokensToServer() {

    const storedData = decryptData(localStorage.getItem('userData'));
    const tokenCount = storedData ? storedData.score : null;

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    const dataToSend = {
        tokens: tokenCount, user_id: userId, secret: secretKey,

    };

    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken,  // Include CSRF token in headers
        'Content-Type': 'application/json',
    };


    let url = '/save';
    const data = JSON.stringify(dataToSend);

    fetch(url, {
        method: 'POST', credentials: 'include', headers: headers, body: data, keepalive: true,
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            pendingUpdates = true;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



setInterval(handleEnergyRegeneration, energyIncreaseInterval);


document.getElementById("tap-image").addEventListener("click", handleButtonClick);
document.getElementById("tap-image").addEventListener("touchstart", handleButtonClick);



let interaction;
const blueeffectremove = document.getElementById('tap-image')


function handleInteraction() {
    clearTimeout(interaction);
    interaction = setTimeout(sendTokensToServer, 300);

}

blueeffectremove.addEventListener('click', handleInteraction);
blueeffectremove.addEventListener('touchstart', handleInteraction);


setInterval(handleEnergyRegeneration, energyIncreaseInterval);

fetchData()


// modals
document.addEventListener("DOMContentLoaded", function () {
    // First Modal (User Section Navigation)
    function initUserSectionNavigation() {
        const divs = document.querySelectorAll('.user_top_data div');
        const userSections = document.querySelectorAll('.user-section');
        const airdropSection = document.getElementById('airdropSection');
        const userInfoCon = document.querySelector('.user_info_con');
        const boosts = document.getElementById('boosts'); // Assuming this is the correct reference to the boosts element

        divs.forEach(div => {
            div.addEventListener('click', function () {
                // Remove 'active_nav' class from all divs
                divs.forEach(d => d.classList.remove('active_nav'));
                // Add 'active_nav' class to the clicked div
                div.classList.add('active_nav');


                // Hide all user sections
                userSections.forEach(section => section.classList.remove('active_nav'));

                // Show the corresponding user section
                const sectionId = div.getAttribute('data-section');
                const section = document.querySelector(`#${sectionId}_user`);
                if (section) {
                    section.classList.add('active_nav');
                }


                // Show user_info_con and hide airdropSection when any user-section is clicked
                if (userInfoCon && userInfoCon.classList.contains('hidden')) {
                    userInfoCon.classList.remove('hidden');
                }

                if (airdropSection && !airdropSection.classList.contains('hidden')) {
                    airdropSection.classList.add('hidden');
                }

                // Check if the clicked section is "erver"
                if (sectionId === 'erver') {
                    // Add the class if it doesn't already have it
                    if (!boosts.classList.contains('hidden')) {
                        boosts.classList.add('hidden');
                    }
                }
            });
        });


        const airdropDivs = document.querySelectorAll('.vector-parent div');
        airdropDivs.forEach(div => {

            div.addEventListener('click', function () {
                // Remove 'active' and 'hidden' classes from all divs
                airdropDivs.forEach(d => d.classList.remove('active'));
                // Add 'active' class to the clicked div
                div.classList.add('active');


                // Hide all user sections and user_info_con
                userSections.forEach(section => section.classList.remove('active_nav'));
                if (userInfoCon && !userInfoCon.classList.contains('hidden')) {
                    userInfoCon.classList.add('hidden');
                }

                // Show the corresponding section
                const sectionId = div.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                }

                // Show airdropSection if it was hidden
                if (airdropSection && airdropSection.classList.contains('hidden')) {
                    airdropSection.classList.remove('hidden');
                }

                // Check if the clicked airdrop section is "erver"
                if (sectionId === 'erver') {
                    // Add the class if it doesn't already have it
                    if (!boosts.classList.contains('increase_token_hide')) {
                        boosts.classList.add('increase_token_hide');
                    }
                }
            });
        });
    }

    // Second Modal (Main Navigation)
    function initMainNavigation() {
        const navDivs = document.querySelectorAll('.list');
        const sections = document.querySelectorAll('.content-section');
        const userInfoCon = document.querySelector('.user_info_con'); // Reference to user_info_con

        navDivs.forEach(div => {
            div.addEventListener('click', function () {
                // Remove 'active' and 'hidden' classes from all nav items
                navDivs.forEach(d => d.classList.remove('active'));
                div.classList.add('active');
                if (!boosts.classList.contains('hidden')) {
                    boosts.classList.add('hidden');

                }
                // Hide all sections
                sections.forEach(section => section.classList.remove('active', 'hidden'));

                // Show the corresponding section
                const sectionId = div.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                }

                // Hide user_info_con when any navigation item is clicked
                if (userInfoCon && !userInfoCon.classList.contains('hidden')) {
                    userInfoCon.classList.add('hidden');
                }
            });
        });
    }

    // Initialize both modals
    initUserSectionNavigation();
    initMainNavigation();
});


window.onload = function () {

    document.getElementById('airdropSection').classList.add('active')
    document.getElementById('nav').style.display = 'block'


}


// window.addEventListener('click',closePopup)
function closePopup() {
    const popup = document.getElementById('customPopup');
    const overlay = document.getElementById('popupOverlay');
    popup.classList.remove('popup-show');
    overlay.classList.remove('popup-overlay-show');
}


const top_data_daily = document.getElementById('hideit')
const luckycwheel = document.getElementById('luckycwheel')
const dailybonus_user_button = document.getElementById('dailybonus_user_button')
const homepage = document.getElementById('homepage')
const profits_con_user = document.getElementById('profits_con_user')
const profit_user = document.getElementById('profit_user')


profits_con_user.addEventListener('click', () => {
    profits_con_user.style.display = 'none'
    profit_user.classList.remove('profit_user_container_hide')

})


dailybonus_user_button.addEventListener('click', () => {

    top_data_daily.classList.toggle('hide_daily')
    luckycwheel.classList.toggle('showluckywheel')
    dailybonus_user_button.style.display = 'none'

    luckycwheel.classList.remove('increase_token_hide')


})


// copy referral code
function copyToClipboard() {

    var textToCopy = document.getElementById('inviteLink').innerText;


    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);


    document.execCommand('copy');


    document.body.removeChild(tempTextArea);

    // Show popup on successful copy
    const popup = document.getElementById('customPopup');
    const overlay = document.getElementById('popupOverlay');
    const popuptext = document.getElementById('popuptext');


    popuptext.innerText = 'Link copied successfully!';


    popup.classList.add('popup-show');
    overlay.classList.add('popup-overlay-show');
    suc.classList.remove('hidden');
    dec.classList.add('hidden'); // Ensure decline image stays hidden
}


// coppy gift cod
document.addEventListener("DOMContentLoaded", function () {
    const copyButtons = document.querySelectorAll('.copy_gift_code');

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Find the closest <div> with the class 'sub_gift_cod' and then the <p class="cod_gift">
            const giftCodeElement = this.closest('.sub_gift_cod').querySelector('.cod_gift');
            const giftCode = giftCodeElement.innerText;

            // Copy the text to the clipboard
            navigator.clipboard.writeText(giftCode).then(function () {
                // Show the popup or success message
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');
                const popuptext = document.getElementById('popuptext');

                popuptext.innerText = 'Code copied successfully!';
                suc.classList.remove('hidden');
                dec.classList.add('hidden');
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }).catch(function (error) {
                console.error('Could not copy text: ', error);
            });
        });
    });
});


// terms
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem('termsAccepted')) {
        showPopup(1);
        document.getElementById('popup-container-terms').style.display = 'flex';
    }
});

function showPopup(popupNumber) {
    var popups = document.querySelectorAll('.popupterms');
    popups.forEach(function (popup) {
        popup.style.display = 'none';
    });

    document.getElementById('popupterms-' + popupNumber).style.display = 'block';
}

function nextPopup(currentPopup) {
    showPopup(currentPopup + 1);
}

function previousPopup(currentPopup) {

    showPopup(currentPopup - 1);
}

function agreeTerms() {
    localStorage.setItem('termsAccepted', 'true');
    document.getElementById('popup-container-terms').style.display = 'none';
}


homepage.addEventListener('click', () => {

    top_data_daily.classList.remove('hide_daily')
    luckycwheel.classList.remove('showluckywheel')

    dailybonus_user_button.style.display = 'flex'

    luckycwheel.classList.remove('increase_token_hide')
    luckycwheel.classList.remove('showluckywheel')

    top_data_daily.classList.remove('hide_daily')


})


// upgrade level model
const modal = document.getElementById("levelmodal");

const openModalBtn = document.querySelector(".data_level");
const closeModalBtn = document.querySelector(".close-btn");

// When the user clicks the button, open the modal
openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

// When the user clicks on the close button (X), close the modal
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

// When the user clicks anywhere outside the modal, close it
window.addEventListener("click", (event) => {

        if (event.target === modal) {
            modal.classList.remove("active");
        }
    }
);


//  new navbar
let list = document.querySelectorAll(".list");

function activeLink() {
    list.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}

list.forEach((item) => item.addEventListener("click", activeLink));


// tool tip of user icon name
const tooltipContainer = document.getElementById("tooltipContainer");
const tooltip = document.getElementById("tooltip");

tooltipContainer.addEventListener('click', function () {
    tooltipContainer.classList.toggle("active");
});
document.addEventListener('click', function (event) {
    if (!tooltipContainer.contains(event.target)) {
        tooltipContainer.classList.remove("active");
    }
});
// finish tool tip of user icon name


// daily bonus
function getdailybonusgift(data, id) {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }

    fetch('/DailyBonus', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            data, id
        })
    }).then(response => {
        response.json().then(resp => {
            if (resp.status === 'success') {

                fetchData()


                // Get the clicked button using a custom attribute to track the specific button clicked
                const button = document.querySelector(`button[onclick*="getdailybonusgift('${data}', ${id})"]`);
                if (button) {
                    // Target the <p> element inside the button
                    const daysParagraph = button.querySelector('.days');

                    if (daysParagraph) {
                        // Check if the tick image already exists, if not, create and append it
                        let tickImg = daysParagraph.querySelector('.tickdaysimg');
                        if (!tickImg) {
                            tickImg = document.createElement('img');
                            tickImg.className = 'tickdaysimg';
                            tickImg.src = '/static/img/images/tick.png'; // Ensure the correct path to the tick image
                            tickImg.alt = 'tick';
                            daysParagraph.appendChild(tickImg);
                        } else {
                            // Update the tick image if it already exists
                            tickImg.src = '/static/img/images/tick.png';
                            tickImg.alt = 'tick';
                        }
                    }
                }

                // Show success popup
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = 'You get the daily bonus gift!';

                suc.classList.remove('hidden')
                dec.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');


                // document.addEventListener('click', function refreshPage() {
                //         window.location.reload();
                //     }, {once: true});
            }

            if (resp.status === 'error') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }
        });
    });
}


// get profit
function Getprofit(data) {


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }


    fetch('/GetProfitView', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            data,
        })
    }).then(response => {
        response.json().then(resp => {

            if (resp.status === 'success') {
                fetchData()
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay')

                const popuptext = document.getElementById('popuptext');

                popuptext.innerText = resp.message
                suc.classList.remove('hidden')
                dec.classList.add('hidden')

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }
            if (resp.status === 'failure') {
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay')

                const popuptext = document.getElementById('popuptext');

                popuptext.innerText = resp.message
                suc.classList.add('hidden')
                dec.classList.remove('hidden')

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }
            if (resp.status === 'error') {
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay')

                const popuptext = document.getElementById('popuptext');

                popuptext.innerText = resp.message
                suc.classList.add('hidden')
                dec.classList.remove('hidden')

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }


            // document.addEventListener('click', function refreshPage() {
            //     window.location.reload();
            // }, {once: true});
        })
    })
}


// lucky wheel
var app = app || {};

app = (function () {


    var wheel = function () {

        var containerEl = document.getElementById('container'),

            wedgeColors = ['#a80ae6', '#2ecc71', '#3498db', '#33f81f', '#f1c40f', '#e74c3c', '#16A085', '#34495E', '#C0392B', '#e98b39'],

            wedgeNumbers = [1000, 7000, 200000, 50000, 10000, 80000, 100000, 20000, 30000, 70000],
            numOfWedges = wedgeNumbers.length, wheelRadius = 170, maxAngularVelocity = 360 * 10,
            minSpinDuration = 10000, maxSpinDuration = 20000, angularVelocity = 0, lastRotation = 0, activeWedge, stage,
            layer, wheel, pointer, pointerTween, startTime, wheelStopped = true;

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        shuffle(wedgeColors);

        function addWedge(n, number) {
            var angle = 360 / numOfWedges;

            var wedge = new Kinetic.Group({
                rotation: n * 360 / numOfWedges,
            });

            var wedgeBackground = new Kinetic.Wedge({
                radius: wheelRadius, angle: angle, fill: wedgeColors.pop(), rotation: (90 + angle / 2) * -1
            });

            wedge.add(wedgeBackground);

            var text = new Kinetic.Text({
                text: number,
                fontFamily: 'Fredoka One',
                fontSize: 20,
                fill: '#fff',
                align: 'center',
                opacity: 0.95,
                listening: false
            });

            text.offsetX(text.width() / 2);
            text.offsetY(wheelRadius - 15);

            wedge.add(text);
            wheel.add(wedge);
        }

        function checkCollision() {
            var pointerPos = {
                x: stage.width() / 2, y: 50
            };
            var shape = stage.getIntersection(pointerPos);
            if (shape) {
                return shape.getParent();
            }
            return null;
        }

        function animate(frame) {
            var elapsedTime = Date.now() - startTime;
            if (elapsedTime < minSpinDuration || angularVelocity > 0.1) {
                var angularVelocityChange = angularVelocity * frame.timeDiff * 0.001;
                angularVelocity -= angularVelocityChange;

                wheel.rotate(frame.timeDiff * angularVelocity * 0.001);
                lastRotation = wheel.getRotation();

                var intersectedWedge = checkCollision();

                if (intersectedWedge && (!activeWedge || activeWedge._id !== intersectedWedge._id)) {
                    pointerTween.reset();
                    pointerTween.play();
                    activeWedge = intersectedWedge;
                }

                wheelStopped = false;
            } else {
                if (!wheelStopped) {
                    angularVelocity = 0;
                    var selectedWedge = checkCollision();
                    if (selectedWedge) {
                        var selectedNumber = selectedWedge.getChildren()[1].getText();
                        luckywheelget(selectedNumber);
                        fetchData();
                    }

                    // Re-enable the button once the wheel has stopped
                    const celebrateBtn = document.getElementById('spinButton');
                    celebrateBtn.disabled = false;
                    celebrateBtn.classList.remove('gray-out'); // Remove gray-out style

                    wheelStopped = true;
                }
            }
        }


        function spinWheel() {
            const celebrateBtn = document.getElementById('spinButton');
            celebrateBtn.disabled = true; // Disable the button when spin starts
            celebrateBtn.classList.add('gray-out'); // Add gray-out style

            angularVelocity = maxAngularVelocity * (0.5 + Math.random() * 0.5);
            startTime = Date.now();
            wheelStopped = false;

        }

        function init() {
            stage = new Kinetic.Stage({
                container: 'container', width: wheelRadius * 2, height: wheelRadius * 2 + 20
            });

            layer = new Kinetic.Layer();
            wheel = new Kinetic.Group({
                x: stage.getWidth() / 2, y: wheelRadius + 20
            });

            for (var n = 0; n < numOfWedges; n++) {
                addWedge(n, wedgeNumbers[n]);
            }

            pointer = new Kinetic.Wedge({
                fill: '#dedede', angle: 35, radius: 20, x: stage.getWidth() / 2, y: 22, rotation: -105
            });

            layer.add(wheel);
            layer.add(pointer);
            stage.add(layer);

            pointerTween = new Kinetic.Tween({
                node: pointer, duration: 0.1, easing: Kinetic.Easings.EaseInOut, y: 30
            });

            pointerTween.finish();

            layer.draw();

            var anim = new Kinetic.Animation(animate, layer);
            anim.start();
        }

        init();
        containerEl.className = 'visible';

        return {
            spinWheel: spinWheel
        };
    }

    return {
        wheel: wheel, spinWheel: null
    };

})();

window.onload = function () {
    'use strict';
    app.wheel();
    app.spinWheel = app.wheel().spinWheel;
};


function LuckyWheelCheck(id) {
    const AdController = window.Adsgram?.init({
        blockId: "2027",

    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');


    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    };

    fetch('/luckywheelcheck', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({id})
    }).then(response => {
        response.json().then(resp => {
            if (resp.status === 'success') {
                app.spinWheel();

                // document.addEventListener('click', function refreshPage() {
                //     window.location.reload();
                // }, {once: true});
            }

            if (resp.status === 'ads') {
                AdController.show().then(() => {
                    app.spinWheel();
                }).catch((result) => {
                    const popup = document.getElementById('customPopup');
                    const overlay = document.getElementById('popupOverlay');
                    const popuptext = document.getElementById('popuptext');
                    popuptext.innerText = 'Please try again later.';
                    dec.classList.remove('hidden')
                    suc.classList.add('hidden')
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                });

            }

            if (resp.status === 'error') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');

                // document.addEventListener('click', function refreshPage() {
                //     window.location.reload();
                // }, {once: true});
            }
        });
    });
}


function luckywheelget(count) {
    celebrateBtn()

    const userid = document.getElementById('user__id').value


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');


    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }


    fetch('/luckywheelget', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            count, userid
        })
    }).then(response => {
        response.json().then(resp => {

            if (resp.status === 'success') {
                const alertContainer = document.createElement('div');
                alertContainer.classList.add('custom-alert');

                alertContainer.textContent = `You got ${count}`;
                document.body.appendChild(alertContainer);


                setTimeout(() => {
                    alertContainer.classList.add('visible');
                }, 10);

                setTimeout(() => {
                    alertContainer.classList.remove('visible');
                    // Ensure this timeout matches the duration of your remove animation
                }, 3000); // Duration the alert is visible
            }


            if (resp.status === 'error') {
                const alertContainer = document.createElement('div');
                alertContainer.classList.add('custom-alert');
                alertContainer.textContent = `try again later`;

                document.body.appendChild(alertContainer);

                setTimeout(() => {
                    alertContainer.classList.add('visible');
                }, 10);

                setTimeout(() => {
                    alertContainer.classList.remove('visible');
                    setTimeout(() => {
                        document.body.removeChild(alertContainer);
                    }, 500);
                }, 3000);

            }
        })
    })


}


function celebrateBtn() {
    fetchData()
    const celebrateBtn = document.getElementById('spinButton');

    celebrateBtn.disabled = true;
    setTimeout(function () {
        celebrateBtn.disabled = false;
    }, 5000);

    confetti({
        particleCount: 100, spread: 70, origin: {y: 0.6}
    });

    // button animation
    celebrateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        celebrateBtn.style.transform = 'scale(1)';
    }, 100);


}


//youtube part

let youLink

function openVideoDetail(link, id) {

    youLink = id


    const earnSection = document.getElementById('earnSectionmain');
    const videoDetail = document.getElementById('videoDetail');

    document.getElementById('videoIdHidden').value = id;


    localStorage.setItem('returnedFromVideo', 'true');

    earnSection.classList.add('video-detail-container_hide');
    videoDetail.classList.remove('video-detail-container_hide');


    window.open(link, '_blank');

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // Check the localStorage flag
            if (localStorage.getItem('returnedFromVideo') === 'true') {
                // Show the custom popup
                const popup = document.getElementById('customPopup');
                const videolinkswathc = document.getElementById('videolinkswathc').href = link;
                const popuptext = document.getElementById('popuptext');
                const overlay = document.getElementById('popupOverlay');

                suc.classList.add("hidden")
                dec.classList.add("hidden")
                popuptext.innerText = 'we will check your request after 1 hour you can use check button to get your gift.'
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');


                // Clear the localStorage flag
                localStorage.removeItem('returnedFromVideo');
            }
        }
    });

}

function completeVideo(data) {

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }

    const videoIdHidden = document.getElementById('videoIdHidden').value


    fetch('/HomeViewpost', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            data, videoIdHidden
        })
    }).then(response => {
        response.json().then(resp => {


            if (resp.status === 'success') {
                fetchData()

                const modal = document.getElementById('modal');
                const earnSection = document.getElementById('earnSectionmain');
                const videoDetail = document.getElementById('videoDetail');

                earnSection.classList.toggle('video-detail-container_hide');
                videoDetail.classList.toggle('video-detail-container_hide');

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');


                const popuptext = document.getElementById('popuptext');
                suc.classList.remove('hidden')
                dec.classList.add('hidden')
                popuptext.innerText = resp.message

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
                let seenVideo = document.getElementById(youLink)
                let videoImage = document.getElementById(`video_${youLink}`)
                let giftCount = document.getElementById(`giftCount_${youLink}`)
                videoImage.src = "static/img/images/tick.png";
                giftCount.textContent = ''
                seenVideo.onclick = null
                seenVideo.classList.add('diactive')
                // filter: grayscale(50%);


                // document.addEventListener('click', function refreshPage() {
                //     window.location.reload();
                // }, {once: true});
            }

            if (resp.status === 'error') {


                const modal = document.getElementById('modal');
                const earnSection = document.getElementById('earnSectionmain');
                const videoDetail = document.getElementById('videoDetail');

                earnSection.classList.toggle('video-detail-container_hide');
                videoDetail.classList.toggle('video-detail-container_hide');

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');


                const popuptext = document.getElementById('popuptext');
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popuptext.innerText = resp.message

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');

                // document.addEventListener('click', function refreshPage() {
                //     window.location.reload();
                // }, {once: true});
            }


        })
    })


}

//end youtube


//user upgrade part condition
function showremainupgrade(id) {
    const userid = document.getElementById('user__id').value;

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken || csrftoken,
    };

    fetch('/showremainupgrade', {
        method: 'post',
        credentials: 'include',
        headers,
        body: JSON.stringify({
            userid, id
        })
    }).then(response => {
        response.json().then(resp => {
            if (resp.status === 'success') {
                let message = `Remaining coins: ${resp.remaining_coins} \n`;

                // Conditionally add remaining referrals only if it's greater than 0
                if (resp.remaining_referrals > 0) {
                    message += `Remaining referrals: ${resp.remaining_referrals} \n`;
                }

                // Check if tasks or YouTube videos are not completed
                if (!resp.all_tasks_completed) {
                    message += '\nYou need to complete all tasks.';
                }
                if (!resp.all_youtube_completed) {
                    message += '\nYou need to complete all YouTube earnings.';
                }

                // Display the popup with the message
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');
                const popuptext = document.getElementById('popuptext');

                popuptext.innerText = message;
                suc.classList.add('hidden');
                dec.classList.add('hidden');

                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            } else {
                alert('Error: ' + resp.message);
            }
        });
    })
}


//task part
// function GetTaskPart(id, userId, link, event) {
//     event.preventDefault();  // Prevent the default behavior of the <a> tag
//
//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
//
//     const csrftoken = getCookie('csrftoken');
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');
//
//     let headers = {
//         'Accept': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest',
//         'X-CSRFToken': csrfToken || csrftoken,
//         'Content-Type': 'application/json'
//     };
//
//     let countdownSpan = link.querySelector('.countdown-timer');
//     let countdown = 20;
//     let timer = null;
//
//     // Open the link in a new tab
//     window.open(link.href, '_blank');
//
//     // Start countdown and disable the link
//     function startCountdownAndDisableLink() {
//         if (timer) {
//             clearInterval(timer);
//             timer = null;  // Reset the timer reference
//         }
//
//         // Disable the link to prevent clicks during the countdown
//         link.style.pointerEvents = 'none';
//
//         // Reset countdown value if necessary
//         countdown = 20;
//
//         // Display the countdown timer in the UI
//         countdownSpan.innerText = `${countdown}s`;
//
//         // Start the countdown timer
//         timer = setInterval(function () {
//             countdown--;
//             countdownSpan.innerText = `${countdown}s`;
//
//             // If the countdown reaches 0, stop the timer and re-enable the link
//             if (countdown <= 0) {
//                 clearInterval(timer);
//                 timer = null;  // Reset the timer reference
//                 countdownSpan.innerText = '';  // Clear countdown text
//                 link.style.pointerEvents = 'auto';  // Re-enable the link
//                 link.addEventListener('click', sendRequestToServer);  // Attach event to send request to server
//             }
//         }, 1000);
//     }
//
//     function clearCountdownTimer() {
//         // Check if there's an active timer, and clear it if it exists
//         if (timer) {
//             clearInterval(timer);
//             timer = null;  // Reset the timer reference
//
//             // Optionally reset the UI and link
//             countdownSpan.innerText = '';  // Clear countdown text
//             link.style.pointerEvents = 'auto'
//
//             countdown = 5;  // Reset countdown value if needed
//         }
//     }
//
//     function sendRequestToServer(event) {
//         // Send the request to get the task
//         fetch('/getTasks', {
//             method: 'post',
//             credentials: 'include',
//             headers: headers,
//             body: JSON.stringify({
//                 id: id,
//                 user_id: userId
//             })
//         })
//             .then(response => response.json().then(resp => {
//                     if (resp.status === 'success') {
//                         const popup = document.getElementById('customPopup');
//                         const popuptext = document.getElementById('popuptext');
//                         const overlay = document.getElementById('popupOverlay');
//                         popuptext.innerText = resp.message;
//                         suc.classList.remove('hidden');
//                         dec.classList.add('hidden');
//                         popup.classList.add('popup-show');
//                         overlay.classList.add('popup-overlay-show');
//
//                         let coinImage = link.querySelector('.nav-coin');
//                         coinImage.src = "static/img/images/tick.png";
//                         countdownSpan.style.display = 'none';
//
//                         clearCountdownTimer();
//                         fetchData();
//
//                         link.classList.add('disabled-link');
//                         link.onclick = null
//                     } else {
//                         const popup = document.getElementById('customPopup');
//                         const popuptext = document.getElementById('popuptext');
//                         const overlay = document.getElementById('popupOverlay');
//                         popuptext.innerText = resp.message;
//                         dec.classList.remove('hidden');
//                         suc.classList.add('hidden');
//                         popup.classList.add('popup-show');
//                         overlay.classList.add('popup-overlay-show');
//                         clearCountdownTimer();
//                     }
//                 })
//             );
//     }
//
//     startCountdownAndDisableLink();  // Start countdown and disable the link
// }
//

function GetTaskPart(id, userId, link, event) {
    event.preventDefault();  // Prevent the default behavior of the <a> tag

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken || csrftoken,
        'Content-Type': 'application/json'
    };

    let countdownSpan = link.querySelector('.countdown-timer');
    let countdown = 5;
    let timer = null;

    // Open the link in a new tab
    window.open(link.href, '_blank');

    // Start countdown and disable the link
    function startCountdownAndDisableLink() {
        if (timer) {
            clearInterval(timer);
            timer = null;  // Reset the timer reference
        }

        // Disable the link to prevent clicks during the countdown
        link.style.pointerEvents = 'none';

        // Reset countdown value if necessary
        countdown = 15;

        // Display the countdown timer in the UI
        countdownSpan.innerText = `${countdown}s`;

        // Start the countdown timer
        timer = setInterval(function () {
            countdown--;
            countdownSpan.innerText = `${countdown}s`;

            // If the countdown reaches 0, stop the timer and re-enable the link
            if (countdown <= 0) {
                clearInterval(timer);
                timer = null;  // Reset the timer reference
                countdownSpan.innerText = '';  // Clear countdown text
                link.style.pointerEvents = 'auto';  // Re-enable the link
            }
        }, 1000);
    }

    function clearCountdownTimer() {
        // Check if there's an active timer, and clear it if it exists
        if (timer) {
            clearInterval(timer);
            timer = null;  // Reset the timer reference

            // Optionally reset the UI and link
            countdownSpan.innerText = '';  // Clear countdown text
            link.style.pointerEvents = 'auto';

            countdown = 15;  // Reset countdown value if needed
        }
    }

    function sendRequestToServer(event) {
        // Prevent the default click behavior
        event.preventDefault();

        // Disable the link immediately to prevent multiple requests
        link.removeEventListener('click', sendRequestToServer);

        // Send the request to get the task
        fetch('/getTasks', {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                id: id,
                user_id: userId
            })
        })
            .then(response => response.json())
            .then(resp => {
                const popup = document.getElementById('customPopup');
                const popuptext = document.getElementById('popuptext');
                const overlay = document.getElementById('popupOverlay');

                if (resp.status === 'success') {
                    popuptext.innerText = resp.message;
                    suc.classList.remove('hidden');
                    dec.classList.add('hidden');
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');

                    let coinImage = link.querySelector('.nav-coin');
                    coinImage.src = "static/img/images/tick.png";
                    countdownSpan.style.display = 'none';

                    clearCountdownTimer();
                    fetchData();

                    link.classList.add('disabled-link');
                    link.onclick = null;
                } else {
                    popuptext.innerText = resp.message;
                    dec.classList.remove('hidden');
                    suc.classList.add('hidden');
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                    clearCountdownTimer();
                }
            })
            .finally(() => {
                // Re-enable the event listener after the request is complete
                link.addEventListener('click', sendRequestToServer);
            });
    }

    // Only add the event listener if it hasn't been added yet
    if (!link.classList.contains('event-attached')) {
        link.addEventListener('click', sendRequestToServer);
        link.classList.add('event-attached');
    }

    startCountdownAndDisableLink();
}


//boosts part
function fullEnergy() {
    const AdController = window.Adsgram?.init({
        blockId: "23421",

    });
    const userid = document.getElementById('user__id').value


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');


    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }

    fetch('/Fullenergy', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            userid
        })
    }).then(response => {
        response.json().then(resp => {
            Boosts()

            if (resp.status === 'success') {

                increaseEnergyToFull()

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                suc.classList.remove('hidden')
                dec.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');

            }

            if (resp.status === 'ads') {

                AdController.show().then(() => {
                    increaseEnergyToFull()
                    const popup = document.getElementById('customPopup');
                    const overlay = document.getElementById('popupOverlay');
                    const popuptext = document.getElementById('popuptext');
                    popuptext.innerText = 'your energy is full !';
                    suc.classList.remove('hidden')
                    dec.classList.add('hidden')

                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                }).catch((result) => {
                    const popup = document.getElementById('customPopup');
                    const overlay = document.getElementById('popupOverlay');
                    const popuptext = document.getElementById('popuptext');
                    popuptext.innerText = 'Please try again later.';
                    dec.classList.remove('hidden')
                    suc.classList.add('hidden')
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                });


            }

            if (resp.status === 'error') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }

            if (resp.status === 'finish') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }
        })
    })


}


function Boostss() {
    const AdController = window.Adsgram?.init({
        blockId: "2342",

    });
    const userid = document.getElementById('user__id').value
    const Boostsforms = document.getElementById("boostform");

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');


    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }

    fetch('/booststapcount', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            userid
        })
    }).then(response => {
        response.json().then(resp => {
            Boosts()
            if (resp.status === 'success') {

                let boostTime = parseInt(resp.time) * 1000;
                let timer = resp.time


                increasetapboost(2, boostTime, timer);

                Boostsforms.classList.add('disabled')


            }

            if (resp.status === 'ads') {

                AdController.show().then(() => {


                    increasetapboost(2, boostTime, timer);

                    Boostsforms.classList.add('disabled')


                    const popup = document.getElementById('customPopup');
                    const overlay = document.getElementById('popupOverlay');
                    const popuptext = document.getElementById('popuptext');
                    popuptext.innerText = 'your energy is full !';
                    succ.classList.toggle('hidden')
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                }).catch((result) => {
                    const popup = document.getElementById('customPopup');
                    const overlay = document.getElementById('popupOverlay');
                    const popuptext = document.getElementById('popuptext');
                    popuptext.innerText = 'Please try again later.';
                    dec.classList.remove('hidden')
                    suc.classList.add('hidden')
                    popup.classList.add('popup-show');
                    overlay.classList.add('popup-overlay-show');
                });


            }

            if (resp.status === 'error') {
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');
                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }

            if (resp.status === 'finish') {
                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');
                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');
            }


        })
    })


}


async function Boosts() {

    const boosts = document.getElementById('boosts')
    const airdropSection = document.getElementById('airdropSection')
    airdropSection.classList.remove('active')
    boosts.classList.remove('hidden')

    const userid = document.getElementById('user__id').value
    const Boostss = document.getElementById('Boostss')
    const fullEnergy = document.getElementById('fullEnergy')
    const MultiTapfunc = document.getElementById('MultiTapfunc')


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const csrftoken = getCookie('csrftoken');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');


    let headers = {
        'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    }

    fetch('/remaindataboosts', {
        method: 'post', credentials: 'include', headers, body: JSON.stringify({
            userid
        })
    }).then(response => {
        response.json().then(resp => {

            if (resp.status === 'success') {
                Boostss.innerText = resp.booststapcount;
                fullEnergy.innerText = resp.full;
                MultiTapfunc.innerText = resp.mutlitap;
            }
        })
    })


}


function MultiTapfunc() {

    //      const AdController = window.Adsgram?.init({
    //     blockId: "2019",
    //
    // });
    //
    // const userid = document.getElementById('user__id').value
    //
    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }
    //
    //
    // const csrftoken = getCookie('csrftoken');
    //
    // const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');
    //
    //
    // let headers = {
    //     'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    // }
    //
    //
    //
    // fetch('/Multitap', {
    //     method: 'post', credentials: 'include', headers, body: JSON.stringify({
    //         userid
    //     })
    // }).then(response => {
    //     response.json().then(resp => {
    //          Boosts()
    //
    //
    //           if (resp.status === 'success') {
    //
    //             increaseEnergyToFull()
    //
    //             const popup = document.getElementById('customPopup');
    //             const overlay = document.getElementById('popupOverlay');
    //
    //             const popuptext = document.getElementById('popuptext');
    //             popuptext.innerText = resp.message;
    //
    //             popup.classList.add('popup-show');
    //             overlay.classList.add('popup-overlay-show');
    //
    //         }
    //
    //          if (resp.status === 'ads') {
    //
    //               AdController.show().then(() => {
    //
    //                    const popup = document.getElementById('customPopup');
    //             const overlay = document.getElementById('popupOverlay');
    //             const popuptext = document.getElementById('popuptext');
    //             popuptext.innerText = 'your energy is full !';
    //
    //             popup.classList.add('popup-show');
    //             overlay.classList.add('popup-overlay-show');
    //             }).catch((result) => {
    //                 const popup = document.getElementById('customPopup');
    //                 const overlay = document.getElementById('popupOverlay');
    //                 const popuptext = document.getElementById('popuptext');
    //                 popuptext.innerText = 'Please try again later.';
    //                 popup.classList.add('popup-show');
    //                 overlay.classList.add('popup-overlay-show');
    //             });
    //
    //
    //
    //         }
    //
    //         if (resp.status === 'error') {
    //
    //             const popup = document.getElementById('customPopup');
    //             const overlay = document.getElementById('popupOverlay');
    //
    //             const popuptext = document.getElementById('popuptext');
    //             popuptext.innerText = resp.message;
    //
    //             popup.classList.add('popup-show');
    //             overlay.classList.add('popup-overlay-show');
    //         }
    //
    //         if (resp.status === 'finish') {
    //
    //             const popup = document.getElementById('customPopup');
    //             const overlay = document.getElementById('popupOverlay');
    //
    //             const popuptext = document.getElementById('popuptext');
    //             popuptext.innerText = resp.message;
    //
    //             popup.classList.add('popup-show');
    //             overlay.classList.add('popup-overlay-show');
    //         }
    //
    //
    //     })
    // })


}

function TapBot() {

    // const userid = document.getElementById('user__id').value
    //
    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }
    //
    //
    // const csrftoken = getCookie('csrftoken');
    //
    // const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');
    //
    //
    // let headers = {
    //     'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': csrfToken || csrftoken,
    // }
    //
    // fetch('/404', {
    //     method: 'post', credentials: 'include', headers, body: JSON.stringify({
    //         userid
    //     })
    // }).then(response => {
    //     response.json().then(resp => {
    //          Boosts()
    //         const popup = document.getElementById('customPopup');
    //         const overlay = document.getElementById('popupOverlay');
    //
    //         const popuptext = document.getElementById('popuptext');
    //         popuptext.innerText = resp.message;
    //
    //         popup.classList.add('popup-show');
    //         overlay.classList.add('popup-overlay-show');
    //     })
    // })


}


function increaseEnergyToFull() {
    const storedData = loadDataFromLocalStorage('userData');
    const boosts = document.getElementById('boosts')
    const airdropSection = document.getElementById('airdropSection')

    boosts.classList.add('hidden')
    airdropSection.classList.add('active')


    const updatedData = {
        ...storedData,
        energy: maxEnergy
    };

    saveDataToLocalStorage('userData', updatedData);

    updateDisplay(updatedData.energy, tokenCount);
}

function increasetapboost(tapMultiplier, time, timer) {
    const storedData = loadDataFromLocalStorage('userData');
    const boosts = document.getElementById('boosts')
    const airdropSection = document.getElementById('airdropSection')

    boosts.classList.add('hidden')
    airdropSection.classList.add('active')

    let countdownValue = timer;
    const countdownElement = document.getElementById("countdown10");
    const popup = document.getElementById("popup10");
    const Boostsforms = document.getElementById("boostform");

    const tapImage = document.getElementById('tap-image');


    // Show the popup with animation
    popup.style.display = "block";
    setTimeout(() => {
        popup.classList.add("show");
    }, 10);

    // Update countdown
    countdownElement.textContent = countdownValue;

    const interval = setInterval(function () {
        countdownValue--;
        countdownElement.textContent = countdownValue;

        if (countdownValue <= 0) {
            clearInterval(interval);

            // Automatically hide the popup after countdown finishes
            popup.classList.remove("show");
            useBoosts = false


            Boostsforms.classList.remove('disabled')
            setTimeout(() => {
                popup.style.display = "none"; // Hide after the animation ends
            }, 300); // Same duration as the transition (300ms)
        }
    }, 1000);


    document.getElementById("closePopupBtn10").addEventListener("click", function () {
        const popup = document.getElementById("popup10");
        popup.classList.remove("show");
        setTimeout(() => {
            popup.style.display = "none";

        }, 300);
    });

    const numbers = [90, 70, 120];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNumber = numbers[randomIndex];
    let originalScore = scorePerClick;
    scorePerClick = selectedNumber;
    useBoosts = true
    tapImage.classList.add('vibrate');


    setTimeout(() => {
        scorePerClick = originalScore;
        tapImage.classList.remove('vibrate');
    }, time);
}


// end boost part


// referral task
function teamReferralWork() {
    const userid = document.getElementById('user__id').value;

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]') ? document.querySelector('[name=csrfmiddlewaretoken]').value : getCookie('csrftoken');

    let headers = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken || csrftoken,
    };

    fetch('/teamReferralWork', {
        method: 'post',
        credentials: 'include',
        headers,
        body: JSON.stringify({
            userid
        })
    }).then(response => {
        response.json().then(resp => {
            if (resp.status === 'success') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                suc.classList.remove('hidden')
                dec.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');

                fetchData()
                document.getElementById('team_referral_work').style.display = 'none'

            }

            if (resp.status === 'invite_needs') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');


            }

            if (resp.status === 'error') {

                const popup = document.getElementById('customPopup');
                const overlay = document.getElementById('popupOverlay');

                const popuptext = document.getElementById('popuptext');
                popuptext.innerText = resp.message;
                dec.classList.remove('hidden')
                suc.classList.add('hidden')
                popup.classList.add('popup-show');
                overlay.classList.add('popup-overlay-show');

            }

        })
    })


}


function senshiGame() {


    const popup = document.getElementById('customPopup');
    const overlay = document.getElementById('popupOverlay');
    const popuptext = document.getElementById('popuptext');
    popuptext.innerText = 'The city being built ...';
    dec.classList.add('hidden')
    suc.classList.add('hidden')
    popup.classList.add('popup-show');
    overlay.classList.add('popup-overlay-show');


}


function wallet() {

    const popup = document.getElementById('customPopup');
    const overlay = document.getElementById('popupOverlay');
    const popuptext = document.getElementById('popuptext');
    popuptext.innerText = 'coming soon ...';
    dec.classList.add('hidden')
    suc.classList.add('hidden')
    popup.classList.add('popup-show');
    overlay.classList.add('popup-overlay-show');
}


//  game five times fade
const imgElement = document.getElementById('gameImage');
let animationCount = 0;

// Function to add the animation
function addAnimation() {
    imgElement.classList.add('adnimgamefade');

    // Listen for the animation iteration event
    imgElement.addEventListener('animationiteration', () => {
        animationCount++;
        if (animationCount >= 5) {
            imgElement.classList.remove('adnimgamefade'); // Remove the animation class after 5 iterations
        }
    });
}

// Start the animation
addAnimation();