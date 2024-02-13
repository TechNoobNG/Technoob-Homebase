import React from "react";
import Select from "react-select";
import countries from "./countries";
import _ from "lodash";

const CountryDropdown = ({
  onSelect,
  defaultCountry,
  className,
  id,
  name,
  propIndex,
}) => {
  const handleSelect = (selectedOption) => {
    onSelect(_.capitalize(selectedOption.value), propIndex, name);
  };

  const uniqueCountries = countries.filter(
    (country, index, self) =>
      index === self.findIndex((c) => c.isoCodes === country.isoCodes)
  );

  const options = uniqueCountries.map((country) => ({
    value: country.country,
    label: (
      <div className="flex items-center">
        <img
          src={country.flag}
          alt={country.country}
          className="w-6 h-6 mr-2"
        />
        <span>{`${_.capitalize(country.country)}${country.code}`}</span>
      </div>
    ),
  }));

  return (
    <Select
      options={options}
      onChange={handleSelect}
      placeholder={defaultCountry ? defaultCountry : "Select a country"}
      className={`w-full ${className}`}
      id={id}
      name={name}
      styles={{
        control: (provided) => ({
          ...provided,
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
          padding: "0.375rem 0.75rem",
          width: "fit",
        }),
        option: (provided) => ({
          ...provided,
          borderBottom: "1px solid #e2e8f0",
        }),
      }}
    />
  );
};

export default CountryDropdown;
