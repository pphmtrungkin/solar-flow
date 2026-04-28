"use client";

/**
 * AddOrgModal Component
 *
 * A refined, centered modal for creating organizations.
 * Features a solid background to prevent transparency issues,
 * a darkened backdrop with blur, and high z-index stacking to ensure
 * it appears above the sidebar and other layout elements.
 */
export default function AddOrgModal({
  isOpen,
  setIsOpenAction,
}: {
  isOpen: boolean;
  setIsOpenAction: (value: boolean) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop: Darkened and blurred to isolate the modal */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpenAction(false)}
        aria-hidden="true"
      />

      {/* Modal Box: Solid background, centered, and elevated */}
      <div className="relative bg-base-100 border border-base-300 rounded-2xl shadow-2xl w-full max-w-md p-8 z-10 overflow-hidden">
        <h3 className="text-2xl font-bold mb-6 text-base-content">
          Add Organization
        </h3>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase opacity-50">
                  Organization Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200 focus:input-primary transition-all text-base-content"
                placeholder="e.g. Solar Sales Pty Ltd"
                autoFocus
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase opacity-50">
                  Organization Slug
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200 focus:input-primary transition-all text-base-content"
                placeholder="e.g. solar-sales"
              />
              <label className="label py-1">
                <span className="label-text-alt text-[10px] opacity-40">
                  Used for URLs and identification
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm font-bold"
              onClick={() => setIsOpenAction(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm px-8 font-bold shadow-lg shadow-primary/20"
              onClick={() => {
                // TODO: Implement creation logic via Server Action or API
                setIsOpenAction(false);
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
