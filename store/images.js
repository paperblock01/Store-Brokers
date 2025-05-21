// Links from the wiki
const wiki_skins = "https://war-brokers.fandom.com/wiki/Uniforms";
const wiki_items = "https://war-brokers.fandom.com/wiki/Category:Items";
const wiki_heads = "https://war-brokers.fandom.com/wiki/Category:Heads";

// Array of cosmetic links
let cosmetic_links = ["../Assets/Icons/decals/d120.png"];
// Array of corrisponding ids
let cosmetic_ids = ["d120"];

// Get links and ids from the requested page
async function get_links(wiki_link) {
  try {
    const response = await fetch(wiki_link);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Sort the html by each entry in the table of cosmetics
    const table = await response.text().then(data => data.split("<tr>"));

    // Create arrays for the cosmetic links and their ids
    let links = [];
    let ids = [];

    // Sort through the table entries
    for (let i=2; i<table.length; i++) {
        // Split the table entry by the <td> tag
        let data = table[i].split("<td>");
      
        // Extract and push the link of the cosmetic
        let revision = data[1].split(/"([^"]*)"/)[3];

        // Remove revision part of the link
        let link = "";
        (revision != undefined) ? link = revision.split("/revision")[0] : link = "";

        // Push modified links to links array
        links.push(link);

        // Extract and push the id: xxx
        ids.push(data[2].split("\n")[0]);
    }

    // Combine the ids and links into one Array and return them
    return [ids,links];

    // For debuging later if the tables ever change
/*
    // Table entry: array called data
    console.log(table[2]);
    // Table entry split by <td> tags
    console.log(table[2].split("<td>"));
    // Cosmetic link should be at data[1][2]
    console.log(table[2].split("<td>")[1].split(/"([^"]*)"/));
    // Cosmetic id should be at data[2][0]
    console.log(table[2].split("<td>")[2].split("\n"));
*/

  }
  catch (error) {
    console.error(error);
    alert("Something Went Wrong. Please contact the creator.")
  }
}

function arrayToObj(keys, values) {
    const obj = {};
    keys.forEach((key, index) => {
        obj[String(key)] = values[index];
    });
    return obj;
}

function update_bundle(item_id,cosmetic_data) {
    // Change the name of the bundle
    document.getElementById(item_id+"name").textContent = Bundles[item_id]["name"];

    // HTML for the certainty
    let certainty = "";

    // If certainty is 1: certain, 0: uncertain, 2: items unknown, else: unknown
    if (Bundles[item_id]["certain"] == 1) {
        certainty = "<a style='color:green'>Certain</a>";
    } else if (Bundles[item_id]["certain"] == 0) {
        certainty = "<a style='color:red'>Uncertain</a>";
    } else if (Bundles[item_id]["certain"] == 2) {
        certainty = "<a style='color:orange'>Items Uncertain</a>";
    } else {
        certainty = "<a>Unknown</a>"
    }

    // Change the certainty of the bundle
    document.getElementById(item_id+"certain").innerHTML = certainty;

    // Array of items in the bundle
    let items = Bundles[item_id]["items"];

    // HTML for the table
    let table = "";

    // Loop through each item in the bundle
    for (let i=0; i<items.length; i++) {
      table += `<tr id="${item_id+items[i]}">
            <td>${items[i]}</td>
            <td>
                <img class="bundle-image" src="${cosmetic_data[items[i]]}">
            </td>
        </tr>`;
    }

    // Update the table entries
    document.getElementById(item_id+"table").innerHTML = table;
}

(async () => {

    let skins_get = await get_links(wiki_skins);
    let items_get = await get_links(wiki_items);
    let heads_get = await get_links(wiki_heads);

    // Change the ids to match the server side ids
    for (let i=0; i<skins_get[0].length; i++) {
        skins_get[0][i] = "v30c"+skins_get[0][i];
    }
    for (let i=0; i<items_get[0].length; i++) {
        items_get[0][i] = "v30i"+items_get[0][i];
    }
    for (let i=0; i<heads_get[0].length; i++) {
        heads_get[0][i] = "h"+heads_get[0][i];
    }

    // Add the links to the cosmetic_links array
    cosmetic_links.push(...skins_get[1]);
    cosmetic_links.push(...items_get[1]);
    cosmetic_links.push(...heads_get[1]);

    // Add the ids to the cosmetics_ids array
    cosmetic_ids.push(...skins_get[0]);
    cosmetic_ids.push(...items_get[0]);
    cosmetic_ids.push(...heads_get[0]);

    // Combine the ids and links into an object
    const cosmetics = arrayToObj(cosmetic_ids, cosmetic_links);

    // Put the keys of the Bundles object into an array
    const bundles = Object.keys(Bundles);

    // For each bundle with a defined object, modify its card
    for (let i=0; i<bundles.length; i++) {
        update_bundle(bundles[i],cosmetics);
    }

})();
