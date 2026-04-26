import { createServer } from 'http';

async function runTests() {
  console.log("--- Testing Full Campaign Mode ---");
  try {
    const res = await fetch("http://localhost:3000/api/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "full",
        holiday: "Earth Day",
        holidayDescription: "A day to celebrate the earth",
        businessType: "Coffee Shop",
        businessName: "Eco Brews",
        targetAudience: "Eco-friendly millennials",
        location: "Seattle, WA"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Success?", res.ok);
    if (!res.ok) console.log("Error:", data);
    else {
      console.log("Instagram returned?", !!data.instagram);
      console.log("Email returned?", !!data.email);
    }
  } catch (e) {
    console.error("Failed to connect to dev server. Is it running?", e.message);
  }

  console.log("\n--- Testing Caption Mode ---");
  try {
    const resCap = await fetch("http://localhost:3000/api/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "caption",
        holidayName: "Earth Day",
        businessName: "Eco Brews",
        businessType: "Coffee Shop",
        businessNiche: "Sustainable Coffee",
        tone: "Inspiring",
        platform: "Instagram",
        previousCaptions: ["Do not reuse this caption."]
      })
    });
    const dataCap = await resCap.json();
    console.log("Status:", resCap.status);
    console.log("Success?", resCap.ok);
    if (!resCap.ok) console.log("Error:", dataCap);
    else {
      console.log("Captions returned?", !!dataCap.captions);
      console.log("Captions count:", dataCap.captions?.length);
    }
  } catch (e) {
    console.error("Failed to connect to dev server.", e.message);
  }
}
runTests();
