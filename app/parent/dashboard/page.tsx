"use client";
import { useContext, useEffect } from "react";
import { CreditContext } from "@/app/_components/CreditContext/CreditContext";
import Databox from "../../_components/DataBox/Databox";
import DataboxMed from "../../_components/DataBox/DataboxMed";
import CreditsViewBar from "../../_components/CreditsViewbar/CreditsViewBar";
import "./dashboard.css";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
function Home() {
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error("CreditContext is missing. Wrap app in CreditProvider.");

  const { credits, addCredits } = ctx;

  const openAddStudentModal = () => {
    window.alert("Add student");
  };

  useEffect(() => {
    TutortoiseClient.getBalance("1").then((res: number) => {
      addCredits(-credits + res);
    });
  }, []);

  return (
    <main className="dashboard">
      <CreditsViewBar
        value={credits.toString()}
        href="/parent/dashboard/credits"
        cta="Need more credits?"
      />
      <section className="dashboard__data-row">
        <Databox
          title="Student"
          value="Zayn"
          href="/student"
          cta="switch"
          topRightIcon={{
            src: "/icons/Add user icon.svg",
            alt: "Add student button",
            onClick: openAddStudentModal,
          }}
        />
        <Databox
          title="Sessions completed"
          value="3"
          href="/student"
          cta="View"
        />
        <DataboxMed />
      </section>
    </main>
  );
}

export default Home;
