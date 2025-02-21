import CenterLayout from "@/components/center-layout";
import { Options } from "@/components/option";
import { UrlInput } from "@/components/url-input";

export default function Home() {
 return (
  <CenterLayout>
   <UrlInput />
   <Options />
  </CenterLayout>
 );
}
