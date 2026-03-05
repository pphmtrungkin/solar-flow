import { CirclePlus } from "lucide-react";
export default function fab() {
  return (
    <div className="fab">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-lg btn-primary btn-circle"
      >
        <CirclePlus />
      </div>

      <div>
        Label B<button className="btn btn-lg btn-circle">A</button>
      </div>

      <div>
        Label C<button className="btn btn-lg btn-circle">B</button>
      </div>

      <div>
        Label D<button className="btn btn-lg btn-circle">C</button>
      </div>
    </div>
  );
}
