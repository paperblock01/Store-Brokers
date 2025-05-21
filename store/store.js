
const flag_link = "../Assets/Icons/flags/";
const emblem_link = "../Assets/Icons/decals/";
const crate_link = "../Assets/Icons/crates/";
const emote_link = "";
const bundle_link = "";


// Code stolen from GeekforGeeks to make the tab stay at the top of the page
stickyElem = document.querySelector(".tab");

currStickyPos = stickyElem.getBoundingClientRect().top + window.pageYOffset;
window.onscroll = function () {
    if (window.pageYOffset > currStickyPos) {
        stickyElem.style.position = "fixed";
        stickyElem.style.top = "0px";
    } else {
        stickyElem.style.position = "relative";
        stickyElem.style.top = "initial";
    }
}

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trimStart();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

// Code stolen from w3schools because I'm too lazy to make one myself
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
  window.scrollTo(0,0);
}

// Get player items
async function get_items(token) {
  try {
    const response = await fetch("https://store1.warbrokers.io/" + api_version + "//get_items.php?token="+token);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const items = await response.text().then(data => data.split(","));

    // Check if token exists
    if (items[0] == "Error! Bad token") {
        window.location = "../index.html";
        return;
    }
    // Return the items owned by the player
    return items;

  }
  catch (error) {
    console.error(error);
    alert("Something Went Wrong. Please contact the creator.")
  }
}

// Get flags, emblems, crates, ans shop bundles for sale
async function get_item_list() {
    try {
        const response = await fetch("https://store1.warbrokers.io/" + api_version + "//get_item_list.php");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const list = await response.text().then(data => data.split(","));

        let flags = [];
        let emblems = [];
        let crates = [];
        let special = [];

        // Sort through the data
        for (let i=0; i<list.length; i+=2) {
            // Flags
            if (list[i][0] == "f") {
                flags.push(list[i],list[i+1]);
            }
            // Emblems
            else if (list[i][0] == "d") {
                emblems.push(list[i],list[i+1]);
            }
            // Crates
            else if (list[i][0] == "x") {
                crates.push(list[i],list[i+1]);
            }
            // Shop Bundles
            else if (list[i].substring(0,7) == "special") {
                special.push(list[i],list[i+1]);
            }
        }

        let store = [flags,emblems,crates,special];

        return store;

    }
    catch {
        console.error(error);
        alert("Something Went Wrong. Please contact the creator.")
    }
}

async function buy_item(token,itemid) {
    try {
        // Send a request to buy the item
        const response = await fetch("https://store1.warbrokers.io/" + api_version + "//buy_item_v2.php?token="+token+"&item="+itemid+"&multiple=1");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let items = await response.text().then(data => data.split(","));

        // If not enough coins
        if (items[0] == "Error! Not enough coins!") {
            alert("Error! Not enough coins!")
        } else {
            alert("Something Went Wrong. Please contact the creator.");
        }

        return items;
    }
    catch (error) {
        console.log(error)
        alert("Something Went Wrong. Please contact the creator.");
    }
}

async function get_crate_items(crateid) {
    try {
        // Send request to get the crate items
        const response = await fetch("https://store1.warbrokers.io/" + api_version + "//get_crate_items.php?crate="+crateid);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let info = await response.text().then(data => data.split(","));

        let items = [];

        // Sort the data for items only
        for (let i=0; i<info.length; i+=2) {
            items.push(info[i]);
        }

        return items;

    }
    catch (error) {
        console.error(error);
        alert("Something Went Wrong. Please contact the creator.");
    }
}

// Show the crate items in the crate-container
async function crate_items(itemid) {
    // Set the name of the crate
    document.getElementById("crate-namexnnn").innerHTML = itemid;
    // Display the items pop-up
    document.getElementById("cratexnnn").style.display = "flex";

    // Get the items in the crate
    let items = await get_crate_items(itemid);

    // Display the items in the textarea
    document.getElementById("crateitemsxnnn").value = items.toString();

}

// Copy crate item data to clipboard
function copy_data(id) {
    const copy = document.getElementById(id);
    copy.select();
    copy.setSelectionRange(0,99999);
    document.execCommand("copy");
}

// Close or disapear an element
function exit(id) {
    document.getElementById(id).style.display = "none";
}

function shop_card(item_id, price, link) {
    // Return html for a card
    return `
    <div id="card`+item_id+`" class="item">
      <div id="`+item_id+`" class="item-id">`+item_id+`</div>
      <img class="image" src="`+link+item_id+`.png">
      <div id="interact`+item_id+`" class="interact">
        <a class="price"> 🪙`+price+`</a>
        <button id="buy`+item_id+`" class="buy" onclick="confirm('`+item_id+`','`+price+`')">Buy</button>
      </div>
    </div>`;
}

function crate_cards(item_id, price, link) {
    // Return html for a card
    return `
    <div id="card`+item_id+`" class="item">
      <div id="`+item_id+`" class="item-id">`+item_id+`
        <div class="owned">
        <a id="owned`+item_id+`">Own: 0</a>
        <button onclick="crate_items('`+item_id+`')">Items</button>
        </div>
      </div>
      <img class="image" src="`+link+item_id+`.png">
      <div id="interact`+item_id+`" class="interact">
        <a class="price"> 🪙`+price+`</a>
        <button id="buy`+item_id+`" class="buy" onclick="confirm('`+item_id+`','`+price+`')">Buy</button>
      </div>
    </div>`;
}

function bundle_cards(item_id, price, link) {
    return `
    <div id="card`+item_id+`" class="bundle">
        <div id="`+item_id+`" class="bundle-id">`+item_id+`</div>
        <div id="`+item_id+`certain" class="bundle-certain"><a>Unknown</a></div>
        <div id="`+item_id+`name" class="bundle-name">Bundle Name</div>

        <div class="bundle-table">
            <table style="width:100%" id="`+item_id+`table">
            <tr>
                <td>Unknown</td>
                <td>
                <img class="bundle-image" src="">
                </td>
            </tr>
            </table>
        </div>

        <div id="interact`+item_id+`" class="interact">
            <a class="price"> 🪙`+price+`</a>
            <button id="buy`+item_id+`" class="buy" onclick="confirm('`+item_id+`','`+price+`')">Buy</button>
        </div>
    </div>
    `;
}

function array_sort_unique(array) {
    let sorted = [];
    let names = [];
    let count = [];
    for (let i=0; i<array.length; i++) {
        // If the array item has been counted before
        if (names.includes(array[i])) {
            // Count the item in the count array
            count[names.indexOf(array[i])]++;
        }
        // If the item is newly counted
        else {
            // Add the item the the end of the names array
            names.push(array[i]);
            // Start the count for the item at 1
            count.push(1);
        }

    }
    sorted = [names,count];
    return sorted;
}

function display_flags(flags) {
    let Flags = document.getElementById("Flags");
    // Loop through the data for the flags
    for (let i=0; i<flags.length; i+=2) {
        let flag_card = document.createElement("div");
        flag_card.innerHTML = shop_card(flags[i],flags[i+1],flag_link)

        Flags.appendChild(flag_card);
    }
}

function display_emblems(emblems) {
    let Emblems = document.getElementById("Emblems");
    // Loop through the data for the flags
    for (let i=0; i<emblems.length; i+=2) {
        let emblem_card = document.createElement("div");
        emblem_card.innerHTML = shop_card(emblems[i],emblems[i+1],emblem_link)

        Emblems.appendChild(emblem_card);
    }
}

function display_crates(crates) {
    let Crates = document.getElementById("Crates");
    // Loop through the data for the flags
    for (let i=0; i<crates.length; i+=2) {
        let crate_card = document.createElement("div");
        crate_card.innerHTML = crate_cards(crates[i],crates[i+1],crate_link)

        Crates.appendChild(crate_card);
    }
}

function display_bundles(bundles) {
    let Bundles = document.getElementById("Bundles");
    // Loop through the data for the bundles
    for (let i=0; i<bundles.length; i+=2) {
        let bundle_card = document.createElement("div");
        bundle_card.innerHTML = bundle_cards(bundles[i],bundles[i+1],bundle_link)

        Bundles.appendChild(bundle_card);
    }
}

// Disable cards if items sold in the card are owned
function owned_items(items, bundles) {
    // Get the keys of the bundles object
    let keys = Object.keys(bundles);

    // Update the amount of coins the player has:
    document.getElementById("coins").textContent = items[0];

    // Array to store owned item ids
    let owned = [];
    // Seperate array to store the crates
    let owned_crate = [];
    // Array to store bundle ids that are owned
    let owned_bundle = [];

    // Check for owned items
    for (let i=2; i<items.length; i++) {
        // Flags
        if (items[i][0] == "f") {
            owned.push(items[i]);
        }
        // Emblems
        else if (items[i][0] == "d") {
            owned.push(items[i]);
        }
        // Crates
        else if (items[i][0] == "x") {
            owned_crate.push(items[i]);
        }
    }

    // Check for items owned in bundles
    // Loop through each bundle
    for (let i=0; i<keys.length; i++) {
        // Add the id of the current bundle to the owned_bundle array
        owned_bundle.push(keys[i]);

        // Check the items in the bundle for matches in the player's items
        for (let j=0; j<bundles[keys[i]]["items"].length; j++) {
            // Check if the owned items array does not include the item in the current bundle
            if (!items.includes(bundles[keys[i]]["items"][j])) {
                // Remove the id of the bundle for the owned_bundle array
                owned_bundle.splice(owned_bundle.indexOf(keys[i],1));
                // Stop checking items and go to the next bundle
                break;
            }
        }
    }

    // Change the details of the cards of owned items
    for (let j=0; j<owned.length; j++) {
        // Gray the card
        document.getElementById("card"+owned[j]).style.backgroundColor = "gray";

        // Change the item id text
        document.getElementById(owned[j]).innerHTML = owned[j]+" (Owned)";

        // Disable the buy button
        document.getElementById("buy"+owned[j]).disabled = true;
        document.getElementById("buy"+owned[j]).style.color = "gray";
    }

    // Create an array of every unique crate owned by the player
    let sorted = array_sort_unique(owned_crate);

    // Change the details of crate cards
    for (let k=0; k<sorted[0].length; k++) {
        document.getElementById("owned"+sorted[0][k]).innerHTML = "Own: "+sorted[1][k];
        document.getElementById("owned"+sorted[0][k]).style.backgroundColor = "tomato";
    }

    // Change the details of the bundle cards
    for (let l=0; l<owned_bundle.length; l++) {
        // Gray the card
        document.getElementById("card"+owned_bundle[l]).style.backgroundColor = "gray";

        // Change the item id text
        document.getElementById(owned_bundle[l]).innerHTML = owned_bundle[l]+" (Owned)";

        // Disable the buy button
        document.getElementById("buy"+owned_bundle[l]).disabled = true;
        document.getElementById("buy"+owned_bundle[l]).style.color = "gray";
    }

}

// Display confirmation elements in the interact div
function confirm(itemid,price) {
    // Change the interact div
    document.getElementById("interact"+itemid).innerHTML = `
    <a>Confirm?</a>
    <button class="realbuy" onclick="buy_real('`+itemid+`','`+price+`')">Yes</button>
    <button onclick="cancel('`+itemid+`','`+price+`')">Cancel</button>`;
}

// Reste the interact div
function cancel(itemid,price) {
    // Revert the interact div
    document.getElementById("interact"+itemid).innerHTML = `
    <a class="price"> 🪙`+price+`</a>
        <button id="buy`+itemid+`" class="buy" onclick="confirm('`+itemid+`','`+price+`')">Buy</button>`;
}

async function buy_real(itemid,price) {
    try {
        // Buy the item for real
        let buy = await buy_item(token,itemid);

        console.log(itemid+" for |"+price+"| coins with token: "+ token)

        // Reset the interact div of the card
        cancel(itemid,price)

        // Retreve the player's items
        const items = await get_items(token);

        // Check the shop for changes in owned items
        owned_items(items, Bundles);

    }
    catch (error) {
        console.error(error);
        alert("Something Went Wrong. Please contact the creator.")
    }
}

const token = getCookie("game_token");

(async () => {
    // Gets the player's items and checks the token
    let items = await get_items(token);
    // Gets the data for the shop
    const item_list = await get_item_list();

    // Shop item data arays
    const flags = item_list[0];
    const emblems = item_list[1];
    const crates = item_list[2];
    const special = item_list[3];

    // Display the cards
    display_flags(flags);
    display_emblems(emblems);
    display_crates(crates);
    display_bundles(special);

    // Check for owned items and edit the cards
    owned_items(items, Bundles);

})();

