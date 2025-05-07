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

  const loadExample = async (exampleNumber: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://radiologist-server-mqduxnviu-mysticaldawns-projects.vercel.app/get_example/${exampleNumber}`);
      if (!response.ok) {
        throw new Error('Failed to load example');
      }
      const data = await response.json();
      
      // Update the patient data
      setPatient(data);
      setImage(`data:image/png;base64,${data.img_b64}`);
      setDasImage(`data:image/png;base64,${data.img_b64}`);
      setOrrImage(`data:image/png;base64,${data.img_b64}`);
    } catch (error) {
      console.error('Error loading example:', error);
      alert('Failed to load example. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-200">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Patient Info */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="py-3">
            <div className="flex flex-col items-center text-center">
              {patient.name ? (
                <div className="flex justify-between items-center w-full">
                  <div className="text-white">
                    <CardTitle className="text-xl">{patient.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      ID: {patient.id} • Admitted: {patient.date} • {patient.urgency}
                    </CardDescription>
                  </div>
                  {patient.alert && (
                    <Badge className="bg-red-900 hover:bg-red-900 text-white">
                      {patient.alert}
                    </Badge>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-slate-800/50">
                      <Brain className="h-5 w-5 text-slate-400" />
                    </div>
                    <CardTitle className="text-xl text-white">AI-powered MWI System</CardTitle>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 font-medium">for Stroke Detection & Analysis</span>
                    <span className="text-slate-500 text-sm mt-0.5">Upload a scan or explore examples</span>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brain Visualization */}
          <Card className="bg-slate-950 border-slate-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-center">Reconstructed Image</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center items-center min-h-[600px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-slate-400" size={48} />
                  <p className="text-slate-400">Analyzing Brain Scan...</p>
                </div>
              ) : patient.img_b64 === "" ? (
                <div className="flex flex-col items-center justify-center gap-8 p-8 w-full h-full">
                  <div className="text-center space-y-3 max-w-xl mx-auto">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-slate-800/50">
                        <Brain className="h-12 w-12 text-slate-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200">Upload Brain Scan</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Upload your brain scan in ZIP format for comprehensive analysis. Our advanced AI system will process the scan and provide detailed insights about potential abnormalities and conditions.
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <ZipFileInput
                      onFileSelect={(file) => {
                        setIsLoading(true);
                        // Create a FormData object to send the file
                        const formData = new FormData();
                        formData.append("file", file);

                        // Send the file to the server using a POST request
                        fetch(
                          "https://radiologist-server-mqduxnviu-mysticaldawns-projects.vercel.app/basil",
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
                  
                  {/* Examples Section */}
                  <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-slate-800"></div>
                      <span className="text-sm text-slate-500">Explore Example Cases</span>
                      <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto hover:bg-slate-800 transition-colors border-slate-800"
                        onClick={() => loadExample(1)}
                      >
                        <Brain className="h-8 w-8 mb-2 text-green-500" />
                        <span className="font-medium">Case Study 1</span>
                        <span className="text-sm text-green-500">Healthy Brain Structure</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto hover:bg-slate-800 transition-colors border-slate-800"
                        onClick={() => loadExample(2)}
                      >
                        <Brain className="h-8 w-8 mb-2 text-red-500" />
                        <span className="font-medium">Case Study 2</span>
                        <span className="text-sm text-red-500">Hemorrhagic Stroke (Position 2)</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto hover:bg-slate-800 transition-colors border-slate-800"
                        onClick={() => loadExample(3)}
                      >
                        <Brain className="h-8 w-8 mb-2 text-red-500" />
                        <span className="font-medium">Case Study 3</span>
                        <span className="text-sm text-red-500">Hemorrhagic Stroke (Position 3)</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={`data:image/png;base64,${patient.img_b64}`}
                    alt="Brain Visualization"
                    height={900}
                    width={1000}
                    className="object-contain"
                  />
                </div>
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
                <CardTitle className="text-sm font-medium text-white text-center">
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusIndicator
                  icon={AlertCircle}
                  label="Antenna Status"
                  value={patient.name ? "Operational" : "N/A"}
                  status={patient.name ? "optimal" : "critical"}
                  showProgress
                  progressValue={patient.name ? 100 : 0}
                />
                <StatusIndicator
                  icon={Activity}
                  label="Scan Progress"
                  value={patient.name ? "100%" : "0%"}
                  status={patient.name ? "complete" : "critical"}
                  showProgress
                  progressValue={patient.name ? 100 : 0}
                />
                <StatusIndicator
                  icon={Battery}
                  label="Power Output"
                  value={patient.name ? "95%" : "0%"}
                  status={patient.name ? "optimal" : "critical"}
                  showProgress
                  progressValue={patient.name ? 100 : 0}
                />
                <StatusIndicator
                  icon={Signal}
                  label="Signal Quality"
                  value={patient.name ? "High" : "N/A"}
                  status={patient.name ? "optimal" : "critical"}
                  showProgress
                  progressValue={patient.name ? 92 : 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
