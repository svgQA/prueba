import { ELEMENT_TYPE } from '@/types/form';

export const ELEMENT_TYPE_VALUES = [
  {
    value: ELEMENT_TYPE.TITLE,
    label: 'Title',
  },
  {
    value: ELEMENT_TYPE.INPUT,
    label: 'Input',
  },
  {
    value: ELEMENT_TYPE.TEXT_AREA,
    label: 'Text Area',
  },
  {
    value: ELEMENT_TYPE.NUMBER_INPUT,
    label: 'Number Input',
  },
  {
    value: ELEMENT_TYPE.DROPDOWN,
    label: 'Dropdown',
  },
  {
    value: ELEMENT_TYPE.RADIO_BUTTON,
    label: 'Radio Button',
  },
  {
    value: ELEMENT_TYPE.CHECK_BOX,
    label: 'Checkbox',
  },
  {
    value: ELEMENT_TYPE.SWITCH,
    label: 'Switch',
  },
  {
    value: ELEMENT_TYPE.DATE,
    label: 'Date',
  },
  {
    value: ELEMENT_TYPE.TIME,
    label: 'Time',
  },
  {
    value: ELEMENT_TYPE.RATING,
    label: 'Rating',
  },
  {
    value: ELEMENT_TYPE.IMAGE,
    label: 'Image',
  },
  {
    value: ELEMENT_TYPE.SIGNATURE,
    label: 'Signature',
  },
  {
    value: ELEMENT_TYPE.QR,
    label: 'QR',
  },
  {
    value: ELEMENT_TYPE.AUDIO,
    label: 'Audio',
  },
  {
    value: ELEMENT_TYPE.CALCULATE,
    label: 'Calculate',
  },
  {
    value: ELEMENT_TYPE.LOCATION,
    label: 'Location',
  },
  {
    value: ELEMENT_TYPE.FILES,
    label: 'Files',
  },
];

export const REGEX_PATTERNS = [
  {
    value: '^[A-Za-z0-9]+$',
    label: 'Alphanumeric only',
  },
  {
    value: '^[A-Za-z]+$',
    label: 'Letters only',
  },
  {
    value: '^[0-9]+$',
    label: 'Numbers only',
  },
  {
    value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    label: 'Email',
  },
  {
    value: '^(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
    label: 'Phone number',
  },
  {
    value:
      '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
    label: 'URL',
  },
];

export const SWITCH_OPTIONS = [
  {
    value: 0,
    label: 'False',
  },
  {
    value: 1,
    label: 'True',
  },
];
