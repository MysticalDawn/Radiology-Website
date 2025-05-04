export async function uploadBucket(personID: string, content: string) {
  try {
    const response = await fetch(`http://localhost:3001/${content}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error updating bucket ID:", error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log("Bucket ID updated successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Unexpected error updating bucket ID:", error);
    return { success: false, error: error.message };
  }
}
