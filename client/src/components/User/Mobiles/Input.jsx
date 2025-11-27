import { Input } from "@material-tailwind/react";
 
export function InputCustomStyles() {
  return (
    <div className="ml-4">
      <Input
        type="number"
        placeholder="Eg:289"
        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{ className: "min-w-[50px]" }}
      />
    </div>
  );
}