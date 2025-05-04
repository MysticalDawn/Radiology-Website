"use client";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Home,
  Search,
  SlidersHorizontal,
  Brain,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePatient } from "@/components/brain-dashboard";
import { getAllPatients } from "../lib/fetch_all";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export function HistoryView() {
  const [data, setData] = useState<any[]>([]); // State to store patient data
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track errors

  // Filter by search query (ID or name)
  const filteredData = data.filter((patient) => {
    const q = searchQuery.toLowerCase();
    return (
      patient.id.toString().includes(q) ||
      (patient.name || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    async function fetchPatients() {
      try {
        const patients = await getAllPatients(); // Await the asynchronous function
        setData(patients); // Set the fetched data
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to fetch patient data");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    fetchPatients();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-200 justify-center mt-3">
      {/* Main Content */}
      <main className="flex-1 justify-center px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center text-sm text-slate-400 hover:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Scan History</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder="Search patients..."
                    className="pl-8 h-9 bg-slate-900 border-slate-800 text-sm text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-900/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>AI Prediction</TableHead>
                  <TableHead className="text-right">Download Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="border-slate-800 hover:bg-slate-900/50 text-white"
                  >
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name || "-"}</TableCell>
                    <TableCell>{patient.age || "-"}</TableCell>
                    <TableCell>{patient.gender || "-"}</TableCell>
                    <TableCell>{patient.date || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          patient.alert === "Hemorrhagic Stroke" ||
                          patient.ai_prediction === "Hemorrhagic Stroke"
                            ? "bg-red-500 hover:bg-red-600 text-black flex items-center gap-2"
                            : patient.alert === "No Stroke" ||
                              patient.ai_prediction === "No Stroke"
                            ? "bg-green-500 hover:bg-green-600 text-black flex items-center gap-2"
                            : "bg-blue-500 hover:bg-blue-600 text-black flex items-center gap-2"
                        }
                      >
                        {(patient.alert === "Hemorrhagic Stroke" ||
                          patient.ai_prediction === "Hemorrhagic Stroke") && (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {(patient.alert === "No Stroke" ||
                          patient.ai_prediction === "No Stroke") && (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        {patient.alert || patient.ai_prediction || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          patient.urgency === "High"
                            ? "bg-red-500 hover:bg-red-600 text-black"
                            : patient.urgency === "Medium"
                            ? "bg-orange-500 hover:bg-orange-600 text-black"
                            : patient.urgency === "Low"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                            : patient.urgency === "None"
                            ? "bg-gray-500 hover:bg-gray-600 text-black"
                            : "bg-blue-500 hover:bg-blue-600 text-black"
                        }
                      >
                        {patient.urgency || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          patient.ai_pred === "No Stroke"
                            ? "bg-green-500 hover:bg-green-600 text-black"
                            : patient.ai_pred === "Hemorrhagic Stroke"
                            ? "bg-red-500 hover:bg-red-600 text-black"
                            : "bg-blue-500 hover:bg-blue-600 text-black"
                        }
                      >
                        {patient.ai_pred || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `https://antenna-described-brief-hart.trycloudflare.com/get_report/?scan_number=${patient.scan_number}`,
                              {
                                method: "GET",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              }
                            );

                            if (!res.ok) throw new Error(await res.text());

                            const { pdf_b64 } = await res.json(); // Extract base64
                            const binary = atob(pdf_b64); // Decode base64 to binary
                            const array = new Uint8Array(binary.length);

                            for (let i = 0; i < binary.length; i++) {
                              array[i] = binary.charCodeAt(i);
                            }

                            const blob = new Blob([array], {
                              type: "application/pdf",
                            }); // Create PDF Blob
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = `${patient.scan_number}_report.pdf`;
                            link.click(); // Trigger download
                          } catch (err) {
                            console.error("Download error:", err);
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
