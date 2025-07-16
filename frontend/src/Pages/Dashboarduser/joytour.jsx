import React from "react";
import Joyride from "react-joyride";

export default function JoyTour({ run, setRun }) {
  const steps = [
    {
      target: ".tour-header",
      content: "Use these buttons to move between months in the calendar.",
    },
    {
      target: ".tour-calendar-cell",
      content: "Each of these boxes represents a day. You can drag and drop posts here.",
    },
    {
      target: ".tour-post",
      content: "This is a scheduled post. Click to see details or use icons to edit/delete.",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      disableOverlayClose
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#10b981", // green
          backgroundColor: "#1f2937", // dark background
          textColor: "#ffffff",
          arrowColor: "#1f2937",
        },
      }}
      callback={(data) => {
        if (["finished", "skipped"].includes(data.status)) {
          setRun(false);
          localStorage.setItem("hasSeenTour", "true");
        }
      }}
    />
  );
}
