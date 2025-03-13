async function check() {
  try {
    // Get the token inputed
    let token = document.getElementById("token").value;

    const response = await fetch("https://store1.warbrokers.io/" + api_version + "//get_items.php?token="+token);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const items = await response.text();

    // Check if token exists
    if (items == "Error! Bad token") {
        document.getElementById("text").innerHTML = "Error! Bad token";
        return
    }

    // Store the token
    document.cookie = "game_token="+token;
    document.location = "./store/store.html";

  }
  catch (error) {
    document.getElementById("text").innerHTML = "Something went wong. Please contact the creator."
    console.error(error);
  }
}

