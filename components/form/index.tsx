"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import {
//   CountryCode,
//   getCountries,
//   getCountryCallingCode,
// } from "libphonenumber-js";
import { ComponentProps } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function ControllerInputComponent<T extends FieldValues>({
  form,
  name,
  label,
  componentProps,
}: {
  form?: UseFormReturn<T>;
  name?: Path<T>;
  label?: string;
  componentProps?: ComponentProps<"input">;
}) {
  if (!form || !name) {
    return (
      <Field>
        <FieldLabel>{label ?? "Label"}</FieldLabel>
        <Input
          placeholder="Disabled"
          disabled
        />
      </Field>
    );
  }
  return (
    <Controller
      name={name}
      control={form?.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            {...componentProps}
            id={name}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function ControllerCheckboxComponent<T extends FieldValues>({
  form,
  name,
  label,
}: {
  form?: UseFormReturn<T>;
  name?: Path<T>;
  label?: string;
}) {
  if (!form || !name) {
    return (
      <Field orientation={"horizontal"}>
        <Checkbox
          id={name}
          disabled
        />
        <FieldLabel>{label ?? "Label"}</FieldLabel>
      </Field>
    );
  }
  return (
    <Controller
      name={name}
      control={form?.control}
      render={({ field, fieldState }) => (
        <Field
          orientation={"horizontal"}
          data-invalid={fieldState.invalid}
        >
          <Checkbox
            id={name}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

// export function ControllerPhoneNumberCountryCodeComponent<
//   T extends FieldValues,
// >({
//   form,
//   countryCodeName,
//   phoneNumberName,
//   label,
//   phoneNumberProps,
// }: {
//   form?: UseFormReturn<T>;
//   countryCodeName?: Path<T>;
//   phoneNumberName?: Path<T>;
//   phoneNumberProps?: ComponentProps<"input">;
//   label?: string;
// }) {
//   const [countryCodes, setCountryCodes] = useState<
//     { value?: CountryCode; label?: string }[]
//   >([]);
//   const manageCountryCodes = useCallback(() => {
//     const newArray = getCountries()?.map((item) => ({
//       value: item,
//       label: `+${getCountryCallingCode(item)} ${item}`,
//     }));
//     setCountryCodes(newArray);
//   }, []);
//   useEffect(() => {
//     manageCountryCodes();
//   }, []);

//   if (!form || !countryCodeName || !phoneNumberName) {
//     return (
//       <Field>
//         <FieldLabel>{label ?? "Label"}</FieldLabel>
//         <Input
//           placeholder="Disabled"
//           disabled
//         />
//       </Field>
//     );
//   }

//   return (
//     <Field>
//       <FieldLabel>{label}</FieldLabel>
//       <Field
//         className="items-start gap-0.5"
//         orientation={"horizontal"}
//       >
//         <Controller
//           name={countryCodeName}
//           control={form?.control}
//           render={({ field, fieldState }) => (
//             <Field
//               data-invalid={fieldState.invalid}
//               className="w-fit max-w-25"
//             >
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     className="justify-between"
//                   >
//                     {countryCodes?.find((item) => item.value === field.value)
//                       ?.label ?? "+00"}
//                     <ChevronsUpDown className="opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="p-0">
//                   <Command>
//                     <CommandInput
//                       placeholder="Search Country"
//                       className="h-9"
//                     />
//                     <CommandList>
//                       <CommandEmpty>No Country found.</CommandEmpty>
//                       <CommandGroup>
//                         {countryCodes.map((item, index) => (
//                           <CommandItem
//                             key={index}
//                             value={item.label}
//                             onSelect={() => field.onChange(item.value)}
//                           >
//                             {item.label}
//                             <Check
//                               className={cn(
//                                 "ml-auto",
//                                 item.value === field.value
//                                   ? "opacity-100"
//                                   : "opacity-0",
//                               )}
//                             />
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           )}
//         />
//         <Controller
//           name={phoneNumberName}
//           control={form?.control}
//           render={({ field, fieldState }) => (
//             <Field
//               data-invalid={fieldState.invalid}
//               className="flex-1"
//             >
//               <Input
//                 {...field}
//                 {...phoneNumberProps}
//                 aria-invalid={fieldState.invalid}
//               />
//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           )}
//         />
//       </Field>
//     </Field>
//   );
// }

export function FormButtonComponent<T extends FieldValues>({
  form,
  text,
}: {
  form?: UseFormReturn<T>;
  text?: string;
}) {
  return (
    <Button
      type="submit"
      // className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-linear-to-r from-purple-600 to-blue-600 py-2 font-medium text-white hover:brightness-90 disabled:cursor-progress"
      disabled={form?.formState?.isSubmitting}
    >
      {form?.formState?.isSubmitting ? <Spinner /> : ""}
      <span>{text}</span>
    </Button>
  );
}
