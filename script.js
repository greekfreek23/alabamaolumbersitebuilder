(function() {
  // Grab the ?site= parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const siteParam = urlParams.get('site');

  // Get references to elements
  const statusMsg = document.getElementById('statusMsg');
  const plumberNameEl = document.getElementById('plumberName');
  const plumberLogoEl = document.getElementById('plumberLogo');

  if (!siteParam) {
    // If no ?site= is provided, show a warning
    statusMsg.textContent = "No ?site= parameter found. Example: ?site=cj-plumbing-and-gas";
    return;
  }

  // URL for finalWebsiteData.json in the "alabamaplumbersnowebsite" repo
  const DATA_URL = "https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json";

  // Fetch the JSON data
  fetch(DATA_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load finalWebsiteData.json (status " + response.status + ")");
      }
      return response.json();
    })
    .then(json => {
      // The JSON might have something like { finalWebsiteData: [ ... ] }
      const businesses = json.finalWebsiteData || [];

      // Find the matching site by siteId (case-insensitive)
      const found = businesses.find(biz => 
        (biz.siteId || "").toLowerCase() === siteParam.toLowerCase()
      );

      if (!found) {
        statusMsg.textContent = "No matching siteId found for: " + siteParam;
        return;
      }

      // We have a matching plumber record!
      statusMsg.textContent = "Loaded data for " + siteParam;

      // Display their name (if available)
      if (found.businessName) {
        plumberNameEl.textContent = found.businessName;
      } else {
        plumberNameEl.textContent = siteParam; // fallback
      }

      // Display their logo (if available)
      if (found.logo) {
        plumberLogoEl.src = found.logo;
        plumberLogoEl.alt = found.businessName + " Logo";
      } else {
        plumberLogoEl.alt = "No logo available for " + siteParam;
      }
    })
    .catch(err => {
      // If there's any fetch or JSON error, show a message
      statusMsg.textContent = "Error: " + err.message;
    });
})();
