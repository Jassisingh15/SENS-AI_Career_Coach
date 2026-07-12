"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { improveCoverLetter } from "@/actions/cover-letter";

const CoverLetterPreview = ({ content }) => {
  const [letter, setLetter] = useState(content);
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    try {
      setLoading(true);
      const improved = await improveCoverLetter(letter);
      setLetter(improved);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 space-y-4">
      {/* 👇 Improve Button */}
      <div className="flex justify-end">
        <Button onClick={handleImprove} disabled={loading}>
          {loading ? "Improving..." : "Improve with AI"}
        </Button>
      </div>

      {/* 👇 Preview */}
      <MDEditor value={letter} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;