import HeaderComponent from "@/app/_components/HeaderComponent";
import { CustomComponentType } from "@/types/types-component";

export default function Page({ children }: CustomComponentType) {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  );
}
