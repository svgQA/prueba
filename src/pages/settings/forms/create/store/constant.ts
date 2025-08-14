import { ELEMENT_TYPE } from '@/types/form';

export const ELEMENT_TYPE_VALUES = [
  {
    value: ELEMENT_TYPE.TITLE,
    label: 'Título',
  },
  {
    value: ELEMENT_TYPE.INPUT,
    label: 'Campo de texto',
  },
  {
    value: ELEMENT_TYPE.TEXT_AREA,
    label: 'Campo de texto multilínea',
  },
  {
    value: ELEMENT_TYPE.NUMBER_INPUT,
    label: 'Campo numérico',
  },
  {
    value: ELEMENT_TYPE.DROPDOWN,
    label: 'Lista desplegable',
  },
  {
    value: ELEMENT_TYPE.RADIO_BUTTON,
    label: 'Opción única',
  },
  {
    value: ELEMENT_TYPE.CHECK_BOX,
    label: 'Selección múltiple',
  },
  {
    value: ELEMENT_TYPE.SWITCH,
    label: 'Selector simple',
  },
  {
    value: ELEMENT_TYPE.DATE,
    label: 'Fecha',
  },
  {
    value: ELEMENT_TYPE.TIME,
    label: 'Hora',
  },
  {
    value: ELEMENT_TYPE.RATING,
    label: 'Calificación',
  },
  {
    value: ELEMENT_TYPE.IMAGE,
    label: 'Imagen',
  },
  {
    value: ELEMENT_TYPE.SIGNATURE,
    label: 'Firma',
  },
  {
    value: ELEMENT_TYPE.QR,
    label: 'Código QR',
  },
  {
    value: ELEMENT_TYPE.BARCODE,
    label: 'Código de barras',
  },
  {
    value: ELEMENT_TYPE.AUDIO,
    label: 'Audio',
  },
  /*{
    value: ELEMENT_TYPE.CALCULATE,
    label: 'Calculate',
  },*/
  {
    value: ELEMENT_TYPE.LOCATION,
    label: 'Ubicación',
  },
  {
    value: ELEMENT_TYPE.FILES,
    label: 'Archivos',
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
