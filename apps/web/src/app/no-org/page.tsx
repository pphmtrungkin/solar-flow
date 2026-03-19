"use client";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl max-w-lg w-full">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-2">No Organization</h1>
          <p className="text-base-content/70 mb-4">
            Your account is not currently associated with an organization.
            Please contact an administrator to be invited, or create a new
            organization if you have permission.
          </p>
        </div>
      </div>
    </div>
  );
}
