"use client";
import { AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { usePatient } from "@/components/brain-dashboard";
import { useEffect, useState } from "react";

export function DiagnosisPanel() {
  const { patient } = usePatient();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    console.log("Patient state changed:", patient);
    setIsEmpty(
      !patient.ai_pred && !patient.ai_confidence && !patient.ai_comment
    );
  }, [patient]); // Logs whenever the patient state changes and updates isEmpty

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex justify-center items-center">
          <Badge className="bg-amber-900 hover:bg-amber-600 text-white text-xl p-2 mt-2 min-w-full text-center items-center">
            AI Classification
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 w-100">
        {isEmpty ? (
          <div className="text-center text-slate-400">
            <p className="text-lg">No data available.</p>
            <p className="text-sm">
              Please upload a file to view the diagnosis.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="w-100">
            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  {patient.ai_pred === "Hemorrhagic Stroke" && (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-red-400">
                      {patient.alert}
                    </h4>
                  </div>
                </div>
                <Separator className="bg-slate-800" />
                <div className="text-sm space-y-3 flex-col text-center justify-center align-items-center align-content-center text-slate-400 p-3">
                  <p className="text-6xl text-white">{patient.ai_confidence}</p>
                  {patient.ai_pred !== "" && (
                    <p className="text-base text-slate-400 text-white">
                      Confidence Level
                    </p>
                  )}
                  <p>{patient.ai_comment}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-800 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          disabled={isEmpty} // Disable the button if `isEmpty` is true
          onClick={() => {
            if (patient.pdf_b64) {
              const link = document.createElement("a");
              link.href = `data:application/pdf;base64,${patient.pdf_b64}`; // Use the Base64 PDF data
              link.download = `${patient.id}_report.pdf`; // Set a default filename
              link.click();
            } else {
              console.error("No PDF data available");
            }
          }}
        >
          <FileText className="mr-1 h-3.5 w-3.5" />
          Full Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 ml-2"
          onClick={() => {
            window.location.reload(); // Refresh the page
          }}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
