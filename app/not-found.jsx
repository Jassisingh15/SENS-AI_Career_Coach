import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-violet-600/15 blur-3xl -z-10" />
      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved to another quadrant.
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
