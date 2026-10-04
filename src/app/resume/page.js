import Resume from "@/components/Resume";
import "./resume.css";

export const metadata = {
  title: "Resume — Vatsal Saglani",
  description:
    "Resume of Vatsal Saglani, Data Science Lead (GenAI) at Qyrus: experience, selected projects, skills, education and publications.",
  alternates: { canonical: "/resume/" },
};

export default function ResumePage() {
  return <Resume />;
}
