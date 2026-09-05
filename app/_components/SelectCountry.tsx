import { getCountries } from "@/app/_lib/data-service";

type SelectCountryProps = {
  defaultCountry: string;
  name: string;
  id: string;
  className?: string;
};

async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
}: SelectCountryProps) {
  const countries = await getCountries();

  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>

      {countries.map((country) => (
        <option key={country.name} value={`${country.name}%${country.flag}`}>
          {country.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
