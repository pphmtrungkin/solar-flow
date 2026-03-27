"use client";

export default function AddOrgModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  // 1. If not open, return null immediately
  if (!isOpen) return null;

  // 2. Return the JSX directly without the extra { } or ;
  return (
    <div className="modal modal-open modal-middle fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-box relative z-10 bg-base-100 p-6 rounded-xl shadow-2xl border border-base-300">
        <h3 className="font-bold text-lg mb-4">Add Organization</h3>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 space-y-2">
          <legend className="fieldset-legend font-semibold">
            Organization Details
          </legend>

          <label className="label text-sm">Title</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="My awesome organization"
          />

          <label className="label text-sm">Slug</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="my-awesome-org"
          />
        </fieldset>

        <div className="modal-action mt-6">
          <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
            Create
          </button>
          <button className="btn" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-0 cursor-pointer"
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
}
