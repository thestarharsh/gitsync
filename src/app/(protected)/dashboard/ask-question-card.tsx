"use client";

import React, { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";

import useGetProjects from "@/hooks/use-get-projects";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { askQuestion } from "./actions";
import CodeReferences from "./code-references";

import "./ask-question-card.css";

const AskQuestionCard = () => {
  const { project } = useGetProjects();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFileReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, fileReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFileReferences(fileReferences);
    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[70vw] h-full">
          <DialogHeader>
            <DialogTitle>
              <Image
                src={"/GitSyncLogo.png"}
                alt="GitSync"
                width={40}
                height={40}
              />
            </DialogTitle>
          </DialogHeader>
          <MDEditor.Markdown
            source={answer}
            disableCopy={false}
            className="h-full max-h-[40vh] max-w-[70vw] overflow-scroll bg-transparent text-gray-800 dark:text-gray-100"
            style={{
              backgroundColor: "transparent",
              color: "inherit",
              maxWidth: "70vw",
              height: "100%",
              maxHeight: "40vh",
              overflowY: "scroll",
              overflowX: "visible",
              wordBreak: "break-word",
            }}
          />
          {fileReferences.length && (
            <CodeReferences fileReferences={fileReferences} />
          )}
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4" />
            <Button type="submit" disabled={loading}>
              Ask GitSync AI
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
