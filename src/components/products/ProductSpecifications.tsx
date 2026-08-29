"use client";

type SpecificationValue =
  | string
  | number
  | boolean
  | null
  | SpecificationValue[]
  | { [key: string]: SpecificationValue };

interface ProductSpecificationsProps {
  specifications: Record<string, SpecificationValue>;
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  // Flatten nested specifications
  const flattenSpecs = (
    obj: Record<string, SpecificationValue>,
    prefix: string = "",
  ): [string, SpecificationValue][] => {
    let result: [string, SpecificationValue][] = [];

    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix} > ${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        result = result.concat(flattenSpecs(value, newKey));
      } else {
        result.push([newKey, value]);
      }
    }

    return result;
  };

  const specItems = flattenSpecs(specifications);

  if (specItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {specItems.map(([key, value]) => (
              <tr key={key} className="border-b last:border-b-0">
                <td className="py-3 px-2 text-sm font-medium text-gray-700 w-1/3 bg-gray-50/50">
                  {key}
                </td>

                <td className="py-3 px-2 text-sm text-gray-600 w-2/3">
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
