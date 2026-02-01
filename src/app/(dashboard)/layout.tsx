import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Toaster } from "sonner";
export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            {children}
            <Toaster position="top-right" richColors />
        </DashboardLayout>
    );
}
