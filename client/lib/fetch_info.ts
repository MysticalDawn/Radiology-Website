export default async function fetchPatientInfo(
  scanNumber: string,
  patientNewData: any
) {
  console.log("New patient data:", patientNewData);
  // First, make a POST request to /edit_info
  const editResponse = await fetch(
    `http://localhost:3001/edit_info/${scanNumber}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientNewData),
    }
  );

  if (!editResponse.ok) {
    throw new Error("Failed to edit patient info");
  }

  // Then, make a GET request to /get_patient_info
  const response = await fetch(
    `http://localhost:3001/get_patient_info/${scanNumber}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch patient info");
  }

  return data;
}
