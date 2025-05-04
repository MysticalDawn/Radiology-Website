export async function getAllPatients() {
  try {
    const response = await fetch(`http://localhost:3001/fetch_all`, {
      method: "GET"
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch data: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json(); // Await the parsed JSON
    console.log("Response from API:", data); // Log the actual data
    return data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("An error occurred while fetching patients");
  }
}