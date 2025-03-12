import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({
      ...values,
      [name]: name === "income" ? Number(value) || 0 : value,
    });
  };
  return { values, handleChange, setValues };
}
