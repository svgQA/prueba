import { ELEMENT_TYPE } from './types';

export const ELEMENT_TYPE_VALUES = [
  {
    value: ELEMENT_TYPE.TITLE,
    key: 'Title',
  },
  {
    value: ELEMENT_TYPE.INPUT,
    key: 'Input',
  },
  {
    value: ELEMENT_TYPE.TEXT_AREA,
    key: 'Text Area',
  },
  {
    value: ELEMENT_TYPE.NUMBER_INPUT,
    key: 'Number Input',
  },
  {
    value: ELEMENT_TYPE.DROPDOWN,
    key: 'Dropdown',
  },
  {
    value: ELEMENT_TYPE.RADIO_BUTTON,
    key: 'Radio Button',
  },
  {
    value: ELEMENT_TYPE.CHECK_BOX,
    key: 'Checkbox',
  },
  {
    value: ELEMENT_TYPE.SWITCH,
    key: 'Switch',
  },
  {
    value: ELEMENT_TYPE.DATE,
    key: 'Date',
  },
  {
    value: ELEMENT_TYPE.TIME,
    key: 'Time',
  },
  {
    value: ELEMENT_TYPE.RATING,
    key: 'Rating',
  },
  {
    value: ELEMENT_TYPE.IMAGE,
    key: 'Image',
  },
  {
    value: ELEMENT_TYPE.SIGNATURE,
    key: 'Signature',
  },
  {
    value: ELEMENT_TYPE.QR,
    key: 'QR',
  },
  {
    value: ELEMENT_TYPE.AUDIO,
    key: 'Audio',
  },
  {
    value: ELEMENT_TYPE.CALCULATE,
    key: 'Calculate',
  },
  {
    value: ELEMENT_TYPE.LOCATION,
    key: 'Location',
  },
  {
    value: ELEMENT_TYPE.FILES,
    key: 'Files',
  },
];

export const REGEX_PATTERNS = [
  {
    value: '^[A-Za-z0-9]+$',
    key: 'Alphanumeric only',
  },
  {
    value: '^[A-Za-z]+$',
    key: 'Letters only',
  },
  {
    value: '^[0-9]+$',
    key: 'Numbers only',
  },
  {
    value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    key: 'Email',
  },
  {
    value: '^(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
    key: 'Phone number',
  },
  {
    value:
      '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
    key: 'URL',
  },
];
