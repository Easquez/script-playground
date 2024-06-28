import Image from "next/image";
import styles from "./page.module.css";
import MonacoEditor from "./components/MonacoEditor";
export default function Home() {
  return (
    <main>
      <MonacoEditor />
    </main>
  );
}
