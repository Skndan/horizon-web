import { NumberFieldFormElement } from "@/components/dnd/fields/NumberField";
import { ParagraphFieldFormElement } from "@/components/dnd/fields/ParagraphField";
import { SeparatorFieldFormElement } from "@/components/dnd/fields/SeparatorField";
import { SpacerFieldFormElement } from "@/components/dnd/fields/SpacerField";
import { SubTitleFieldFormElement } from "@/components/dnd/fields/SubTitleField"; 
import { TextAreaFieldFormElement } from "@/components/dnd/fields/TextAreaField";
import { TitleFieldFormElement } from "@/components/dnd/fields/TitleField";
import { DateFieldFormElement } from "@/components/dnd/fields/DateField";
import { SelectFieldFormElement } from "@/components/dnd/fields/SelectField";
import { CheckboxFieldFormElement } from "@/components/dnd/fields/CheckboxField";
import { TextFieldFormElement } from "@/components/dnd/fields/TextField";

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance;
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };
  designerComponent: React.FC<{ elementInstance: FormElementInstance }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{ elementInstance: FormElementInstance }>;
  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
};