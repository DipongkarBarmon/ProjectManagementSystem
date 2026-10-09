/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";


export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">403 - Forbidden</h2>
        <p className="mt-2 text-sm text-gray-600">
          You do not have permission to access this resource.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
