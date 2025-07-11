export async function getAllPatients() {
  try {
    const response = await fetch(
      `https://radiologist-server-mqduxnviu-mysticaldawns-projects.vercel.app/fetch_all`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to fetch data: ${response.status} - ${errorDetails}`
      );
    }

    const data = await response.json(); // Await the parsed JSON
    console.log("Response from API:", data); // Log the actual data
    return data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("An error occurred while fetching patients");
  }
}
