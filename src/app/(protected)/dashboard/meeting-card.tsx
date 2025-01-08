"use client";

import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDropzone } from "react-dropzone";
import { Presentation, Upload } from "lucide-react";

import { uploadFile } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MeetingCard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".mp4"],
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (accepetedFiles) => {
      setIsUploading(true);
      console.log(accepetedFiles);
      const file = accepetedFiles[0];
      const downloadUrl = await uploadFile(file as File, setProgress);
      setIsUploading(false);
    },
  });

  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Upload a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyze your meeting with GitSync.
            <br />
            Powered with AI
          </p>
          <div className="mt-6">
            <Button disabled={isUploading}>
              <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Upload
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div className="flex items-center justify-center">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
            })}
          />
          <p className="text-center text-sm text-gray-500">
            Uploading your meeting...
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
