"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import ZipFileInput from "./ui/zip_file";
import {
  Activity,
  AlertCircle,
  Battery,
  Brain,
  Clock,
  Home,
  Signal,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DiagnosisPanel } from "./diagnosis-panel";
import { StatusIndicator } from "./status-indicator";

interface Patient {
  id: string;
  date: string;
  name: string;
  age: string;
  alert: string;
  urgency: string;
  ai_pred: string;
  ai_confidence: string;
  ai_comment: string;
  scan_number: Number;
  img_b64: string;
  pdf_b64: string;
}

interface PatientContextType {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patient, setPatient] = useState<Patient>({
    id: "",
    date: "",
    name: "",
    age: "",
    alert: "",
    urgency: "",
    ai_pred: "",
    ai_confidence: "",
    scan_number: 0,
    ai_comment: "",
    img_b64: "",
    pdf_b64: "",
  });

  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};

export function BrainDashboard() {
  const { patient, setPatient } = usePatient();
  const [image, setImage] = useState<string>("");
  const [DasImage, setDasImage] = useState<string>("");
  const [orrImage, setOrrImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black mb-5 text-slate-200 justify-center mt-2">
      {/* Main Content */}
      <main className="flex px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card className="bg-slate-950 border-slate-800 md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center align-items-center">
              <div className="text-white text-start flex flex-col align-center justify-start">
                <CardTitle>Patient: {patient.name}</CardTitle>
                <CardDescription>
                  ID: {patient.id} • Admitted: {patient.date} •{" "}
                  {patient.urgency}
                </CardDescription>
              </div>
              <Badge className="bg-red-900 hover:bg-red-900 text-white">
                {patient.alert}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Brain Visualization */}
        <Card className="bg-slate-950 border-slate-800 md:col-span-2 overflow-hidden flex flex-col justify-center">
          <CardHeader className="pb-2">
            <div className="flex justify-end items-center">
              <div className="flex space-x-2">
                {DasImage !== "" && (
                  <>
                    <Button
                      variant={image === DasImage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImage(DasImage)}
                      className="h-7 px-2 text-xs"
                    >
                      ItDAS
                    </Button>
                    <Button
                      variant={image === orrImage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImage(orrImage)}
                      className="h-7 px-2 text-xs"
                    >
                      ORR
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex justify-center items-center h-full">
            {isLoading ? (
              <Loader2 className="animate-spin text-slate-400" size={48} />
            ) : patient.img_b64 === "" ? (
              <div className="flex justify-center items-center w-full">
                <ZipFileInput
                  onFileSelect={(file) => {
                    setIsLoading(true);
                    // Create a FormData object to send the file
                    const formData = new FormData();
                    formData.append("file", file);

                    // Send the file to the server using a POST request
                    fetch(
                      "https://exciting-thai-vcr-hearts.trycloudflare.com/basil",
                      {
                        method: "POST",
                        body: formData,
                        headers: {
                          CORS: "Access-Control-Allow-Origin",
                        },
                      }
                    )
                      .then((response) => {
                        if (!response.ok) {
                          console.error(
                            "Error response from server:",
                            response
                          );
                          throw new Error("Failed to upload file");
                        }
                        return response.json();
                      })
                      .then((data) => {
                        if (data.img_b64) {
                          setDasImage(`data:image/png;base64,${data.img_b64}`); // Ensure proper Base64 format
                          setOrrImage(
                            `data:image/png;base64,${data.img_b64_orr}`
                          );
                          setImage(`data:image/png;base64,${data.img_b64}`);
                          setPatient(data);
                          return;
                        }
                        throw new Error(
                          "Invalid response: Missing das_b64 field"
                        );
                      })
                      .catch((error) => {
                        console.error("Network error or server issue:", error);
                        alert(
                          "Failed to upload file. Please check your network or try again later."
                        );
                      })
                      .finally(() => {
                        setIsLoading(false);
                      });
                  }}
                />
              </div>
            ) : (
              <Image
                src={`data:image/png;base64,${patient.img_b64}` || ""}
                alt="Brain Visualization"
                height={900}
                width={1000}
              />
            )}
          </CardContent>
        </Card>

        {/* Right Side Panels */}
        <div className="space-y-6">
          {/* AI Diagnosis */}
          <DiagnosisPanel />

          {/* System Status */}
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusIndicator
                icon={AlertCircle}
                label="Antenna Status"
                value={patient.name ? "Operational" : "N/A"} // Show "N/A" if patient data is empty
                status={patient.name ? "optimal" : "critical"} // Set status to "critical" if patient data is empty
                showProgress
                progressValue={patient.name ? 100 : 0} // Set progress to 0 if patient data is empty
              />
              <StatusIndicator
                icon={Activity}
                label="Scan Progress"
                value={patient.name ? "100%" : "0%"} // Show "0%" if patient data is empty
                status={patient.name ? "complete" : "critical"} // Set status to "critical" if patient data is empty
                showProgress
                progressValue={patient.name ? 100 : 0} // Set progress to 0 if patient data is empty
              />
              <StatusIndicator
                icon={Battery}
                label="Power Output"
                value={patient.name ? "95%" : "0%"} // Show "0%" if patient data is empty
                status={patient.name ? "optimal" : "critical"} // Set status to "critical" if patient data is empty
                showProgress
                progressValue={patient.name ? 100 : 0} // Set progress to 0 if patient data is empty
              />
              <StatusIndicator
                icon={Signal}
                label="Signal Quality"
                value={patient.name ? "High" : "N/A"} // Show "N/A" if patient data is empty
                status={patient.name ? "optimal" : "critical"} // Set status to "critical" if patient data is empty
                showProgress
                progressValue={patient.name ? 92 : 0} // Set progress to 0 if patient data is empty
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
